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
    to?: string;
    cc?: string;
    subject?: string;
    content?: string;
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
  const [emailData, setEmailData] = useState({
    to: template?.to || '',
    cc: template?.cc || '',
    subject: template?.subject || '',
    content: template?.content || '',
    attachments: [] as File[],
  });
  const [showScheduler, setShowScheduler] = useState(false);
  const [showGroupEmail, setShowGroupEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEmailData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapLink.configure({
        openOnClick: false,
      }),
      TipTapImage,
    ],
    content: emailData.content,
  });

  const handleSend = () => {
    setIsSending(true);
    // TODO: Implémenter l'envoi d'email
    console.log({
      to: emailData.to,
      cc: emailData.cc,
      subject: emailData.subject,
      content: editor?.getHTML(),
      attachments: emailData.attachments,
    });
    onClose();
    setIsSending(false);
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

        <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="space-y-4 flex-shrink-0">
            {/* En-tête avec boutons */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <Label htmlFor="to" className="text-foreground font-medium">À *</Label>
                <Input
                  id="to"
                  placeholder="adresse@email.com"
                  value={emailData.to}
                  onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                  required
                  aria-required="true"
                  className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1"
                />
              </div>
              <div className="ml-4 flex items-start gap-2 pt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  aria-label="Ajouter une pièce jointe"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Pièce jointe</span>
                </Button>
                <Input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cc">Cc</Label>
              <Input
                id="cc"
                placeholder="adresse@email.com"
                value={emailData.cc}
                onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
                className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Objet *</Label>
              <Input
                id="subject"
                placeholder="Objet de l'email"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                required
                aria-required="true"
                className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1"
              />
            </div>

            {/* Liste des pièces jointes */}
            {emailData.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emailData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-accent/50 rounded-md px-3 py-1 text-sm"
                    role="listitem"
                  >
                    <File className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      className="h-6 w-6 p-0 hover:bg-background/80"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Barre d'outils de l'éditeur */}
            <div className="flex items-center gap-1 border-b pb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={cn("p-2", editor?.isActive('bold') && "bg-accent")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={cn("p-2", editor?.isActive('italic') && "bg-accent")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={cn("p-2", editor?.isActive('bulletList') && "bg-accent")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={cn("p-2", editor?.isActive('orderedList') && "bg-accent")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>

            {/* Zone de texte */}
            <div className="flex-1 min-h-[300px] relative">
              <EditorContent 
                editor={editor} 
                className="prose prose-sm max-w-none h-full min-h-[300px] border rounded-md p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              />
            </div>
          </div>

          {/* Barre d'actions */}
          <div className="flex-shrink-0 flex items-center justify-between gap-2 pt-4 border-t sticky bottom-0 bg-background p-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowScheduler(true)}
              >
                <Clock className="h-4 w-4 mr-2" />
                Programmer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowGroupEmail(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Groupe
              </Button>
            </div>
            <Button 
              type="button"
              onClick={handleSend}
              disabled={isSending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Envoyer
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
                onSchedule={() => {}}
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
                onSend={() => {}}
              />
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
