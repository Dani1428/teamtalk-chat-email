import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pin, BellOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChatThread } from '@/contexts/ChatContext';

interface ChatThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onClick: () => void;
}

export function ChatThreadItem({ thread, isActive, onClick }: ChatThreadItemProps) {
  const {
    name,
    avatar,
    participants,
    lastMessage,
    unreadCount,
    type,
    isPinned,
    isMuted,
    isTyping
  } = thread;

  // Pour les conversations directes, utiliser le nom du participant
  const displayName = type === 'direct'
    ? participants.find(p => p.id !== 'current_user')?.name
    : name;

  // Obtenir l'avatar pour la conversation
  const displayAvatar = type === 'direct'
    ? participants.find(p => p.id !== 'current_user')?.avatar
    : avatar;

  // Obtenir les initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Formater le dernier message
  const getLastMessagePreview = () => {
    if (isTyping && isTyping.length > 0) {
      return (
        <span className="text-blue-600 dark:text-blue-400">
          {isTyping.length === 1
            ? `${isTyping[0].userName} écrit...`
            : `${isTyping.length} personnes écrivent...`}
        </span>
      );
    }

    if (!lastMessage) return 'Pas de messages';

    const sender = lastMessage.sender.id === 'current_user' ? 'Vous' : lastMessage.sender.name;
    const content = lastMessage.content.length > 30
      ? `${lastMessage.content.slice(0, 30)}...`
      : lastMessage.content;

    return `${sender}: ${content}`;
  };

  return (
    <button
      className={cn(
        'w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg',
        isActive && 'bg-gray-100 dark:bg-gray-800',
        'relative'
      )}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={displayAvatar} />
        <AvatarFallback>
          {getInitials(displayName || 'Chat')}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium truncate">
            {displayName}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {isPinned && (
              <Pin className="h-3 w-3 text-gray-500" />
            )}
            {isMuted && (
              <BellOff className="h-3 w-3 text-gray-500" />
            )}
            {lastMessage && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(lastMessage.timestamp), {
                  addSuffix: true,
                  locale: fr
                })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-sm text-gray-500 truncate">
            {getLastMessagePreview()}
          </p>
          {unreadCount > 0 && !isMuted && (
            <Badge variant="default" className="shrink-0">
              {unreadCount}
            </Badge>
          )}
        </div>

        {/* Statut des participants pour les conversations directes */}
        {type === 'direct' && (
          <div className="mt-1">
            {participants.map(participant => {
              if (participant.id === 'current_user') return null;
              return (
                <div
                  key={participant.id}
                  className={cn(
                    'inline-flex items-center text-xs',
                    participant.status === 'online'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500'
                  )}
                >
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full mr-1',
                    participant.status === 'online'
                      ? 'bg-green-600 dark:bg-green-400'
                      : 'bg-gray-500'
                  )} />
                  {participant.status === 'online'
                    ? 'En ligne'
                    : participant.lastSeen
                      ? `Vu ${formatDistanceToNow(new Date(participant.lastSeen), {
                          addSuffix: true,
                          locale: fr
                        })}`
                      : 'Hors ligne'
                  }
                </div>
              );
            })}
          </div>
        )}
      </div>
    </button>
  );
}
