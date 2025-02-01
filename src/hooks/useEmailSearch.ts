import { useState, useCallback } from 'react';
import { Email } from '@/types';

interface SearchCriteria {
  query: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  folder?: string;
  label?: string;
  startDate?: Date;
  endDate?: Date;
  isRead?: boolean;
  isStarred?: boolean;
}

export function useEmailSearch(emails: Email[]) {
  const [searchResults, setSearchResults] = useState<Email[]>(emails);
  const [currentCriteria, setCurrentCriteria] = useState<SearchCriteria>({ query: '' });

  const searchEmails = useCallback((criteria: SearchCriteria) => {
    setCurrentCriteria(criteria);

    let results = [...emails];

    // Recherche textuelle générale
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      results = results.filter((email) =>
        email.subject.toLowerCase().includes(query) ||
        email.content.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query) ||
        email.to.toLowerCase().includes(query)
      );
    }

    // Filtrer par expéditeur
    if (criteria.from) {
      const from = criteria.from.toLowerCase();
      results = results.filter((email) =>
        email.from.toLowerCase().includes(from)
      );
    }

    // Filtrer par destinataire
    if (criteria.to) {
      const to = criteria.to.toLowerCase();
      results = results.filter((email) =>
        email.to.toLowerCase().includes(to)
      );
    }

    // Filtrer par objet
    if (criteria.subject) {
      const subject = criteria.subject.toLowerCase();
      results = results.filter((email) =>
        email.subject.toLowerCase().includes(subject)
      );
    }

    // Filtrer par pièces jointes
    if (criteria.hasAttachment) {
      results = results.filter((email) =>
        email.attachments && email.attachments.length > 0
      );
    }

    // Filtrer par dossier
    if (criteria.folder) {
      results = results.filter((email) =>
        email.folder === criteria.folder
      );
    }

    // Filtrer par label
    if (criteria.label) {
      results = results.filter((email) =>
        email.labels?.includes(criteria.label)
      );
    }

    // Filtrer par date
    if (criteria.startDate) {
      results = results.filter((email) =>
        new Date(email.date) >= criteria.startDate!
      );
    }
    if (criteria.endDate) {
      results = results.filter((email) =>
        new Date(email.date) <= criteria.endDate!
      );
    }

    // Filtrer par état de lecture
    if (criteria.isRead !== undefined) {
      results = results.filter((email) =>
        email.isRead === criteria.isRead
      );
    }

    // Filtrer par favoris
    if (criteria.isStarred !== undefined) {
      results = results.filter((email) =>
        email.isStarred === criteria.isStarred
      );
    }

    setSearchResults(results);
  }, [emails]);

  return {
    searchResults,
    currentCriteria,
    searchEmails,
  };
}
