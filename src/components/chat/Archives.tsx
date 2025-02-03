import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { API_ROUTES } from '@/config/api';
import { Loader2, Search, RotateCcw } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';

interface ArchivedMessage {
  id: number;
  content: string;
  archived_at: string;
  original_sent_at: string;
  archive_reason: string;
  archived_by_username: string;
  original_user_username: string;
}

interface ArchivesProps {
  channelId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Archives({ channelId, isOpen, onClose }: ArchivesProps) {
  const [messages, setMessages] = useState<ArchivedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_ROUTES.archives.list(channelId)}?page=${page}&search=${searchTerm}`
      );
      if (!response.ok) throw new Error('Erreur lors du chargement des archives');
      const data = await response.json();
      setMessages(data.messages);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les archives',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchArchives();
    }
  }, [isOpen, page, searchTerm]);

  const handleRestore = async (archiveId: number) => {
    try {
      const response = await fetch(API_ROUTES.archives.restore(archiveId), {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Erreur lors de la restauration');
      
      toast({
        title: 'Succès',
        description: 'Message restauré avec succès',
      });
      
      fetchArchives();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de restaurer le message',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Archives du canal</DialogTitle>
          <DialogDescription>
            Consultez et gérez les messages archivés
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 my-4">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher dans les archives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Message</TableHead>
                <TableHead>Auteur original</TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Archivé par</TableHead>
                <TableHead>Date d'archivage</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Aucun message archivé trouvé
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="max-w-md truncate">
                      {message.content}
                    </TableCell>
                    <TableCell>{message.original_user_username}</TableCell>
                    <TableCell>
                      {format(new Date(message.original_sent_at), 'Pp', {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>{message.archived_by_username}</TableCell>
                    <TableCell>
                      {format(new Date(message.archived_at), 'Pp', {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>{message.archive_reason}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(message.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restaurer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
