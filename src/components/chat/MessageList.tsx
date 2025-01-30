import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { UserCheck, UserX } from "lucide-react";
import type { User } from "@/types/user";

interface MessageListProps {
  channel: string;
}

const MessageList = ({ channel }: MessageListProps) => {
  // Exemple de messages avec des utilisateurs et leurs statuts
  const messages = [
    {
      id: 1,
      user: {
        id: "1",
        name: "Sophie Martin",
        status: "online",
      } as User,
      content: "Bonjour à tous ! Comment allez-vous ?",
      timestamp: "09:00",
    },
    {
      id: 2,
      user: {
        id: "2",
        name: "Thomas Dubois",
        status: "offline",
      } as User,
      content: "Très bien, merci ! On commence la réunion dans 10 minutes ?",
      timestamp: "09:02",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <UserCheck className="w-4 h-4 text-green-500" />;
      case "offline":
        return <UserX className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-start space-x-3 message-appear hover:bg-gray-50 p-3 rounded-lg transition-colors"
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <div className="w-full h-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {message.user.name.charAt(0)}
                </div>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                {getStatusIcon(message.user.status)}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{message.user.name}</span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <p className="text-gray-700 mt-1">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;