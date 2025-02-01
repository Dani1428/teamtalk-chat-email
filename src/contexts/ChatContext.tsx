import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useSettings } from './SettingsContext';

interface ChatMessage {
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
  isRead: boolean;
  isEdited: boolean;
  threadId?: string;
  threadMessagesCount?: number;
  isGrouped?: boolean;
  showTimestamp?: boolean;
  isPinned?: boolean;
  isSaved?: boolean;
}

interface ChatThread {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
    lastSeen?: Date;
  }[];
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  isTyping?: {
    userId: string;
    userName: string;
  }[];
  isPinned: boolean;
  isMuted: boolean;
}

interface ChatContextType {
  threads: ChatThread[];
  activeThread?: ChatThread;
  setActiveThread: (threadId: string) => void;
  sendMessage: (content: string, attachments?: File[], replyToId?: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  pinMessage: (messageId: string) => Promise<void>;
  saveMessage: (messageId: string) => Promise<void>;
  reportMessage: (messageId: string) => Promise<void>;
  markAsRead: (threadId: string) => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
  searchMessages: (query: string) => Promise<ChatMessage[]>;
  createThread: (participants: string[], type: 'direct' | 'group', name?: string) => Promise<string>;
  pinThread: (threadId: string) => Promise<void>;
  muteThread: (threadId: string) => Promise<void>;
  leaveThread: (threadId: string) => Promise<void>;
  addParticipants: (threadId: string, participantIds: string[]) => Promise<void>;
  removeParticipant: (threadId: string, participantId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const socket = useSocket();
  const { settings } = useSettings();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThreadState] = useState<ChatThread>();

  const loadThreads = async () => {
    try {
      const response = await fetch('/api/chat/threads');
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    }
  };

  // Charger les conversations au démarrage
  useEffect(() => {
    loadThreads();
  }, []);

  // Recharger les conversations quand les paramètres de chat changent
  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent<{
      section: keyof Settings;
      values: Partial<Settings[keyof Settings]>;
    }>) => {
      if (event.detail.section === 'chat') {
        loadThreads();
      }
    };

