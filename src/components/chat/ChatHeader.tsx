import { Users, Phone, Video, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  channel: string;
}

const ChatHeader = ({ channel }: ChatHeaderProps) => {
  return (
    <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">
          #{channel}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>24 membres</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Phone className="w-5 h-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="w-5 h-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="w-5 h-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;