import { useState, useEffect, useCallback } from 'react';
import { Email } from '@/types';

interface FolderCounts {
  inbox: number;
  sent: number;
  drafts: number;
  spam: number;
  trash: number;
  starred: number;
  archived: number;
}

const defaultFolderCounts: FolderCounts = {
  inbox: 0,
  sent: 0,
  drafts: 0,
  spam: 0,
  trash: 0,
  starred: 0,
  archived: 0,
};

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [folderCounts, setFolderCounts] = useState<FolderCounts>(defaultFolderCounts);

  // Charger les emails
  const loadEmails = useCallback(async () => {
    try {
      setLoading(true);
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockEmails = [
        {
          id: '1',
          subject: 'Test email 1',
          from: 'user1@example.com',
          to: 'me@example.com',
          content: 'This is a test email',
          date: new Date().toISOString(),
          isRead: false,
          folder: 'inbox',
          labels: ['work'],
          attachments: [],
          isStarred: false,
          isArchived: false,
        },
        {
          id: '2',
          subject: 'Test email 2',
          from: 'user2@example.com',
          to: 'me@example.com',
          content: 'This is another test email',
          date: new Date().toISOString(),
          isRead: true,
          folder: 'inbox',
          labels: ['personal'],
          attachments: [],
          isStarred: true,
          isArchived: false,
        },
      ];
      
      setEmails(mockEmails);
      updateFolderCounts(mockEmails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour les compteurs de dossiers
  const updateFolderCounts = useCallback((emailList: Email[]) => {
    const counts = { ...defaultFolderCounts };

    emailList.forEach((email) => {
      if (email.folder) {
        counts[email.folder as keyof FolderCounts]++;
      }
      if (email.isStarred) {
        counts.starred++;
      }
      if (email.isArchived) {
        counts.archived++;
      }
    });

    setFolderCounts(counts);
  }, []);

  // Déplacer un email vers un dossier
  const moveToFolder = useCallback(async (emailId: string, folder: string) => {
    try {
      setEmails((prevEmails) => {
        const newEmails = prevEmails.map((email) =>
          email.id === emailId ? { ...email, folder } : email
        );
        updateFolderCounts(newEmails);
        return newEmails;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  }, [updateFolderCounts]);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  return {
    emails,
    loading,
    error,
    currentFolder,
    setCurrentFolder,
    folderCounts,
    moveToFolder,
    loadEmails,
  };
}
