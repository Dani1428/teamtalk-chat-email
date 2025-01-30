import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";

interface MessageListProps {
  channel: string;
}

const MessageList = ({ channel }: MessageListProps) => {
  // Exemple de messages (à remplacer par des données réelles)
  const messages = [
    {
      id: 1,
      user: "Sophie Martin",
      content: "Bonjour à tous ! Comment allez-vous ?",
      timestamp: "09:00",
    },
    {
      id: 2,
      user: "Thomas Dubois",
      content: "Très bien, merci ! On commence la réunion dans 10 minutes ?",
      timestamp: "09:02",
    },
  ];

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-start space-x-3 message-appear"
          >
            <Avatar className="w-8 h-8">
              <div className="w-full h-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {message.user.charAt(0)}
              </div>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{message.user}</span>
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