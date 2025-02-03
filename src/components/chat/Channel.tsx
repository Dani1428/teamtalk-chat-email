import React, { useState } from 'react';
import { Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './ChatMessage';
import { Archives } from './Archives';
import { useChannel } from '@/contexts/ChannelContext';

interface ChannelProps {
  channelId: string;
}

export function Channel({ channelId }: ChannelProps) {
  const { messages, sendMessage, editMessage, deleteMessage, pinMessage } = useChannel(channelId);
  const [showArchives, setShowArchives] = useState(false);

  const handleArchiveClick = () => {
    setShowArchives(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du canal */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-lg font-semibold">Canal général</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleArchiveClick}
          className="flex items-center gap-2"
        >
          <Archive className="h-4 w-4" />
          Archives
        </Button>
      </div>

      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => {
          const isFirstInGroup = index === 0 || messages[index - 1].sender.id !== message.sender.id;
          const isLastInGroup = index === messages.length - 1 || messages[index + 1].sender.id !== message.sender.id;

          return (
            <ChatMessage
              key={message.id}
              message={message}
              isFirstInGroup={isFirstInGroup}
              isLastInGroup={isLastInGroup}
              onEdit={editMessage}
              onDelete={deleteMessage}
              onPin={pinMessage}
            />
          );
        })}
      </div>

      {/* Modal des archives */}
      <Archives
        channelId={channelId}
        isOpen={showArchives}
        onClose={() => setShowArchives(false)}
      />
    </div>
  );
}