    window.addEventListener('settings-updated', handleSettingsUpdate as EventListener);
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate as EventListener);
    };
  }, []);

  // Appliquer les paramètres de chat aux threads
  useEffect(() => {
    setThreads(currentThreads => 
      currentThreads.map(thread => ({
        ...thread,
        messages: thread.messages.map(message => ({
          ...message,
          // Appliquer les paramètres de groupement des messages
          isGrouped: settings.chat.messageGrouping,
          // Appliquer les paramètres d'affichage des horodatages
          showTimestamp: settings.chat.showTimestamps,
        })),
      }))
    );
  }, [settings.chat]);

  useEffect(() => {
    // Écouter les nouveaux messages
    socket.on('new_message', (message: ChatMessage) => {
      setThreads(prev => prev.map(thread => {
        if (thread.id === message.threadId) {
          return {
            ...thread,
            messages: [...thread.messages, message],
            lastMessage: message,
            unreadCount: thread.id !== activeThread?.id ? thread.unreadCount + 1 : 0
          };
        }
        return thread;
      }));
    });

    // Écouter les mises à jour de statut des utilisateurs
    socket.on('user_status_change', ({ userId, status }) => {
      setThreads(prev => prev.map(thread => ({
        ...thread,
        participants: thread.participants.map(p => 
          p.id === userId ? { ...p, status } : p
        )
      })));
    });

    // Écouter les indicateurs de frappe
    socket.on('typing_start', ({ threadId, userId, userName }) => {
      setThreads(prev => prev.map(thread => {
        if (thread.id === threadId) {
          const isTyping = thread.isTyping || [];
          if (!isTyping.find(t => t.userId === userId)) {
            return {
              ...thread,
              isTyping: [...isTyping, { userId, userName }]
            };
          }
        }
        return thread;
      }));
    });

    socket.on('typing_stop', ({ threadId, userId }) => {
      setThreads(prev => prev.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            isTyping: (thread.isTyping || []).filter(t => t.userId !== userId)
          };
        }
        return thread;
      }));
    });

    return () => {
      socket.off('new_message');
      socket.off('user_status_change');
      socket.off('typing_start');
      socket.off('typing_stop');
    };
  }, [socket, activeThread]);

  const setActiveThread = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setActiveThreadState(thread);
      markAsRead(threadId);
    }
  };

  const sendMessage = async (content: string, attachments: File[] = [], replyToId?: string) => {
    if (!activeThread) return;

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('threadId', activeThread.id);
      if (replyToId) formData.append('replyToId', replyToId);
      attachments.forEach(file => formData.append('attachments', file));

      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors de l\'envoi du message');

      const message = await response.json();
      socket?.emit('message_sent', message);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });

      if (!response.ok) throw new Error('Erreur lors de la modification du message');

      const updatedMessage = await response.json();
      socket?.emit('message_edited', updatedMessage);
    } catch (error) {
      console.error('Erreur lors de la modification du message:', error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression du message');

      socket?.emit('message_deleted', { messageId });
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      throw error;
    }
  };

  const reactToMessage = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout de la réaction');

      const updatedMessage = await response.json();
      socket?.emit('message_reacted', updatedMessage);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réaction:', error);
      throw error;
    }
  };

  const pinMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}/pin`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de l\'épinglage du message');

      const updatedMessage = await response.json();
      socket?.emit('message_pinned', updatedMessage);
      
      // Update threads state
      setThreads(prev => prev.map(thread => ({
        ...thread,
        messages: thread.messages.map(msg => 
          msg.id === messageId ? { ...msg, isPinned: true } : msg
        )
      })));
    } catch (error) {
      console.error('Erreur lors de l\'épinglage du message:', error);
      throw error;
    }
  };

  const saveMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}/save`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde du message');

      const updatedMessage = await response.json();
      socket?.emit('message_saved', updatedMessage);
      
      // Update threads state
      setThreads(prev => prev.map(thread => ({
        ...thread,
        messages: thread.messages.map(msg => 
          msg.id === messageId ? { ...msg, isSaved: true } : msg
        )
      })));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
      throw error;
    }
  };

  const reportMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}/report`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors du signalement du message');

      socket?.emit('message_reported', { messageId });
    } catch (error) {
      console.error('Erreur lors du signalement du message:', error);
      throw error;
    }
  };

  const markAsRead = async (threadId: string) => {
    try {
      const response = await fetch(`/api/chat/threads/${threadId}/read`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors du marquage comme lu');

      setThreads(prev => prev.map(thread => 
        thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
      ));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  };

  const startTyping = () => {
    if (!activeThread) return;
    socket?.emit('typing_start', { threadId: activeThread.id });
  };

  const stopTyping = () => {
    if (!activeThread) return;
    socket?.emit('typing_stop', { threadId: activeThread.id });
  };

  const searchMessages = async (query: string): Promise<ChatMessage[]> => {
    try {
      const response = await fetch(`/api/chat/messages/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  };

  const createThread = async (participants: string[], type: 'direct' | 'group', name?: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants, type, name })
      });

      if (!response.ok) throw new Error('Erreur lors de la création de la conversation');

      const thread = await response.json();
      setThreads(prev => [thread, ...prev]);
      return thread.id;
    } catch (error) {
      console.error('Erreur lors de la création de la conversation:', error);
      throw error;
    }
  };

  const pinThread = async (threadId: string) => {
    try {
      const response = await fetch(`/api/chat/threads/${threadId}/pin`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de l\'épinglage');

      setThreads(prev => prev.map(thread =>
        thread.id === threadId ? { ...thread, isPinned: true } : thread
      ));
    } catch (error) {
      console.error('Erreur lors de l\'épinglage:', error);
      throw error;
    }
  };

  const muteThread = async (threadId: string) => {
    try {
      const response = await fetch(`/api/chat/threads/${threadId}/mute`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de la mise en sourdine');

      setThreads(prev => prev.map(thread =>
        thread.id === threadId ? { ...thread, isMuted: true } : thread
      ));
    } catch (error) {
      console.error('Erreur lors de la mise en sourdine:', error);
      throw error;
    }
  };

  const leaveThread = async (threadId: string) => {
    try {
      const response = await fetch(`/api/chat/threads/${threadId}/leave`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors du départ de la conversation');

      setThreads(prev => prev.filter(thread => thread.id !== threadId));
      if (activeThread?.id === threadId) {
        setActiveThreadState(undefined);
      }
    } catch (error) {
      console.error('Erreur lors du départ de la conversation:', error);
      throw error;
    }
  };

  const addParticipants = async (threadId: string, participantIds: string[]) => {
    try {
      const response = await fetch(`/api/chat/threads/${threadId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantIds })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout des participants');

      const updatedThread = await response.json();
      setThreads(prev => prev.map(thread =>
        thread.id === threadId ? updatedThread : thread
      ));
    } catch (error) {
      console.error('Erreur lors de l\'ajout des participants:', error);
      throw error;
    }
  };

  const removeParticipant = async (threadId: string, participantId: string) => {
    try {
      const response = await fetch(`/api/chat/threads/${threadId}/participants/${participantId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression du participant');

      const updatedThread = await response.json();
      setThreads(prev => prev.map(thread =>
        thread.id === threadId ? updatedThread : thread
      ));
    } catch (error) {
      console.error('Erreur lors de la suppression du participant:', error);
      throw error;
    }
  };

  return (
    <ChatContext.Provider value={{
      threads,
      activeThread,
      setActiveThread,
      sendMessage,
      editMessage,
      deleteMessage,
      reactToMessage,
      pinMessage,
      saveMessage,
      reportMessage,
      markAsRead,
      startTyping,
      stopTyping,
      searchMessages,
      createThread,
      pinThread,
      muteThread,
      leaveThread,
      addParticipants,
      removeParticipant
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
