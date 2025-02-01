import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
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
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

interface EmailSchedulerProps {
  onSchedule: (date: Date) => void;
  minDate?: Date;
}

export function EmailScheduler({ onSchedule, minDate = new Date() }: EmailSchedulerProps) {
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState('09:00');

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const handleSchedule = () => {
    if (date) {
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes);
      onSchedule(scheduledDate);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Date d'envoi</label>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={date ? 'w-[240px] justify-start text-left font-normal' : 'w-[240px] justify-start text-left text-muted-foreground font-normal'}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={fr}
                fromDate={minDate}
              />
            </PopoverContent>
          </Popover>

          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className="w-[180px]">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Choisir l'heure" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            setDate(undefined);
            setTime('09:00');
          }}
        >
          Réinitialiser
        </Button>
        <Button
          className="flex-1"
          onClick={handleSchedule}
          disabled={!date}
        >
          Planifier
        </Button>
      </div>

      {date && (
        <p className="text-sm text-muted-foreground">
          L'email sera envoyé le {format(date, 'PPP', { locale: fr })} à {time}
        </p>
      )}
    </div>
  );
}
