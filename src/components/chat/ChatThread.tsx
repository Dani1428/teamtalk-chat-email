import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
}

interface ChatThreadProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string, attachments: File[], replyToId?: string) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onForwardMessage: (messageId: string) => void;
}

export function ChatThread({
  messages,
  currentUserId,
  onSendMessage,
  onReaction,
  onDeleteMessage,
  onEditMessage,
  onForwardMessage,
}: ChatThreadProps) {
  const [replyTo, setReplyTo] = useState<Message['replyTo']>();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Faire défiler jusqu'en bas lors de la réception de nouveaux messages
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (content: string, attachments: File[]) => {
    onSendMessage(content, attachments, replyTo?.id);
    setReplyTo(undefined);
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReply = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyTo({
        id: message.id,
        content: message.content,
        sender: {
          name: message.sender.name,
        },
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4"
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              {...message}
              isMe={message.sender.id === currentUserId}
              onReply={handleReply}
              onReact={onReaction}
              onDelete={onDeleteMessage}
              onEdit={onEditMessage}
              onForward={onForwardMessage}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-24 right-4 rounded-full shadow-lg"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}

      <ChatInput
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(undefined)}
      />
    </div>
  );
}
