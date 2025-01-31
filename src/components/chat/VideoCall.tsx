import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { toast } from "sonner";

const SERVER_URL = "http://localhost:5000";

export default function VideoCall() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);

  const initializeMedia = async () => {
    setIsInitializing(true);
    setMediaError(null);

    try {
      console.log("Démarrage de l'initialisation des médias");
      console.log("Navigator:", {
        userAgent: navigator.userAgent,
        mediaDevices: !!navigator.mediaDevices,
        getUserMedia: !!(navigator.mediaDevices?.getUserMedia)
      });

      // Vérifier si mediaDevices est disponible
      if (!navigator.mediaDevices) {
        throw new Error("mediaDevices n'est pas disponible");
      }

      // Lister les périphériques disponibles
      console.log("Énumération des périphériques...");
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Périphériques trouvés:", devices.map(d => ({
        kind: d.kind,
        label: d.label || 'Sans étiquette'
      })));

      // Tenter d'accéder uniquement au microphone d'abord
      console.log("Tentative d'accès au microphone...");
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false
      });
      console.log("Accès au microphone réussi");

      // Si le microphone fonctionne, arrêter le flux audio et tenter la vidéo
      audioStream.getTracks().forEach(track => track.stop());

      console.log("Tentative d'accès à la caméra...");
      const fullStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      console.log("Accès à la caméra réussi");

      setLocalStream(fullStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = fullStream;
        console.log("Flux vidéo local configuré");
      }
    } catch (error: any) {
      console.error("Erreur complète:", error);
      let errorMessage = "Erreur d'accès aux périphériques";

      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = "Aucun périphérique audio/vidéo n'a été trouvé";
      } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = "L'accès aux périphériques a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = "Le périphérique est peut-être déjà utilisé par une autre application";
      } else {
        errorMessage = `Erreur: ${error.name || 'inconnue'} - ${error.message || 'Pas de message'}`;
      }

      setMediaError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    // Initialiser Socket.IO
    socketRef.current = io(SERVER_URL);
    
    // Démarrer l'initialisation
    initializeMedia();

    return () => {
      cleanup();
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Configurer les gestionnaires de Socket.IO
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connecté au serveur de signalisation");
    });

    socket.on("connect_error", (error: Error) => {
      console.error("Erreur de connexion au serveur:", error);
      toast.error("Erreur de connexion au serveur");
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-disconnected", handleUserDisconnected);

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-disconnected");
    };
  }, []);

  const createPeerConnection = () => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Ajouter les pistes locales
      if (localStream) {
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });
      }

      // Gérer la réception des pistes distantes
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStream(event.streams[0]);
        }
      };

      // Gérer les candidats ICE
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("ice-candidate", event.candidate);
        }
      };

      // Gérer les changements d'état de connexion
      pc.oniceconnectionstatechange = () => {
        console.log("État de la connexion ICE:", pc.iceConnectionState);
        if (pc.iceConnectionState === 'disconnected') {
          toast.error("La connexion a été perdue");
          endCall();
        }
      };

      return pc;
    } catch (error) {
      console.error("Erreur de création de la connexion peer:", error);
      toast.error("Erreur de connexion");
      return null;
    }
  };

  const handleCall = async () => {
    const pc = createPeerConnection();
    if (!pc || !socketRef.current) return;

    peerConnectionRef.current = pc;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current.emit("offer", offer);
      setIsCallActive(true);
    } catch (error) {
      console.error("Erreur lors de l'appel:", error);
      toast.error("Impossible de démarrer l'appel");
      endCall();
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    const pc = createPeerConnection();
    if (!pc || !socketRef.current) return;

    peerConnectionRef.current = pc;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit("answer", answer);
      setIsCallActive(true);
    } catch (error) {
      console.error("Erreur lors de la réponse à l'appel:", error);
      toast.error("Impossible de répondre à l'appel");
      endCall();
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (error) {
      console.error("Erreur lors de la réception de la réponse:", error);
      toast.error("Erreur de connexion");
      endCall();
    }
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Erreur lors de l'ajout du candidat ICE:", error);
    }
  };

  const handleUserDisconnected = () => {
    toast.error("L'autre participant s'est déconnecté");
    endCall();
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCallActive(false);
  };

  const endCall = () => {
    cleanup();
    toast.info("Appel terminé");
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      {isInitializing ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Initialisation de la vidéo...</p>
        </div>
      ) : mediaError ? (
        <div className="text-center py-4">
          <p className="text-red-500 mb-4">{mediaError}</p>
          <Button 
            onClick={initializeMedia}
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <video 
                ref={localVideoRef}
                autoPlay 
                playsInline
                muted 
                className="w-full h-48 bg-gray-900 rounded-lg object-cover"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                Vous
              </span>
            </div>
            <div className="relative">
              <video 
                ref={remoteVideoRef}
                autoPlay 
                playsInline
                className="w-full h-48 bg-gray-900 rounded-lg object-cover"
              />
              <span className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                Interlocuteur
              </span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant={isVideoEnabled ? "default" : "secondary"}
              size="icon"
              onClick={toggleVideo}
              disabled={!localStream}
            >
              {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            
            <Button
              variant={isAudioEnabled ? "default" : "secondary"}
              size="icon"
              onClick={toggleAudio}
              disabled={!localStream}
            >
              {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            
            {!isCallActive ? (
              <Button 
                onClick={handleCall}
                className="px-4"
                disabled={!localStream}
              >
                Démarrer l'appel
              </Button>
            ) : (
              <Button 
                variant="destructive" 
                onClick={endCall}
                size="icon"
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
