import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageSquare, ThumbsUp, Smile, MoreHorizontal, Reply, Pin, Bookmark, Flag, Trash2, Edit, Download, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MessageListProps {
  channel: string;
  searchQuery?: string;
  filterType?: "all" | "unread" | "mentions" | "files";
}

interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  attachments?: {
    type: "image" | "file";
    name: string;
    size: number;
    url: string;
  }[];
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  isPinned?: boolean;
  mentions?: string[];
  isUnread?: boolean;
}

interface MessageItemProps {
  message: Message;
  onReaction: (messageId: string, emoji: string) => void;
  onPin: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onReply: (messageId: string) => void;
  onBookmark: (messageId: string) => void;
  onReport: (messageId: string) => void;
}

// Messages de test
const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Alice Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
    },
    content: "Bonjour à tous ! Voici le nouveau design pour la page d'accueil.",
    timestamp: new Date(2024, 0, 31, 9, 30),
    attachments: [
      {
        type: "image",
        name: "design.png",
        size: 2500000,
        url: "https://example.com/design.png"
      }
    ],
    reactions: [
      { emoji: "👍", count: 3, users: ["u2", "u3", "u4"] },
      { emoji: "❤️", count: 2, users: ["u2", "u5"] }
    ],
    isPinned: true
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Bob Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
    },
    content: "Super travail ! J'aime particulièrement la nouvelle palette de couleurs.",
    timestamp: new Date(2024, 0, 31, 9, 35),
    reactions: [
      { emoji: "👍", count: 2, users: ["u1", "u3"] }
    ]
  }
];

function MessageItem({ message, onReaction, onPin, onDelete, onEdit, onReply, onBookmark, onReport }: MessageItemProps) {
  return (
    <div className={cn(
      "group flex gap-3 py-4 px-4 hover:bg-gray-50",
      message.isPinned && "bg-yellow-50/50"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.user.avatar} alt={message.user.name} />
        <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.user.name}</span>
          <span className="text-sm text-gray-500">
            {format(message.timestamp, "d MMMM à HH:mm", { locale: fr })}
          </span>
          {message.isPinned && (
            <Pin className="h-3 w-3 text-yellow-500" />
          )}
        </div>

        <p className="text-gray-900">{message.content}</p>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
              >
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-xs rounded"
                  />
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span className="flex-1">{attachment.name}</span>
                    <span className="text-gray-500">
                      {Math.round(attachment.size / 1024)} KB
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-6 px-2 gap-1"
                onClick={() => onReaction(message.id, reaction.emoji)}
              >
                <span>{reaction.emoji}</span>
                <span className="text-xs">{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onReaction(message.id, "👍")}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onReaction(message.id, "😊")}
        >
          <Smile className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onReply(message.id)}>
              <Reply className="h-4 w-4 mr-2" />
              Répondre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPin(message.id)}>
              <Pin className="h-4 w-4 mr-2" />
              {message.isPinned ? "Désépingler" : "Épingler"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onBookmark(message.id)}>
              <Bookmark className="h-4 w-4 mr-2" />
              Sauvegarder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(message.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReport(message.id)} className="text-yellow-600">
              <Flag className="h-4 w-4 mr-2" />
              Signaler
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(message.id)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function MessageList({ channel, searchQuery = "", filterType = "all" }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Retirer la réaction si elle existe déjà
          return {
            ...message,
            reactions: message.reactions?.filter(r => r.emoji !== emoji)
          };
        } else {
          // Ajouter la nouvelle réaction
          return {
            ...message,
            reactions: [
              ...(message.reactions || []),
              { emoji, count: 1, users: ["currentUser"] }
            ]
          };
        }
      }
      return message;
    }));
  };

  const handlePin = (messageId: string) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        return { ...message, isPinned: !message.isPinned };
      }
      return message;
    }));
  };

  const handleDelete = (messageId: string) => {
    setMessages(messages.filter(message => message.id !== messageId));
  };

  const handleEdit = (messageId: string) => {
    // TODO: Implémenter l'édition
    console.log("Éditer le message:", messageId);
  };

  const handleReply = (messageId: string) => {
    // TODO: Implémenter la réponse
    console.log("Répondre au message:", messageId);
  };

  const handleBookmark = (messageId: string) => {
    // TODO: Implémenter la sauvegarde
    console.log("Sauvegarder le message:", messageId);
  };

  const handleReport = (messageId: string) => {
    // TODO: Implémenter le signalement
    console.log("Signaler le message:", messageId);
  };

  // Filtrer les messages
  const filteredMessages = messages
    .filter(message => {
      // Filtre de recherche
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          message.content.toLowerCase().includes(searchLower) ||
          message.user.name.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(message => {
      // Filtre par type
      switch (filterType) {
        case "unread":
          return message.isUnread;
        case "mentions":
          return message.mentions?.includes("currentUser");
        case "files":
          return message.attachments && message.attachments.length > 0;
        default:
          return true;
      }
    });

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2">
        {filteredMessages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            onReaction={handleReaction}
            onPin={handlePin}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onReply={handleReply}
            onBookmark={handleBookmark}
            onReport={handleReport}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

export default MessageList;