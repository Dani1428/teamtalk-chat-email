import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Email } from '@/types';

interface SearchResult {
  id: string;
  type: 'folder' | 'label' | 'email';
  title: string;
  subtitle?: string;
  date?: Date;
}

interface SidebarSearchProps {
  emails: Email[];
  folders: string[];
  labels: string[];
  onSelectEmail: (emailId: string) => void;
  onSelectFolder: (folder: string) => void;
  onSelectLabel: (label: string) => void;
}

export function SidebarSearch({
  emails,
  folders,
  labels,
  onSelectEmail,
  onSelectFolder,
  onSelectLabel,
}: SidebarSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    // Annuler la recherche précédente
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Débouncer la recherche pour éviter trop d'appels
    searchTimeoutRef.current = setTimeout(() => {
      const searchResults: SearchResult[] = [];
      const lowerQuery = query.toLowerCase();

      // Rechercher dans les dossiers
      folders
        .filter(folder => folder.toLowerCase().includes(lowerQuery))
        .forEach(folder => {
          searchResults.push({
            id: `folder-${folder}`,
            type: 'folder',
            title: folder,
          });
        });

      // Rechercher dans les labels
      labels
        .filter(label => label.toLowerCase().includes(lowerQuery))
        .forEach(label => {
          searchResults.push({
            id: `label-${label}`,
            type: 'label',
            title: label,
          });
        });

      // Rechercher dans les emails
      emails
        .filter(email =>
          email.subject.toLowerCase().includes(lowerQuery) ||
          email.from.toLowerCase().includes(lowerQuery) ||
          email.content.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5) // Limiter à 5 résultats pour les emails
        .forEach(email => {
          searchResults.push({
            id: email.id,
            type: 'email',
            title: email.subject,
            subtitle: email.from,
            date: new Date(email.date),
          });
        });

      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    setIsSearching(true);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, emails, folders, labels]);

  const handleSelect = (result: SearchResult) => {
    switch (result.type) {
      case 'folder':
        onSelectFolder(result.title);
        break;
      case 'label':
        onSelectLabel(result.title);
        break;
      case 'email':
        onSelectEmail(result.id);
        break;
    }
    setQuery('');
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          className="pl-10 pr-10"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Résultats de recherche */}
      {query && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-md shadow-lg border dark:border-gray-800">
          <ScrollArea className="max-h-[300px]">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                Recherche en cours...
              </div>
            ) : results.length > 0 ? (
              <div className="py-1">
                {results.map((result) => (
                  <button
                    key={result.id}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3"
                    onClick={() => handleSelect(result)}
                  >
                    {/* Icône en fonction du type */}
                    {result.type === 'folder' && (
                      <div className="w-4 h-4">📁</div>
                    )}
                    {result.type === 'label' && (
                      <div className="w-4 h-4">🏷️</div>
                    )}
                    {result.type === 'email' && (
                      <div className="w-4 h-4">📧</div>
                    )}

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{result.title}</div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-500 truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Date pour les emails */}
                    {result.date && (
                      <div className="text-sm text-gray-500">
                        {result.date.toLocaleDateString()}
                      </div>
                    )}

                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Aucun résultat trouvé
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
