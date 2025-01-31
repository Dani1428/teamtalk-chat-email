import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Menu, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";

interface ChatAreaProps {
  channel: string;
}

export function ChatArea({ channel }: ChatAreaProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "mentions" | "files">("all");

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen">
      {/* Header fixe */}
      <ChatHeader 
        className="sticky top-0 z-10 bg-white" 
        channel={channel} 
      />
      
      {/* Zone de recherche responsive */}
      <div className="border-b p-2 sm:p-4 sticky top-16 z-10 bg-white">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="relative flex-1">
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans la conversation..."
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>

          <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </div>
      </div>

      {/* Zone de messages scrollable */}
      <ScrollArea className="flex-1 p-2 sm:p-4">
        <MessageList 
          className="flex-1" 
          channel={channel} 
          searchQuery={searchQuery}
          filterType={filterType}
        />
      </ScrollArea>

      {/* Zone de saisie fixe en bas */}
      <div className="border-t p-2 sm:p-4 sticky bottom-0 bg-white">
        <MessageInput 
          className="p-4" 
          channel={channel}
        />
      </div>
    </div>
  );
}

export default ChatArea;
