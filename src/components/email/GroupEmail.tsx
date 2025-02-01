import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X, Users, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  name: string;
  members: string[];
}

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface GroupEmailProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipients: string[], groupName?: string) => void;
}

// Données de démonstration
const DEMO_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Équipe Marketing',
    members: ['alice@example.com', 'bob@example.com', 'charlie@example.com'],
  },
  {
    id: '2',
    name: 'Équipe Développement',
    members: ['david@example.com', 'eve@example.com', 'frank@example.com'],
  },
];

const DEMO_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Martin', email: 'alice@example.com' },
  { id: '2', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
  { id: '4', name: 'David Smith', email: 'david@example.com' },
  { id: '5', name: 'Eve Wilson', email: 'eve@example.com' },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com' },
];

export function GroupEmail({ isOpen, onClose, onSend }: GroupEmailProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [openCombobox, setOpenCombobox] = useState(false);

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    const groupContacts = DEMO_CONTACTS.filter((contact) =>
      group.members.includes(contact.email)
    );
    setSelectedContacts(groupContacts);
  };

  const handleSelectContact = (contact: Contact) => {
    if (!selectedContacts.find((c) => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId));
  };

  const handleSend = () => {
    const recipients = selectedContacts.map((contact) => contact.email);
    onSend(recipients, selectedGroup?.name || newGroupName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Email de groupe</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Sélection de groupe existant */}
          <div className="space-y-2">
            <Label>Groupe</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {selectedGroup ? selectedGroup.name : "Sélectionner un groupe"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Rechercher un groupe..." />
                  <CommandEmpty>Aucun groupe trouvé.</CommandEmpty>
                  <CommandGroup>
                    {DEMO_GROUPS.map((group) => (
                      <CommandItem
                        key={group.id}
                        onSelect={() => {
                          handleSelectGroup(group);
                          setOpenCombobox(false);
                        }}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {group.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedGroup?.id === group.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Nouveau groupe */}
          {!selectedGroup && (
            <div className="space-y-2">
              <Label>Ou créer un nouveau groupe</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du nouveau groupe"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Sélection des contacts */}
          <div className="space-y-2">
            <Label>Ajouter des membres</Label>
            <Command className="border rounded-md">
              <CommandInput placeholder="Rechercher des contacts..." />
              <CommandEmpty>Aucun contact trouvé.</CommandEmpty>
              <ScrollArea className="h-40">
                <CommandGroup>
                  {DEMO_CONTACTS.filter(
                    (contact) => !selectedContacts.find((c) => c.id === contact.id)
                  ).map((contact) => (
                    <CommandItem
                      key={contact.id}
                      onSelect={() => handleSelectContact(contact)}
                    >
                      {contact.name}
                      <span className="ml-2 text-gray-500">{contact.email}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </Command>
          </div>

          {/* Liste des contacts sélectionnés */}
          <div className="space-y-2">
            <Label>Membres sélectionnés</Label>
            <div className="flex flex-wrap gap-2">
              {selectedContacts.map((contact) => (
                <Badge
                  key={contact.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {contact.name}
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSend}
            disabled={selectedContacts.length === 0}
          >
            Continuer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
