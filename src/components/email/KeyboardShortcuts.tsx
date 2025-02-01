import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['j'], description: 'Email suivant' },
      { keys: ['k'], description: 'Email précédent' },
      { keys: ['o', 'Enter'], description: 'Ouvrir l\'email' },
      { keys: ['u'], description: 'Retour à la liste' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: ['c'], description: 'Composer un nouvel email' },
      { keys: ['r'], description: 'Répondre' },
      { keys: ['a'], description: 'Répondre à tous' },
      { keys: ['f'], description: 'Transférer' },
      { keys: ['#'], description: 'Supprimer' },
      { keys: ['e'], description: 'Archiver' },
      { keys: ['m'], description: 'Marquer comme lu/non lu' },
    ],
  },
  {
    title: 'Sélection',
    shortcuts: [
      { keys: ['x'], description: 'Sélectionner l\'email' },
      { keys: ['*', 'a'], description: 'Tout sélectionner' },
      { keys: ['*', 'n'], description: 'Désélectionner tout' },
    ],
  },
  {
    title: 'Étiquettes',
    shortcuts: [
      { keys: ['l'], description: 'Ajouter un label' },
      { keys: ['s'], description: 'Marquer comme favori' },
      { keys: ['!'], description: 'Marquer comme spam' },
    ],
  },
  {
    title: 'Composition',
    shortcuts: [
      { keys: ['⌘', 'Enter'], description: 'Envoyer l\'email' },
      { keys: ['⌘', 's'], description: 'Sauvegarder le brouillon' },
      { keys: ['Esc'], description: 'Quitter la composition' },
      { keys: ['⌘', 'b'], description: 'Gras' },
      { keys: ['⌘', 'i'], description: 'Italique' },
    ],
  },
];

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  // Gestionnaire de raccourcis clavier global
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Implémentez ici la logique des raccourcis clavier
      if (e.key === '?' && !isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Raccourcis clavier</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid gap-6 p-6">
            {SHORTCUT_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="font-semibold mb-3">{group.title}</h3>
                <div className="grid gap-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600 dark:text-gray-300">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 mx-1">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
