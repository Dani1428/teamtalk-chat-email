import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import useCall from '@/hooks/useCall';

interface CallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'audio' | 'video';
}

const CallDialog: React.FC<CallDialogProps> = ({ isOpen, onClose, type }) => {
  const {
    isInCall,
    callType,
    startCall,
    endCall,
    error
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // Sons pour différents événements
  const callSound = new Audio('/sounds/call-sound.mp3');
  const hangupSound = new Audio('/sounds/hangup-sound.mp3');
  const videoCallSound = new Audio('/sounds/video-call-sound.mp3');

  useEffect(() => {
    if (isOpen && !isInCall) {
      const initCall = async () => {
        try {
          await startCall(type);
          if (type === 'video') {
            videoCallSound.play();
          } else {
            callSound.play();
          }
        } catch (err) {
          console.error('Erreur lors de l\'initialisation de l\'appel:', err);
        }
      };
      initCall();
    }
  }, [isOpen, isInCall, type, startCall]);

  useEffect(() => {
    if (localVideoRef.current && callType === 'video') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Erreur d\'accès à la caméra:', err));
    }
  }, [callType]);

  const handleEndCall = () => {
    hangupSound.play();
    endCall();
    onClose();
  };

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'video' ? 'Appel vidéo' : 'Appel audio'} en cours
          </DialogTitle>
          <DialogDescription>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p>{type === 'video' ? 'L\'appel vidéo est en cours' : 'L\'appel audio est en cours'}</p>
            )}
          </DialogDescription>
        </DialogHeader>

        {type === 'video' && (
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
              Vous
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant={isMuted ? "destructive" : "default"}
            size="icon"
            onClick={toggleMute}
            title={isMuted ? "Activer le micro" : "Couper le micro"}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {type === 'video' && (
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="icon"
              onClick={toggleVideo}
              title={isVideoEnabled ? "Couper la vidéo" : "Activer la vidéo"}
            >
              {isVideoEnabled ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
            </Button>
          )}

          <Button
            variant="destructive"
            size="icon"
            onClick={handleEndCall}
            title="Terminer l'appel"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
