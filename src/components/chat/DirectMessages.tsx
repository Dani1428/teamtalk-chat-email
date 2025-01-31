import { useState } from 'react';
import { usePresence } from '@/hooks/usePresence';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface DirectMessagesProps {
  onSelectUser: (userId: string) => void;
  selectedUserId?: string;
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Smith', avatar: '/avatars/alice.jpg' },
  { id: '2', name: 'Bob Johnson', avatar: '/avatars/bob.jpg' },
  { id: '3', name: 'Carol White', avatar: '/avatars/carol.jpg' },
];

export const DirectMessages = ({ onSelectUser, selectedUserId }: DirectMessagesProps) => {
  const { presenceState } = usePresence();
  const [users] = useState<User[]>(MOCK_USERS);

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-2 p-2">
        {users.map((user) => (
          <Button
            key={user.id}
            variant={selectedUserId === user.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectUser(user.id)}
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {presenceState[user.id]?.online && (
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </div>
              <span className="truncate">{user.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
