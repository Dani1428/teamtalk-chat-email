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
  Archive,
  Globe2,
  PieChart,
  Code2,
  MessageSquare,
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
import { TranslationLayer } from './TranslationLayer';
import { PollMessage } from './PollMessage';
import { CodeSnippet } from './CodeSnippet';
import { ThreadView } from './ThreadView';

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
  const [showTranslation, setShowTranslation] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);
  const [showThread, setShowThread] = useState(false);

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

  const handleArchive = async () => {
    try {
      const reason = await new Promise<string>((resolve) => {
        const result = window.prompt('Raison de l\'archivage :');
        resolve(result || 'Non spécifiée');
      });

      const response = await fetch(API_ROUTES.archives.archive(message.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'archivage');

      toast({
        title: 'Message archivé',
        description: 'Le message a été archivé avec succès',
      });

      onDelete?.(message.id);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'archiver le message',
        variant: 'destructive',
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

          {/* Menu contextuel */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 hover:bg-accent/50 focus:ring-2 focus:ring-accent"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white shadow-lg rounded-md border border-gray-200"
              >
                {/* Actions de base */}
                <DropdownMenuItem onClick={handleReply} className="hover:bg-accent/10">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Répondre dans un fil
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                {/* Actions de gestion */}
                <DropdownMenuItem onClick={handlePin} className="hover:bg-accent/10">
                  <Pin className="h-4 w-4 mr-2" />
                  {isPinned ? 'Désépingler' : 'Épingler'}
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleSave} className="hover:bg-accent/10">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaved ? 'Retirer des favoris' : 'Sauvegarder'}
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleArchive} className="hover:bg-accent/10">
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Nouvelles fonctionnalités */}
                <DropdownMenuItem onClick={() => setShowTranslation(true)} className="hover:bg-accent/10">
                  <Globe2 className="h-4 w-4 mr-2" />
                  Traduire
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setShowPoll(true)} className="hover:bg-accent/10">
                  <PieChart className="h-4 w-4 mr-2" />
                  Créer un sondage
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setShowCodeSnippet(true)} className="hover:bg-accent/10">
                  <Code2 className="h-4 w-4 mr-2" />
                  Ajouter un code
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                {/* Actions de modération */}
                {onEdit && (
                  <DropdownMenuItem onClick={handleEdit} className="hover:bg-accent/10">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onClick={handleReport} className="hover:bg-accent/10">
                  <Flag className="h-4 w-4 mr-2" />
                  Signaler
                </DropdownMenuItem>
                
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Composants des nouvelles fonctionnalités */}
          {showTranslation && (
            <TranslationLayer
              content={message.content}
              messageId={message.id}
              onClose={() => setShowTranslation(false)}
            />
          )}

          {showPoll && (
            <PollMessage
              question={message.content}
              options={message.pollOptions || []}
              totalVotes={message.pollTotalVotes || 0}
              onVote={handlePollVote}
              onClose={() => setShowPoll(false)}
            />
          )}

          {showCodeSnippet && (
            <CodeSnippet
              code={message.content}
              language={message.codeLanguage || 'javascript'}
              fileName={message.fileName}
              onClose={() => setShowCodeSnippet(false)}
            />
          )}

          {showThread && (
            <ThreadView
              threadId={message.id}
              onClose={() => setShowThread(false)}
            />
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
      </div>
    </div>
  );
}
