import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { API_ROUTES } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  isPinned: boolean;
  isSaved: boolean;
}

interface ChannelContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  pinMessage: (messageId: string) => Promise<void>;
}

const ChannelContext = createContext<ChannelContextType | null>(null);

export function ChannelProvider({ children, channelId }: { children: React.ReactNode; channelId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();
  const { toast } = useToast();

  // Charger les messages initiaux
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`${API_ROUTES.chat.messages}/${channelId}`);
        if (!response.ok) throw new Error('Erreur lors du chargement des messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les messages',
          variant: 'destructive',
        });
      }
    };

    loadMessages();
  }, [channelId]);

  // Écouter les nouveaux messages
  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('message-updated', (updatedMessage: Message) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    socket.on('message-deleted', (messageId: string) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    });

    socket.on('message-pinned', ({ messageId, isPinned }: { messageId: string; isPinned: boolean }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isPinned } : msg
        )
      );
    });

    return () => {
      socket.off('new-message');
      socket.off('message-updated');
      socket.off('message-deleted');
      socket.off('message-pinned');
    };
  }, [socket, channelId]);

  const sendMessage = async (content: string) => {
    try {
      const response = await fetch(API_ROUTES.chat.send, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, content }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');

      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        variant: 'destructive',
      });
    }
  };

  const editMessage = async (messageId: string, content: string) => {
    try {
      const response = await fetch(`${API_ROUTES.chat.edit}/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Erreur lors de la modification du message');

      const updatedMessage = await response.json();
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? updatedMessage : msg
        )
      );
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le message',
        variant: 'destructive',
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`${API_ROUTES.chat.delete}/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression du message');

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le message',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const pinMessage = async (messageId: string) => {
    try {
      const message = messages.find(msg => msg.id === messageId);
      if (!message) throw new Error('Message non trouvé');

      const response = await fetch(`${API_ROUTES.chat.pin}/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !message.isPinned }),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'épinglage du message');

      const updatedMessage = await response.json();
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? updatedMessage : msg
        )
      );
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'épingler/désépingler le message',
        variant: 'destructive',
      });
    }
  };

  const value = {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    pinMessage,
  };

  return (
    <ChannelContext.Provider value={value}>
      {children}
    </ChannelContext.Provider>
  );
}

export function useChannel(channelId: string) {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error('useChannel doit être utilisé à l\'intérieur d\'un ChannelProvider');
  }
  return context;
}
