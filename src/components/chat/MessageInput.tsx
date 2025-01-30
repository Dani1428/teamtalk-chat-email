import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";

interface MessageInputProps {
  channel: string;
}

const MessageInput = ({ channel }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Logique d'envoi du message
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${channel}`}
            className="min-h-[80px] resize-none"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" type="button">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;