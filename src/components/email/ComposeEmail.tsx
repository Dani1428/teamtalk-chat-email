import React, { useState, useEffect } from 'react';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Paperclip,
  Clock,
  Send,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Users,
  File,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TipTapLink from '@tiptap/extension-link';
import TipTapImage from '@tiptap/extension-image';
import { ScheduledEmail } from './ScheduledEmail';
import { GroupEmail } from './GroupEmail';

interface ComposeEmailProps {
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMinimized: boolean;
  isMaximized: boolean;
  template?: {
    id: string;
    name: string;
    subject: string;
    content: string;
  };
}

export function ComposeEmail({
  onClose,
  onMinimize,
  onMaximize,
  isMinimized,
  isMaximized,
  template,
}: ComposeEmailProps) {
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [subject, setSubject] = useState(template?.subject || '');
  const [message, setMessage] = useState(template?.content || '');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showGroupEmail, setShowGroupEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setSubject(template.subject);
      setMessage(template.content);
    }
  }, [template]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapLink.configure({
        openOnClick: false,
      }),
      TipTapImage,
    ],
    content: '',
  });

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    setIsSubmitting(true);
    // TODO: Implémenter l'envoi d'email
    console.log({
      to,
      cc,
      subject,
      content: editor?.getHTML(),
      scheduledDate,
      attachments,
    });
    onClose();
    setIsSubmitting(false);
  };

  const handleSchedule = (date: Date) => {
    setScheduledDate(date);
    setShowScheduler(false);
  };

  const handleGroupSelect = (recipients: string[], groupName?: string) => {
    setTo(recipients.join(', '));
    setShowGroupEmail(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend();
  };

  const handleAttachment = () => {
    document.getElementById('attachments')?.click();
  };

  if (isMinimized) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="w-80 translate-y-[calc(100vh-6rem)] translate-x-[calc(100vw-24rem)] duration-300 bg-background border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Nouveau message</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fenêtre de composition d'email minimisée. Cliquez pour agrandir.
            </DialogDescription>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onMinimize} aria-label="Maximiser">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "sm:max-w-[90vw] h-[90vh] flex flex-col bg-background border shadow-lg",
          "dark:shadow-accent/10",
          isMaximized && "sm:max-w-[95vw] sm:h-[95vh]"
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Nouveau message</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Composez votre email. Tous les champs marqués d'un * sont obligatoires.
          </DialogDescription>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMinimize} 
                className="hover:bg-accent/50"
                aria-label="Minimiser"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onMaximize} 
                className="hover:bg-accent/50"
                aria-label={isMaximized ? "Restaurer" : "Maximiser"}
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="hover:bg-accent/50"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="space-y-4 flex-shrink-0">
            <div className="grid gap-2">
              <Label htmlFor="to" className="text-foreground font-medium">À *</Label>
              <Input
                id="to"
                placeholder="adresse@email.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                aria-required="true"
                className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cc" className="text-foreground font-medium">Cc</Label>
              <Input
                id="cc"
                placeholder="adresse@email.com"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject" className="text-foreground font-medium">Objet *</Label>
              <Input
                id="subject"
                placeholder="Objet de l'email"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                aria-required="true"
                className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium">Message *</Label>
            <div className="border rounded-md h-full flex flex-col bg-background shadow-sm dark:shadow-accent/10">
              {/* Barre d'outils */}
              <div className="sticky top-0 z-10 bg-background border-b">
                <div className="p-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
                  <div className="flex gap-1" role="toolbar" aria-label="Options de formatage">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-accent/50"
                      aria-label="Gras"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-accent/50"
                      aria-label="Italique"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-accent/50"
                      aria-label="Liste à puces"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-accent/50"
                      aria-label="Liste numérotée"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-accent/50"
                      aria-label="Insérer un lien"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-accent/50"
                      aria-label="Insérer une image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Zone de texte */}
              <div className="relative flex-1 min-h-0">
                <Textarea
                  id="message"
                  className="absolute inset-0 resize-none border-0 focus-visible:ring-0 p-4 bg-background text-foreground placeholder:text-muted-foreground"
                  placeholder="Rédigez votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  aria-label="Corps du message"
                  aria-required="true"
                  style={{
                    minHeight: '200px',
                    fontSize: '16px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Zone des pièces jointes */}
          <div className="flex-shrink-0 border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="attachments" className="text-foreground font-medium">Pièces jointes</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAttachment} 
                  className="whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-accent/50 interactive-element"
                  aria-label="Ajouter une pièce jointe"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Ajouter</span>
                  <span className="sm:hidden">+</span>
                </Button>
                <input
                  type="file"
                  id="attachments"
                  onChange={handleAttachmentChange}
                  className="hidden"
                  multiple
                  aria-label="Sélectionner des fichiers à joindre"
                />
              </div>
            </div>
            {attachments.length > 0 && (
              <div className="overflow-x-auto">
                <div className="flex gap-2 pb-2" role="list" aria-label="Pièces jointes">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-accent/50 rounded-md p-2 shrink-0 shadow-sm dark:shadow-accent/10"
                      role="listitem"
                    >
                      <File className="h-4 w-4" aria-hidden="true" />
                      <span className="text-sm truncate max-w-[120px] sm:max-w-[200px] text-foreground">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        onClick={() => removeAttachment(index)}
                        aria-label={`Supprimer ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex-shrink-0 flex items-center gap-2 pt-4 border-t sticky bottom-0 bg-background p-4">
            <Button 
              type="submit" 
              className={cn(
                "flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              )}
              disabled={isSubmitting}
              aria-label="Envoyer l'email"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Envoyer</span>
              <span className="sm:hidden">Envoyer</span>
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground hover:bg-accent/50 interactive-element"
              aria-label="Annuler la composition"
            >
              Annuler
            </Button>
          </div>
        </form>

        {/* Composants de dialogue */}
        {showScheduler && (
          <Dialog open={showScheduler} onOpenChange={() => setShowScheduler(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Planifier l'envoi</DialogTitle>
                <DialogDescription>
                  Choisissez la date et l'heure d'envoi de votre email.
                </DialogDescription>
              </DialogHeader>
              <ScheduledEmail
                isOpen={showScheduler}
                onClose={() => setShowScheduler(false)}
                onSchedule={handleSchedule}
                defaultDate={scheduledDate}
              />
            </DialogContent>
          </Dialog>
        )}

        {showGroupEmail && (
          <Dialog open={showGroupEmail} onOpenChange={() => setShowGroupEmail(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sélectionner un groupe</DialogTitle>
                <DialogDescription>
                  Choisissez un groupe de destinataires pour votre email.
                </DialogDescription>
              </DialogHeader>
              <GroupEmail
                isOpen={showGroupEmail}
                onClose={() => setShowGroupEmail(false)}
                onSend={handleGroupSelect}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
