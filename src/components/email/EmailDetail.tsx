import React from 'react';
import {
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Archive,
  Star,
  Flag,
  Tag,
  Download,
  Printer,
  MoreVertical,
  ChevronLeft,
  File,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmailDetailProps {
  email: any;
  onClose: () => void;
  onReply: (type: 'reply' | 'replyAll' | 'forward') => void;
}

export function EmailDetail({ email, onClose, onReply }: EmailDetailProps) {
  if (!email) return null;

  const handleArchive = () => {
    // Handle archive action
    onClose();
  };

  const handleDelete = () => {
    // Handle delete action
    onClose();
  };

  const handleStar = () => {
    // Handle star action
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="icon" onClick={onClose} className="sm:hidden">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold truncate">{email.subject}</h2>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => onReply('reply')}>
                <Reply className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onReply('replyAll')}>
                <ReplyAll className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onReply('forward')}>
                <Forward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-yellow-400" onClick={handleStar}>
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleArchive}>
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-600" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Marquer
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Tag className="h-4 w-4 mr-2" />
                  Appliquer un label
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Email Info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3 w-full">
            <Avatar className="h-10 w-10 shrink-0">
              <img src={email.sender.avatar} alt={email.sender.name} />
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-semibold truncate">{email.sender.name}</span>
                <span className="text-sm text-gray-500 truncate">&lt;{email.sender.email}&gt;</span>
              </div>
              <div className="text-sm text-gray-500 truncate">
                À: {email.to.join(', ')}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 shrink-0">
            {new Date(email.date).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Email Content */}
      <ScrollArea className="flex-1 p-4">
        <div className="prose dark:prose-invert max-w-none">
          {email.content}
        </div>
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium mb-2">Pièces jointes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {email.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate">{attachment.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {Math.round(attachment.size / 1024)}KB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => onReply('reply')}>
            <Reply className="h-4 w-4 mr-2" />
            Répondre
          </Button>
          <Button variant="outline" onClick={() => onReply('replyAll')}>
            <ReplyAll className="h-4 w-4 mr-2" />
            Répondre à tous
          </Button>
          <Button variant="outline" onClick={() => onReply('forward')}>
            <Forward className="h-4 w-4 mr-2" />
            Transférer
          </Button>
        </div>
      </div>
    </div>
  );
}
