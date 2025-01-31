import { useState } from 'react';
import { usePresence } from '@/hooks/usePresence';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface DirectMessageChatProps {
  userId: string;
  userName: string;
  userAvatar?: string;
}

export const DirectMessageChat = ({ userId, userName, userAvatar }: DirectMessageChatProps) => {
  const { presenceState } = usePresence();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser', // À remplacer par l'ID de l'utilisateur actuel
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center space-x-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          {presenceState[userId]?.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </div>
        <div>
          <h2 className="font-semibold">{userName}</h2>
          <p className="text-sm text-gray-500">
            {presenceState[userId]?.online ? 'En ligne' : 'Hors ligne'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === 'currentUser'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4 flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Envoyer</Button>
      </div>
    </div>
  );
};
