import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import useCall from '@/hooks/useCall';

interface CallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallDialog: React.FC<CallDialogProps> = ({ isOpen, onClose }) => {
  const {
    stream,
    remoteStream,
    callAccepted,
    callEnded,
    isVideo,
    endCall,
  } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // Sons pour différents événements
  const callSound = new Audio('/sounds/call-sound.mp3');
  const hangupSound = new Audio('/sounds/hangup-sound.mp3');
  const videoCallSound = new Audio('/sounds/video-call-sound.mp3');

  // Initialisation de la vidéo locale et distante
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleEndCall = () => {
    hangupSound.play(); // Jouer le son de raccrochage
    endCall();
    onClose();
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  useEffect(() => {
    if (isOpen && !callEnded) {
      if (isVideo) {
        videoCallSound.play(); // Son pour l'appel vidéo
      } else {
        callSound.play(); // Son pour l'appel audio
      }
    }
  }, [isOpen, callEnded, isVideo]);

  return (
    <Dialog open={isOpen && !callEnded} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {isVideo ? 'Appel vidéo' : 'Appel audio'} en cours
          </DialogTitle>
          <DialogDescription>
            {isVideo ? 'L’appel vidéo est en cours.' : 'L’appel audio est en cours.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {isVideo && (
            <>
              <div className="relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-lg bg-black"
                />
                <div className="absolute bottom-2 left-2 text-white text-sm">
                  Vous
                </div>
              </div>

              {callAccepted && (
                <div className="relative">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg bg-black"
                  />
                  <div className="absolute bottom-2 left-2 text-white text-sm">
                    Interlocuteur
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant={isMuted ? "destructive" : "default"}
            size="icon"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {isVideo && (
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="icon"
              onClick={toggleVideo}
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
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
