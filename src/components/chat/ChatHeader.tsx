import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Video } from "lucide-react";
import CallDialog from "@/components/call/CallDialog";

interface ChatHeaderProps {
  channel: string;
  className?: string;
}

const ChatHeader = ({ channel, className }: ChatHeaderProps) => {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');

  const handleAudioCall = () => {
    setCallType('audio');
    setIsCallDialogOpen(true);
  };

  const handleVideoCall = () => {
    setCallType('video');
    setIsCallDialogOpen(true);
  };

  return (
    <header className={`flex items-center justify-between p-4 border-b ${className}`}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{channel}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleAudioCall}
          title="Démarrer un appel audio"
        >
          <Phone className="h-4 w-4 mr-2" />
          Appel
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleVideoCall}
          title="Démarrer un appel vidéo"
        >
          <Video className="h-4 w-4 mr-2" />
          Appel vidéo
        </Button>

        <CallDialog
          isOpen={isCallDialogOpen}
          onClose={() => setIsCallDialogOpen(false)}
          type={callType}
        />
      </div>
    </header>
  );
};

export default ChatHeader;
