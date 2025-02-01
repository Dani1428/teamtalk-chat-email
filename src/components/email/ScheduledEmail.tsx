import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface ScheduledEmailProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduledTime: Date) => void;
  defaultDate?: Date;
}

export function ScheduledEmail({
  isOpen,
  onClose,
  onSchedule,
  defaultDate,
}: ScheduledEmailProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    defaultDate || new Date()
  );
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [timezone, setTimezone] = useState('Europe/Paris');

  const handleSchedule = () => {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledDate = new Date(selectedDate);
      scheduledDate.setHours(hours, minutes);
      onSchedule(scheduledDate);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Programmer l'envoi</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <Label>Date d'envoi</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Heure d'envoi</Label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Fuseau horaire</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fuseau horaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Europe/Paris">Paris (CET/CEST)</SelectItem>
                <SelectItem value="Europe/London">Londres (GMT/BST)</SelectItem>
                <SelectItem value="America/New_York">New York (ET)</SelectItem>
                <SelectItem value="America/Los_Angeles">Los Angeles (PT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDate && (
            <div className="text-sm text-gray-500">
              L'email sera envoyé le{' '}
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} à{' '}
              {selectedTime}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSchedule}>Programmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
