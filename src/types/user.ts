export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
  id: string;
  name: string;
  status: UserStatus;
  avatar?: string;
}