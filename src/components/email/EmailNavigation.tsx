import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Inbox,
  Send,
  Trash2,
  Plus,
  FolderPlus,
  Folder,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Email, SmartFolder } from '@/types';

interface EmailNavigationProps {
  currentView: string;
  emails: Email[];
  smartFolders: SmartFolder[];
  onFolderClick: (folder: string) => void;
  onCreateSmartFolder: () => void;
  onDeleteSmartFolder: (id: string) => void;
  onSmartFolderClick: (folder: SmartFolder) => void;
  onCompose: () => void;
}

export function EmailNavigation({
  currentView,
  emails,
  smartFolders,
  onFolderClick,
  onCreateSmartFolder,
  onDeleteSmartFolder,
  onSmartFolderClick,
  onCompose,
}: EmailNavigationProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Compose Button */}
      <div className="p-4">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 rounded-full py-6"
          onClick={onCompose}
        >
          <Plus className="h-5 w-5" />
          <span>Nouveau message</span>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          <Button
            variant={currentView === 'inbox' ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3 rounded-lg"
            onClick={() => onFolderClick('inbox')}
          >
            <Inbox className="h-5 w-5" />
            <span>Boîte de réception</span>
            {emails.filter(e => !e.isRead && e.folder === 'inbox').length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {emails.filter(e => !e.isRead && e.folder === 'inbox').length}
              </Badge>
            )}
          </Button>
          <Button
            variant={currentView === 'sent' ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3 rounded-lg"
            onClick={() => onFolderClick('sent')}
          >
            <Send className="h-5 w-5" />
            <span>Messages envoyés</span>
          </Button>
          <Button
            variant={currentView === 'trash' ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3 rounded-lg"
            onClick={() => onFolderClick('trash')}
          >
            <Trash2 className="h-5 w-5" />
            <span>Corbeille</span>
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Smart Folders */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Dossiers intelligents
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onCreateSmartFolder}
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
          {smartFolders.map((folder) => (
            <div
              key={folder.id}
              className="group relative"
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg text-sm pr-12"
                onClick={() => onSmartFolderClick(folder)}
              >
                <Folder className="h-4 w-4" />
                <span className="truncate">{folder.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSmartFolder(folder.id);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
