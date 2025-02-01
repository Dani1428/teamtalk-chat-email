import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Smile,
  Reply,
  MoreHorizontal,
  Download,
  Link2,
  Trash2,
  Edit2,
  Forward,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface ChatMessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isMe: boolean;
  reactions?: Reaction[];
  attachments?: Attachment[];
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
}

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🤔'];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export function ChatMessage({
  id,
  content,
  sender,
  timestamp,
  isMe,
  reactions = [],
  attachments = [],
  replyTo,
  onReply,
  onReact,
  onDelete,
  onEdit,
  onForward,
}: ChatMessageProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleReaction = (emoji: string) => {
    onReact?.(id, emoji);
    setShowEmojiPicker(false);
  };

  const handleCopyLink = () => {
    // Implémenter la copie du lien du message
    navigator.clipboard.writeText(`${window.location.origin}/chat/message/${id}`);
  };

  return (
    <div className={cn(
      'flex gap-3 max-w-[80%] group',
      isMe ? 'ml-auto flex-row-reverse' : ''
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.avatar} alt={sender.name} />
        <AvatarFallback>{sender.name[0]}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        {/* En-tête du message */}
        <div className={cn(
          'flex items-center gap-2 text-sm',
          isMe ? 'flex-row-reverse' : ''
        )}>
          <span className="font-medium">{sender.name}</span>
          <span className="text-gray-500">
            {format(timestamp, 'HH:mm', { locale: fr })}
          </span>
        </div>

        {/* Message référencé */}
        {replyTo && (
          <div className={cn(
            'text-sm border-l-2 pl-2 mb-1',
            isMe ? 'border-blue-500' : 'border-gray-500'
          )}>
            <span className="font-medium">{replyTo.sender.name}</span>
            <p className="text-gray-500 line-clamp-1">{replyTo.content}</p>
          </div>
        )}

        {/* Contenu du message */}
        <div className={cn(
          'rounded-lg p-3 break-words',
          isMe ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
        )}>
          <p>{content}</p>

          {/* Pièces jointes */}
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 p-2 rounded bg-white/10"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{file.name}</p>
                    <p className="text-xs opacity-70">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Réactions */}
        {reactions.length > 0 && (
          <div className={cn(
            'flex flex-wrap gap-1 mt-1',
            isMe ? 'justify-end' : ''
          )}>
            {reactions.map((reaction, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => handleReaction(reaction.emoji)}
              >
                {reaction.emoji} {reaction.count}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={cn(
          'flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
          isMe ? 'justify-end' : ''
        )}>
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align={isMe ? 'end' : 'start'}>
              <div className="flex gap-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    onClick={() => handleReaction(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onReply?.(id)}
          >
            <Reply className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMe ? 'end' : 'start'}>
              {isMe && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(id)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete?.(id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => onForward?.(id)}>
                <Forward className="h-4 w-4 mr-2" />
                Transférer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Link2 className="h-4 w-4 mr-2" />
                Copier le lien
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
