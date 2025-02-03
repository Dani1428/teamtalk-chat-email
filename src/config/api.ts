export const API_KEYS = {
  GOOGLE_AI: "AIzaSyCYYemWEg2u4p3rwYnKZv3Q54ZX-gUeUpM"
};

export const API_ENDPOINTS = {
  GOOGLE_AI: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

export const WS_URL = `${WS_BASE_URL}/ws`;

export const API_ROUTES = {
  departments: {
    list: `${BASE_URL}/departments`,
    create: `${BASE_URL}/departments`,
    delete: (id: number) => `${BASE_URL}/departments/${id}`,
    update: (id: number) => `${BASE_URL}/departments/${id}`,
    channels: {
      create: (departmentId: number) => `${BASE_URL}/departments/${departmentId}/channels`,
      delete: (departmentId: number, channelName: string) => `${BASE_URL}/departments/${departmentId}/channels/${channelName}`,
    },
  },
  channels: {
    create: (departmentId: number) => `${BASE_URL}/departments/${departmentId}/channels`,
    delete: (departmentId: number, channel: string) => `${BASE_URL}/departments/${departmentId}/channels/${channel}`,
  },
  roles: {
    list: `${BASE_URL}/roles`,
    create: `${BASE_URL}/roles`,
    update: (id: number) => `${BASE_URL}/roles/${id}`,
    delete: (id: number) => `${BASE_URL}/roles/${id}`,
    permissions: `${BASE_URL}/permissions`,
  },
  users: {
    list: `${BASE_URL}/users`,
    create: `${BASE_URL}/users`,
    update: (id: number) => `${BASE_URL}/users/${id}`,
    delete: (id: number) => `${BASE_URL}/users/${id}`,
    invite: `${BASE_URL}/users/invite`,
    bulkActions: {
      resetPassword: `${BASE_URL}/users/bulk/reset-password`,
      email: `${BASE_URL}/users/bulk/email`,
      settings: `${BASE_URL}/users/bulk/settings`,
    },
  },
  chat: {
    messages: `${BASE_URL}/chat/messages`,
    send: `${BASE_URL}/chat/messages`,
    edit: `${BASE_URL}/chat/messages`,
    delete: `${BASE_URL}/chat/messages`,
    pin: `${BASE_URL}/chat/messages/pin`,
    reactions: `${BASE_URL}/chat/reactions`,
  },
  archives: {
    list: (channelId: string) => `${BASE_URL}/archives/channel/${channelId}`,
    archive: (messageId: number) => `${BASE_URL}/archives/message/${messageId}`,
    restore: (archiveId: number) => `${BASE_URL}/archives/restore/${archiveId}`,
  },
  settings: {
    smtp: `${BASE_URL}/settings/smtp`,
    email: `${BASE_URL}/settings/email`,
    getDefaults: `${BASE_URL}/settings/defaults`,
    updateDefaults: `${BASE_URL}/settings/defaults`,
    updateUser: (userId: number) => `${BASE_URL}/settings/user/${userId}`,
  },
};
