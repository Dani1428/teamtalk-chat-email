import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Phone, Video } from "lucide-react";
import useCall from "@/hooks/useCall";

const ChatHeader = ({ channel, className }: { channel: string; className?: string }) => {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const { startCall, endCall, error, callType } = useCall();

  const handleAudioCall = async () => {
    try {
      await startCall("audio");
      setIsCallDialogOpen(true);
    } catch (err) {
      console.error('Erreur lors du démarrage de l\'appel audio:', err);
    }
  };

  const handleVideoCall = async () => {
    try {
      await startCall("video");
      setIsCallDialogOpen(true);
    } catch (err) {
      console.error('Erreur lors du démarrage de l\'appel vidéo:', err);
    }
  };

  const handleEndCall = () => {
    endCall();
    setIsCallDialogOpen(false);
  };

  return (
    <header className={`flex items-center justify-between p-4 border-b ${className}`}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{channel}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleAudioCall}>
          <Phone className="h-4 w-4" />
          Appel
        </Button>

        <Button variant="ghost" size="sm" onClick={handleVideoCall}>
          <Video className="h-4 w-4" />
          Appel vidéo
        </Button>

        <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {callType === 'video' ? 'Appel vidéo' : 'Appel audio'} en cours
              </DialogTitle>
              <DialogDescription>
                {error && <p className="text-red-500">{error}</p>}
                {!error && (
                  <p>
                    {callType === 'video' ? 'L\'appel vidéo' : 'L\'appel'} est en cours...
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center gap-4 mt-4">
              <Button variant="destructive" onClick={handleEndCall}>
                Fin de l'appel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default ChatHeader;
