export type EmailFolder = 'inbox' | 'sent' | 'trash' | 'drafts';

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
  starred: boolean;
  labels?: string[];
  folder: string;
  attachments: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export type RuleOperator = 'contains' | 'not_contains' | 'equals' | 'not_equals';

export type RuleField = 'from' | 'to' | 'subject' | 'content';

export interface SmartFolderRule {
  field: RuleField;
  operator: RuleOperator;
  value: string;
}

export interface SmartFolder {
  id: string;
  name: string;
  rules: SmartFolderRule[];
}

export interface ViewToggleProps {
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export interface EmailComposerProps {
  onSend: (email: Pick<Email, 'to' | 'subject' | 'content'>) => void;
  onClose: () => void;
  initialEmail?: Partial<Email>;
}

export interface SmartFolderEditorProps {
  onSubmit: (folder: Omit<SmartFolder, 'id'>) => void;
  onClose: () => void;
  folder?: SmartFolder;
}

export interface EmailItemProps {
  email: Email;
  selected: boolean;
  onSelect: () => void;
  onClick: () => void;
  viewMode: 'list' | 'grid';
}

export interface EmailListProps {
  emails: Email[];
  selectedEmails: string[];
  onEmailSelect: (emailId: string) => void;
  onEmailClick: (email: Email) => void;
  viewMode: 'list' | 'grid';
}

export interface EmailToolbarProps {
  selectedCount: number;
  onDelete: () => void;
  onMove: (folder: EmailFolder) => void;
  onMarkAsRead: () => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onReply: () => void;
  onForward: () => void;
  onDelete: () => void;
  onMove: (folder: EmailFolder) => void;
  onToggleLabel: (label: string) => void;
}
