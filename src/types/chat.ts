export interface ChatMessage {
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
}

export interface ChatThread {
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

export interface ChatState {
  threads: ChatThread[];
  activeThread?: ChatThread;
  loading: boolean;
  error?: string;
}

export interface ChatAction {
  type: string;
  payload?: any;
}

export type ChatDispatch = (action: ChatAction) => void;
