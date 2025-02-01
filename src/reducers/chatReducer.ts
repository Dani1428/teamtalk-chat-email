import { ChatState, ChatAction, ChatMessage, ChatThread } from '@/types/chat';

export const initialState: ChatState = {
  threads: [],
  activeThread: undefined,
  loading: false,
  error: undefined,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: undefined,
      };

    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'SET_THREADS':
      return {
        ...state,
        threads: action.payload,
        loading: false,
        error: undefined,
      };

    case 'SET_ACTIVE_THREAD':
      return {
        ...state,
        activeThread: state.threads.find(t => t.id === action.payload),
      };

    case 'ADD_MESSAGE':
      const newMessage: ChatMessage = action.payload;
      return {
        ...state,
        threads: state.threads.map(thread => {
          if (thread.id === newMessage.threadId) {
            return {
              ...thread,
              messages: [...thread.messages, newMessage],
              lastMessage: newMessage,
              unreadCount: thread.id !== state.activeThread?.id 
                ? thread.unreadCount + 1 
                : thread.unreadCount,
            };
          }
          return thread;
        }),
        activeThread: state.activeThread?.id === newMessage.threadId
          ? {
              ...state.activeThread,
              messages: [...state.activeThread.messages, newMessage],
              lastMessage: newMessage,
            }
          : state.activeThread,
      };

    case 'UPDATE_MESSAGE':
      const updatedMessage: ChatMessage = action.payload;
      return {
        ...state,
        threads: state.threads.map(thread => {
          if (thread.id === updatedMessage.threadId) {
            return {
              ...thread,
              messages: thread.messages.map(msg =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              ),
              lastMessage: thread.lastMessage?.id === updatedMessage.id
                ? updatedMessage
                : thread.lastMessage,
            };
          }
          return thread;
        }),
        activeThread: state.activeThread?.id === updatedMessage.threadId
          ? {
              ...state.activeThread,
              messages: state.activeThread.messages.map(msg =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              ),
              lastMessage: state.activeThread.lastMessage?.id === updatedMessage.id
                ? updatedMessage
                : state.activeThread.lastMessage,
            }
          : state.activeThread,
      };

    case 'DELETE_MESSAGE':
      const messageId = action.payload;
      return {
        ...state,
        threads: state.threads.map(thread => ({
          ...thread,
          messages: thread.messages.filter(msg => msg.id !== messageId),
          lastMessage: thread.lastMessage?.id === messageId
            ? thread.messages[thread.messages.length - 2]
            : thread.lastMessage,
        })),
        activeThread: state.activeThread
          ? {
              ...state.activeThread,
              messages: state.activeThread.messages.filter(
                msg => msg.id !== messageId
              ),
              lastMessage: state.activeThread.lastMessage?.id === messageId
                ? state.activeThread.messages[
                    state.activeThread.messages.length - 2
                  ]
                : state.activeThread.lastMessage,
            }
          : undefined,
      };

    case 'MARK_THREAD_AS_READ':
      const threadId = action.payload;
      return {
        ...state,
        threads: state.threads.map(thread =>
          thread.id === threadId
            ? { ...thread, unreadCount: 0 }
            : thread
        ),
        activeThread: state.activeThread?.id === threadId
          ? { ...state.activeThread, unreadCount: 0 }
          : state.activeThread,
      };

    case 'UPDATE_TYPING_STATUS':
      const { threadId: typingThreadId, userId, userName, isTyping } = action.payload;
      return {
        ...state,
        threads: state.threads.map(thread => {
          if (thread.id === typingThreadId) {
            const currentTyping = thread.isTyping || [];
            const newTyping = isTyping
              ? [...currentTyping, { userId, userName }]
              : currentTyping.filter(t => t.userId !== userId);
            return { ...thread, isTyping: newTyping };
          }
          return thread;
        }),
        activeThread: state.activeThread?.id === typingThreadId
          ? {
              ...state.activeThread,
              isTyping: isTyping
                ? [...(state.activeThread.isTyping || []), { userId, userName }]
                : (state.activeThread.isTyping || []).filter(
                    t => t.userId !== userId
                  ),
            }
          : state.activeThread,
      };

    case 'UPDATE_THREAD':
      const updatedThread: ChatThread = action.payload;
      return {
        ...state,
        threads: state.threads.map(thread =>
          thread.id === updatedThread.id ? updatedThread : thread
        ),
        activeThread: state.activeThread?.id === updatedThread.id
          ? updatedThread
          : state.activeThread,
      };

    case 'ADD_THREAD':
      const newThread: ChatThread = action.payload;
      return {
        ...state,
        threads: [newThread, ...state.threads],
      };

    case 'REMOVE_THREAD':
      const threadToRemove = action.payload;
      return {
        ...state,
        threads: state.threads.filter(thread => thread.id !== threadToRemove),
        activeThread: state.activeThread?.id === threadToRemove
          ? undefined
          : state.activeThread,
      };

    default:
      return state;
  }
}
