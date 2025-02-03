import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './ChatMessage';
import { Separator } from '@/components/ui/separator';
import { API_ROUTES } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';

interface Thread {
  id: string;
  originalMessage: any;
  replies: any[];
  participantsCount: number;
  lastReplyAt: string;
}

interface ThreadViewProps {
  threadId: string;
  onClose: () => void;
}

export function ThreadView({ threadId, onClose }: ThreadViewProps) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const { toast } = useToast();

  const loadThread = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_ROUTES.chat.threads}/${threadId}`);
      if (!response.ok) throw new Error('Erreur de chargement du fil de discussion');
      const data = await response.json();
      setThread(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le fil de discussion',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadThread();
  }, [threadId]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const response = await fetch(`${API_ROUTES.chat.threads}/${threadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newReply }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi de la réponse');

      const reply = await response.json();
      setThread(prev => prev ? {
        ...prev,
        replies: [...prev.replies, reply],
        participantsCount: new Set([...prev.replies.map(r => r.sender.id), reply.sender.id]).size,
        lastReplyAt: new Date().toISOString(),
      } : null);

      setNewReply('');
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer la réponse',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!thread) return null;

  return (
    <div className="flex flex-col h-full border-l">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Fil de discussion</h2>
          <span className="text-sm text-muted-foreground">
            {thread.participantsCount} participant{thread.participantsCount > 1 ? 's' : ''}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <ChatMessage
            message={thread.originalMessage}
            isFirstInGroup
            isLastInGroup
          />

          <Separator className="my-4" />

          <div className="space-y-4">
            {thread.replies.map((reply, index) => (
              <ChatMessage
                key={reply.id}
                message={reply}
                isFirstInGroup={index === 0 || thread.replies[index - 1].sender.id !== reply.sender.id}
                isLastInGroup={index === thread.replies.length - 1 || thread.replies[index + 1].sender.id !== reply.sender.id}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <form onSubmit={handleReply} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Répondre au fil de discussion..."
            className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" disabled={!newReply.trim()}>
            Répondre
          </Button>
        </div>
      </form>
    </div>
  );
}
