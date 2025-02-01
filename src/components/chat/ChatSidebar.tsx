import React, { useState } from 'react';
import { Search, Plus, Settings } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NewChatDialog } from './NewChatDialog';
import { ChatThreadItem } from './ChatThreadItem';

export function ChatSidebar() {
  const { threads, activeThread, setActiveThread } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);

  // Filtrer et trier les conversations
  const filteredThreads = threads
    .filter(thread => {
      const searchLower = searchQuery.toLowerCase();
      return (
        thread.name?.toLowerCase().includes(searchLower) ||
        thread.participants.some(p => 
          p.name.toLowerCase().includes(searchLower)
        ) ||
        thread.lastMessage?.content.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // D'abord les conversations épinglées
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Ensuite par date du dernier message
      const aDate = a.lastMessage?.timestamp || new Date(0);
      const bDate = b.lastMessage?.timestamp || new Date(0);
      return bDate.getTime() - aDate.getTime();
    });

  return (
    <div className="w-80 border-r flex flex-col h-full">
      {/* En-tête */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNewChat(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des conversations */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredThreads.map((thread) => (
            <ChatThreadItem
              key={thread.id}
              thread={thread}
              isActive={thread.id === activeThread?.id}
              onClick={() => setActiveThread(thread.id)}
            />
          ))}

          {filteredThreads.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              {searchQuery
                ? 'Aucune conversation trouvée'
                : 'Commencez une nouvelle conversation'}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Dialog pour nouvelle conversation */}
      <NewChatDialog
        open={showNewChat}
        onOpenChange={setShowNewChat}
      />
    </div>
  );
}
