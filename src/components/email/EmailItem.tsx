import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Star, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import type { Email } from '@/types';

interface EmailItemProps {
  email: Email;
  selected: boolean;
  onSelect: (isSelected: boolean) => void;
  onClick: () => void;
  view?: 'compact' | 'comfortable';
}

export function EmailItem({
  email,
  selected,
  onSelect,
  onClick,
  view = 'comfortable'
}: EmailItemProps) {
  const handleCheckboxChange = (checked: boolean) => {
    onSelect(checked);
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const emailDate = new Date(date);
    
    if (emailDate.toDateString() === now.toDateString()) {
      return format(emailDate, 'HH:mm', { locale: fr });
    } else if (emailDate.getFullYear() === now.getFullYear()) {
      return format(emailDate, 'd MMM', { locale: fr });
    }
    return format(emailDate, 'dd/MM/yyyy', { locale: fr });
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 p-2 cursor-pointer transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        selected && 'bg-blue-50 dark:bg-blue-900/20',
        !email.read && 'font-medium bg-gray-50 dark:bg-gray-800/50',
        view === 'compact' ? 'py-1' : 'py-3'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selected}
          onCheckedChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Sélectionner l'email de ${email.sender.name}`}
          className="data-[state=checked]:bg-blue-600"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Toggle star
          }}
          className={cn(
            'opacity-0 group-hover:opacity-100',
            email.starred && 'opacity-100',
            'focus:opacity-100 transition-opacity'
          )}
        >
          <Star
            className={cn(
              'h-4 w-4',
              email.starred
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
            )}
          />
        </button>
      </div>

      <Avatar className="h-8 w-8 shrink-0">
        <img src={email.sender.avatar} alt={email.sender.name} />
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn('truncate', !email.read && 'font-medium')}>
            {email.sender.name}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <p className={cn(
            'text-sm text-gray-600 dark:text-gray-300 truncate',
            view === 'compact' ? 'inline' : 'block',
            !email.read && 'font-medium text-gray-900 dark:text-gray-100'
          )}>
            {email.subject}
          </p>
          {view !== 'compact' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {email.preview}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {email.labels?.map((label: string) => (
          <Badge
            key={label}
            variant="outline"
            className="hidden sm:inline-flex"
          >
            {label}
          </Badge>
        ))}
        {email.attachments?.length > 0 && (
          <Paperclip className="h-4 w-4 text-gray-400" />
        )}
        <span className={cn(
          'text-xs text-gray-500',
          !email.read && 'font-medium text-gray-900 dark:text-gray-100'
        )}>
          {formatDate(email.date)}
        </span>
      </div>
    </div>
  );
}
