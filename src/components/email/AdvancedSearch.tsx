import React, { useState } from 'react';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface AdvancedSearchProps {
  onSearch: (criteria: SearchCriteria) => void;
  folders: string[];
  labels: string[];
}

export function AdvancedSearch({ onSearch, folders, labels }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [criteria, setCriteria] = useState<SearchCriteria>({
    query: '',
    hasAttachment: false,
    isRead: undefined,
    isStarred: undefined,
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch(criteria);
    updateActiveFilters();
  };

  const updateActiveFilters = () => {
    const filters: string[] = [];
    if (criteria.from) filters.push(`De: ${criteria.from}`);
    if (criteria.to) filters.push(`À: ${criteria.to}`);
    if (criteria.subject) filters.push(`Objet: ${criteria.subject}`);
    if (criteria.hasAttachment) filters.push('Avec pièces jointes');
    if (criteria.folder) filters.push(`Dossier: ${criteria.folder}`);
    if (criteria.label) filters.push(`Label: ${criteria.label}`);
    if (criteria.startDate) filters.push(`Après: ${format(criteria.startDate, 'P', { locale: fr })}`);
    if (criteria.endDate) filters.push(`Avant: ${format(criteria.endDate, 'P', { locale: fr })}`);
    if (criteria.isRead !== undefined) filters.push(criteria.isRead ? 'Lu' : 'Non lu');
    if (criteria.isStarred !== undefined) filters.push(criteria.isStarred ? 'Favoris' : 'Non favoris');
    setActiveFilters(filters);
  };

  const removeFilter = (filter: string) => {
    const key = filter.split(':')[0].toLowerCase();
    setCriteria((prev) => {
      const newCriteria = { ...prev };
      switch (key) {
        case 'de':
          delete newCriteria.from;
          break;
        case 'à':
          delete newCriteria.to;
          break;
        case 'objet':
          delete newCriteria.subject;
          break;
        case 'dossier':
          delete newCriteria.folder;
          break;
        case 'label':
          delete newCriteria.label;
          break;
        case 'après':
          delete newCriteria.startDate;
          break;
        case 'avant':
          delete newCriteria.endDate;
          break;
        case 'avec pièces jointes':
          newCriteria.hasAttachment = false;
          break;
        case 'lu':
        case 'non lu':
          delete newCriteria.isRead;
          break;
        case 'favoris':
        case 'non favoris':
          delete newCriteria.isStarred;
          break;
      }
      return newCriteria;
    });
    setActiveFilters(activeFilters.filter((f) => f !== filter));
    onSearch(criteria);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            className="pl-10"
            placeholder="Rechercher des emails..."
            value={criteria.query}
            onChange={(e) => setCriteria({ ...criteria, query: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres avancés
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>De</Label>
                  <Input
                    placeholder="email@exemple.com"
                    value={criteria.from || ''}
                    onChange={(e) => setCriteria({ ...criteria, from: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>À</Label>
                  <Input
                    placeholder="email@exemple.com"
                    value={criteria.to || ''}
                    onChange={(e) => setCriteria({ ...criteria, to: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Objet</Label>
                <Input
                  placeholder="Objet de l'email"
                  value={criteria.subject || ''}
                  onChange={(e) => setCriteria({ ...criteria, subject: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dossier</Label>
                  <Select
                    value={criteria.folder}
                    onValueChange={(value) => setCriteria({ ...criteria, folder: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder} value={folder}>
                          {folder}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Select
                    value={criteria.label}
                    onValueChange={(value) => setCriteria({ ...criteria, label: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {labels.map((label) => (
                        <SelectItem key={label} value={label}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Période</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        {criteria.startDate ? (
                          format(criteria.startDate, 'P', { locale: fr })
                        ) : (
                          'Date de début'
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={criteria.startDate}
                        onSelect={(date) =>
                          setCriteria({ ...criteria, startDate: date || undefined })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        {criteria.endDate ? (
                          format(criteria.endDate, 'P', { locale: fr })
                        ) : (
                          'Date de fin'
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={criteria.endDate}
                        onSelect={(date) =>
                          setCriteria({ ...criteria, endDate: date || undefined })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>État de lecture</Label>
                  <Select
                    value={criteria.isRead?.toString()}
                    onValueChange={(value) =>
                      setCriteria({
                        ...criteria,
                        isRead: value ? value === 'true' : undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Lu</SelectItem>
                      <SelectItem value="false">Non lu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Favoris</Label>
                  <Select
                    value={criteria.isStarred?.toString()}
                    onValueChange={(value) =>
                      setCriteria({
                        ...criteria,
                        isStarred: value ? value === 'true' : undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Favoris</SelectItem>
                      <SelectItem value="false">Non favoris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={criteria.hasAttachment}
                    onChange={(e) =>
                      setCriteria({ ...criteria, hasAttachment: e.target.checked })
                    }
                  />
                  Avec pièces jointes
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCriteria({ query: '' });
                    setActiveFilters([]);
                    onSearch({ query: '' });
                  }}
                >
                  Réinitialiser
                </Button>
                <Button onClick={handleSearch}>Appliquer</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
