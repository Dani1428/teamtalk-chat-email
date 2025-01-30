import { Users } from "lucide-react";

interface ChatHeaderProps {
  channel: string;
}

const ChatHeader = ({ channel }: ChatHeaderProps) => {
  return (
    <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">
          #{channel}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <Users className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-500">24 membres</span>
      </div>
    </div>
  );
};

export default ChatHeader;