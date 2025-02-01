import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import { useSettings } from '@/contexts/SettingsContext';
import { useToast } from '@/components/ui/use-toast';
import {
  Smile,
  Reply,
  MoreHorizontal,
  Download,
  Link2,
  Trash2,
  Edit2,
  Forward,
  Pin,
  Flag,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { API_ROUTES } from '@/config/api';

interface ChatMessageProps {
  message: ChatMessageType;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onSave?: (messageId: string) => void;
  onReport?: (messageId: string) => void;
}

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🤔'];

export function ChatMessage({ 
  message, 
  isFirstInGroup, 
  isLastInGroup,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onSave,
  onReport,
}: ChatMessageProps) {
  const { settings } = useSettings();
  const { messageGrouping, showTimestamps, messageAlignment } = settings.chat;
  const { toast } = useToast();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPinned, setIsPinned] = useState(message.isPinned);
  const [isSaved, setIsSaved] = useState(message.isSaved);
  const [isEditing, setIsEditing] = useState(false);

  const showAvatar = !messageGrouping || isLastInGroup;
  const showTimestamp = showTimestamps || isLastInGroup;
  const alignRight = messageAlignment === 'right';

  const handleReply = () => {
    if (onReply) {
      onReply(message.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(message.id);
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(message.id);
        toast({
          title: "Message supprimé",
          description: "Le message a été supprimé avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message.",
        variant: "destructive",
      });
    }
  };

  const handlePin = async () => {
    try {
      if (onPin) {
        await onPin(message.id);
        setIsPinned(!isPinned);
        toast({
          title: isPinned ? "Message désépinglé" : "Message épinglé",
          description: isPinned ? "Le message a été désépinglé." : "Le message a été épinglé.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'épinglage du message.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (onSave) {
        await onSave(message.id);
        setIsSaved(!isSaved);
        toast({
          title: isSaved ? "Message retiré" : "Message sauvegardé",
          description: isSaved ? "Le message a été retiré des favoris." : "Le message a été ajouté aux favoris.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le message.",
        variant: "destructive",
      });
    }
  };

  const handleReport = async () => {
    try {
      if (onReport) {
        await onReport(message.id);
        toast({
          title: "Message signalé",
          description: "Le message a été signalé aux modérateurs.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de signaler le message.",
        variant: "destructive",
      });
    }
  };

  const handleReaction = async (emoji: string) => {
    try {
      const response = await fetch(`${API_ROUTES.chat.reactions}/${message.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout de la réaction');
      
      setShowEmojiPicker(false);
      // Mettre à jour l'interface avec la nouvelle réaction
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la réaction.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn(
      "group relative flex gap-3 py-2 px-4 hover:bg-accent/5",
      alignRight ? 'flex-row-reverse' : 'flex-row'
    )}>
      {showAvatar && (
        <Avatar
          src={message.sender.avatar}
          alt={message.sender.name}
          className="h-8 w-8"
        />
      )}
      <div className={cn(
        "flex flex-col flex-1",
        alignRight ? 'items-end' : 'items-start'
      )}>
        {isFirstInGroup && (
          <div className={cn(
            "flex items-center gap-2 mb-1",
            alignRight ? 'flex-row-reverse' : 'flex-row'
          )}>
            <span className="font-medium text-sm">{message.sender.name}</span>
            {showTimestamp && (
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.timestamp), 'HH:mm', { locale: fr })}
              </span>
            )}
          </div>
        )}
        
        <div className={cn(
          "relative group flex items-start gap-2",
          alignRight ? 'flex-row-reverse' : 'flex-row'
        )}>
          <div className={cn(
            "px-4 py-2 rounded-lg",
            alignRight 
              ? 'bg-primary text-primary-foreground rounded-tr-none' 
              : 'bg-muted rounded-tl-none'
          )}>
            {message.content}
          </div>

          {/* Actions du message */}
          <div className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            alignRight ? 'left-full ml-2' : 'right-full mr-2',
            "flex items-center gap-1"
          )}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              onClick={handleReply}
            >
              <Reply className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={alignRight ? 'end' : 'start'}>
                <DropdownMenuItem onClick={handlePin}>
                  <Pin className="h-4 w-4 mr-2" />
                  {isPinned ? 'Désépingler' : 'Épingler'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaved ? 'Retirer des favoris' : 'Sauvegarder'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="h-4 w-4 mr-2" />
                  Signaler
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Réactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction) => (
              <div
                key={reaction.emoji}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-sm cursor-pointer hover:bg-muted/80"
                onClick={() => handleReaction(reaction.emoji)}
              >
                <span>{reaction.emoji}</span>
                <span className="text-xs text-muted-foreground">{reaction.count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Sélecteur d'émojis */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align={alignRight ? 'end' : 'start'}>
            <div className="flex gap-1">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  className="p-2 hover:bg-accent rounded"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
