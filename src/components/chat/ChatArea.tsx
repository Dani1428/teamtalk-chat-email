import React, { useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function ChatArea() {
  const {
    activeThread,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    pinMessage,
    saveMessage,
    reportMessage,
    startTyping,
    stopTyping
  } = useChat();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isTypingTimeoutRef = useRef<NodeJS.Timeout>();

  // Faire défiler jusqu'au dernier message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread?.messages]);

  const handleSendMessage = async (content: string, attachments: File[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    
    try {
      await sendMessage(content, attachments);
      
      // Faire défiler jusqu'au nouveau message
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      // TODO: Afficher une notification d'erreur
    }
  };

  const handleTyping = () => {
    startTyping();
    
    // Réinitialiser le timeout
    if (isTypingTimeoutRef.current) {
      clearTimeout(isTypingTimeoutRef.current);
    }
    
    // Arrêter l'indicateur de frappe après 2 secondes d'inactivité
    isTypingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  if (!activeThread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Sélectionnez une conversation
        </h3>
        <p className="text-gray-500 text-center mb-4">
          Choisissez une conversation existante ou commencez-en une nouvelle
        </p>
        <Button onClick={() => {/* TODO: Ouvrir le dialog de nouvelle conversation */}}>
          Nouvelle conversation
        </Button>
      </div>
    );
  }

  const { messages, participants, isTyping } = activeThread;

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader thread={activeThread} />
      
      <ScrollArea
        ref={scrollRef}
        className="flex-1 p-4"
      >
        <div className="space-y-4">
          {messages.map((message, index) => {
            // Regrouper les messages consécutifs du même expéditeur
            const prevMessage = messages[index - 1];
            const nextMessage = messages[index + 1];
            const isFirstInGroup = !prevMessage || 
              prevMessage.sender.id !== message.sender.id ||
              new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 5 * 60 * 1000;
            const isLastInGroup = !nextMessage || 
              nextMessage.sender.id !== message.sender.id ||
              new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime() > 5 * 60 * 1000;

            return (
              <ChatMessage
                key={message.id}
                message={message}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                onReply={(messageId) => {/* TODO: Implement reply logic */}}
                onEdit={editMessage}
                onDelete={deleteMessage}
                onReact={reactToMessage}
                onPin={pinMessage}
                onSave={saveMessage}
                onReport={reportMessage}
              />
            );
          })}
        </div>

        {/* Indicateur de frappe */}
        {isTyping && isTyping.length > 0 && (
          <div className="text-sm text-gray-500 mt-2">
            {isTyping.length === 1
              ? `${isTyping[0].userName} est en train d'écrire...`
              : `${isTyping.length} personnes sont en train d'écrire...`}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <ChatInput
          onSend={handleSendMessage}
          onTyping={handleTyping}
          participants={participants}
        />
      </div>
    </div>
  );
}
