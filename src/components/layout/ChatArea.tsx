import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

interface ChatAreaProps {
  channel: string;
}

const ChatArea = ({ channel }: ChatAreaProps) => {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader channel={channel} />
      <MessageList channel={channel} />
      <MessageInput channel={channel} />
    </div>
  );
};

export default ChatArea;