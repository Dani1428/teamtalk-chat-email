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
      navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true // Adding audio to ensure we have both streams
      })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            // Ensure autoplay is enabled
            localVideoRef.current.play().catch(e => console.error('Error playing video:', e));
          }
        })
        .catch(err => {
          console.error('Erreur d\'accès aux périphériques:', err);
          onClose(); // Close the dialog if we can't access the media devices
        });

      // Cleanup function to stop all tracks when component unmounts
      return () => {
        if (localVideoRef.current?.srcObject) {
          const stream = localVideoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [callType, onClose]);

  const handleEndCall = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    hangupSound.play().catch(e => console.error('Error playing hangup sound:', e));
    endCall();
    onClose();
  };

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
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
            <span className={error ? "text-red-500" : ""}>
              {error || `${type === 'video' ? 'L\'appel vidéo est en cours' : 'L\'appel audio est en cours'}`}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {type === 'video' && (
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMute}
              className={isMuted ? "bg-red-100 hover:bg-red-200" : ""}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {type === 'video' && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVideo}
                className={!isVideoEnabled ? "bg-red-100 hover:bg-red-200" : ""}
              >
                {!isVideoEnabled ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallDialog;
