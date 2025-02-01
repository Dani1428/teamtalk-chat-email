import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  Mail,
  Plus,
  ChevronDown,
  RefreshCw,
  Keyboard,
  Settings2,
  Tag,
  Archive,
  Trash2,
  MoreVertical,
  Download,
  Forward,
  Printer,
  Star,
  Clock,
  Users,
  Menu,
  HelpCircle,
  FolderPlus,
  Send,
  File,
  FileText,
  Inbox,
  AlertCircle,
  Briefcase,
  User,
  Pencil,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Email } from '@/types';
import { ComposeEmail } from './ComposeEmail';

// Messages pour les dossiers vides
const emptyStateMessages = {
  inbox: {
    title: 'Boîte de réception vide',
    description: 'Vous n\'avez aucun message dans votre boîte de réception.',
    icon: Inbox,
  },
  sent: {
    title: 'Aucun message envoyé',
    description: 'Vous n\'avez envoyé aucun message.',
    icon: Send,
  },
  drafts: {
    title: 'Aucun brouillon',
    description: 'Vous n\'avez aucun brouillon enregistré.',
    icon: FileText,
  },
  trash: {
    title: 'Corbeille vide',
    description: 'La corbeille est vide.',
    icon: Trash2,
  },
  archive: {
    title: 'Archives vides',
    description: 'Vous n\'avez aucun message archivé.',
    icon: Archive,
  },
  spam: {
    title: 'Aucun spam',
    description: 'Aucun message indésirable détecté.',
    icon: AlertCircle,
  },
};

function EmptyState({ folder }: { folder: string }) {
  const message = emptyStateMessages[folder as keyof typeof emptyStateMessages] || {
    title: 'Aucun message',
    description: 'Aucun message trouvé dans ce dossier.',
    icon: Mail,
  };
  const Icon = message.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <Icon className="h-12 w-12 mb-4" />
      <h3 className="text-lg font-medium mb-2">{message.title}</h3>
      <p className="text-sm">{message.description}</p>
    </div>
  );
}

export function EmailArea() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Array<{ field: string; value: string }>>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isComposeMinimized, setIsComposeMinimized] = useState(false);
  const [isComposeMaximized, setIsComposeMaximized] = useState(false);

  const [templates, setTemplates] = useState([
    { id: '1', name: 'Réponse standard', subject: 'Re: Votre demande', content: 'Bonjour,\n\nMerci de votre message...' },
    { id: '2', name: 'Confirmation de rendez-vous', subject: 'Confirmation RDV', content: 'Bonjour,\n\nJe confirme notre rendez-vous...' },
    { id: '3', name: 'Demande d\'information', subject: 'Demande d\'info', content: 'Bonjour,\n\nPourriez-vous me fournir...' },
  ]);

  const handleEmailSelect = (emailId: string, isSelected: boolean) => {
    setSelectedEmails((prev) => {
      if (isSelected) {
        return [...prev, emailId];
      } else {
        return prev.filter((id) => id !== emailId);
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allEmailIds = emails.map((email) => email.id);
      setSelectedEmails(allEmailIds);
    } else {
      setSelectedEmails([]);
    }
  };

  const getFilteredEmails = () => {
    let filtered = emails;

    // Filtrer par dossier
    filtered = filtered.filter((email) => email.folder === currentFolder);

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter((email) =>
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Appliquer les filtres avancés
    filters.forEach((filter) => {
      if (filter.field && filter.value) {
        filtered = filtered.filter((email) => {
          const fieldValue = email[filter.field as keyof Email];
          return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(filter.value.toLowerCase());
        });
      }
    });

    return filtered;
  };

  const toggleLabel = (emailIds: string[], label: string) => {
    setEmails((prev) =>
      prev.map((email) => {
        if (emailIds.includes(email.id)) {
          const labels = email.labels || [];
          const hasLabel = labels.includes(label);
          return {
            ...email,
            labels: hasLabel ? labels.filter((l) => l !== label) : [...labels, label],
          };
        }
        return email;
      })
    );
    setSelectedEmails([]);
  };

  const toggleArchive = (emailIds: string[]) => {
    setEmails((prev) =>
      prev.map((email) => {
        if (emailIds.includes(email.id)) {
          return {
            ...email,
            folder: email.folder === 'archive' ? 'inbox' : 'archive',
          };
        }
        return email;
      })
    );
    setSelectedEmails([]);
  };

  const handleDeleteEmails = (emailIds: string[]) => {
    setEmails((prev) =>
      prev.map((email) => {
        if (emailIds.includes(email.id)) {
          return {
            ...email,
            folder: 'trash',
          };
        }
        return email;
      })
    );
    setSelectedEmails([]);
    setShowDeleteConfirm(false);
  };

  const handleAction = async (action: string, emailIds: string[]) => {
    try {
      setActionLoading((prev) => ({ ...prev, [action]: true }));
      setError(null);

      switch (action) {
        case 'archive':
          await toggleArchive(emailIds);
          break;
        case 'delete':
          await handleDeleteEmails(emailIds);
          break;
        case 'label':
          // Handle label action
          break;
        default:
          throw new Error('Action non supportée');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setActionLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="flex flex-wrap gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Button
              onClick={() => setShowCompose(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau message
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedEmails.length === 0 || actionLoading['label']}
                  className="w-full sm:w-auto"
                >
                  {actionLoading['label'] ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Tag className="h-4 w-4 mr-2" />
                  )}
                  Labels
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => toggleLabel(selectedEmails, 'important')}>
                  <Star className="h-4 w-4 mr-2" />
                  Important
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLabel(selectedEmails, 'work')}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Travail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLabel(selectedEmails, 'personal')}>
                  <User className="h-4 w-4 mr-2" />
                  Personnel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={selectedEmails.length === 0 || actionLoading['archive']}
              onClick={() => handleAction('archive', selectedEmails)}
            >
              {actionLoading['archive'] ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Archive className="h-4 w-4 mr-2" />
              )}
              Archiver
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              disabled={selectedEmails.length === 0 || actionLoading['delete']}
              onClick={() => setShowDeleteConfirm(true)}
            >
              {actionLoading['delete'] ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Supprimer
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : getFilteredEmails().length === 0 ? (
          <EmptyState folder={currentFolder} />
        ) : (
          <div className="space-y-2">
            <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md sticky top-0">
              <Checkbox
                checked={selectedEmails.length > 0 && selectedEmails.length === getFilteredEmails().length}
                onCheckedChange={handleSelectAll}
                aria-label="Sélectionner tous les emails"
              />
              <span className="ml-2 text-sm text-gray-500">
                {selectedEmails.length} sélectionné(s)
              </span>
            </div>

            <div className="grid gap-2">
              {getFilteredEmails().map((email) => (
                <div
                  key={email.id}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    'hover:bg-gray-50 dark:hover:bg-gray-800',
                    'cursor-pointer select-none',
                    email.isRead ? 'bg-white' : 'bg-blue-50 dark:bg-blue-900/10'
                  )}
                >
                  {/* EmailItem */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer les {selectedEmails.length} email(s) sélectionné(s) ?
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction('delete', selectedEmails)}
                disabled={actionLoading['delete']}
              >
                {actionLoading['delete'] ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showCompose && (
        <ComposeEmail
          onClose={() => setShowCompose(false)}
          onMinimize={() => setIsComposeMinimized(true)}
          onMaximize={() => setIsComposeMaximized(true)}
          isMinimized={isComposeMinimized}
          isMaximized={isComposeMaximized}
        />
      )}
    </div>
  );
}