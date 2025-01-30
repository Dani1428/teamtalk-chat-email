import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile, Mic, Image } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2 px-3">
          <Button variant="ghost" size="icon" type="button" className="text-gray-500 hover:text-gray-700">
            <Image className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" type="button" className="text-gray-500 hover:text-gray-700">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" type="button" className="text-gray-500 hover:text-gray-700">
            <Mic className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message #${channel}`}
              className="min-h-[80px] pr-12 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;