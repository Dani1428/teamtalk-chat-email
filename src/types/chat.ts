export interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
  reactions?: Reaction[];
  attachments?: Attachment[];
  isPinned?: boolean;
  isSaved?: boolean;
  isEdited?: boolean;
  replyTo?: string;
}

export type MessageAlignment = 'left' | 'right';

export interface ChatSettings {
  messageGrouping: boolean;
  showTimestamps: boolean;
  messageAlignment: MessageAlignment;
  notifications: boolean;
  sound: boolean;
}

export interface ChatThread {
  id: string;
  participants: User[];
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
