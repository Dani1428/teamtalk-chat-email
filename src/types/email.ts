export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  preview: string;
  date: string;
  isRead: boolean;
  folder: 'inbox' | 'sent' | 'archived' | 'spam' | 'trash';
  priority?: 'low' | 'normal' | 'high';
  attachments?: { name: string; size: number }[];
}
