import React from 'react';
import {
  Inbox,
  Send,
  File,
  Trash2,
  AlertCircle,
  Star,
  Archive,
  Plus,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useEmails } from '@/hooks/useEmails';

interface FolderItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
  color?: string;
}

export function EmailFolders() {
  const { currentFolder, setCurrentFolder, folderCounts } = useEmails();

  const defaultFolders: FolderItem[] = [
    {
      id: 'inbox',
      name: 'Boîte de réception',
      icon: <Inbox className="h-4 w-4" />,
      count: folderCounts.inbox,
    },
    {
      id: 'sent',
      name: 'Envoyés',
      icon: <Send className="h-4 w-4" />,
      count: folderCounts.sent,
    },
    {
      id: 'drafts',
      name: 'Brouillons',
      icon: <File className="h-4 w-4" />,
      count: folderCounts.drafts,
    },
    {
      id: 'spam',
      name: 'Spam',
      icon: <AlertCircle className="h-4 w-4" />,
      count: folderCounts.spam,
    },
    {
      id: 'trash',
      name: 'Corbeille',
      icon: <Trash2 className="h-4 w-4" />,
      count: folderCounts.trash,
    },
  ];

  const smartFolders: FolderItem[] = [
    {
      id: 'starred',
      name: 'Favoris',
      icon: <Star className="h-4 w-4" />,
      color: 'text-yellow-500',
      count: folderCounts.starred,
    },
    {
      id: 'archived',
      name: 'Archivés',
      icon: <Archive className="h-4 w-4" />,
      count: folderCounts.archived,
    },
  ];

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  const FolderButton = ({ folder }: { folder: FolderItem }) => (
    <Button
      variant={currentFolder === folder.id ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start gap-2 mb-1',
        folder.color && currentFolder !== folder.id && folder.color
      )}
      onClick={() => handleFolderClick(folder.id)}
    >
      {folder.icon}
      <span className="flex-1 text-left">{folder.name}</span>
      {folder.count !== undefined && folder.count > 0 && (
        <Badge variant="secondary">{folder.count}</Badge>
      )}
    </Button>
  );

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-4 p-2">
        {/* Dossiers par défaut */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-medium text-gray-500">Dossiers</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Créer un nouveau dossier
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Gérer les dossiers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1">
            {defaultFolders.map((folder) => (
              <FolderButton key={folder.id} folder={folder} />
            ))}
          </div>
        </div>

        {/* Dossiers intelligents */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-sm font-medium text-gray-500">
              Dossiers intelligents
            </h3>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {smartFolders.map((folder) => (
              <FolderButton key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
