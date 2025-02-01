import React from 'react';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

interface ChatProps {
  className?: string;
}

export function Chat({ className }: ChatProps) {
  const { activeThread } = useChat();

  return (
    <div className={cn('flex h-full', className)}>
      {/* Barre latérale avec la liste des conversations */}
      <ChatSidebar />

      {/* Zone principale du chat */}
      <ChatArea />
    </div>
  );
}
