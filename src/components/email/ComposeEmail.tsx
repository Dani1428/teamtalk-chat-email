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
  defaultRecipient?: string;
  defaultSubject?: string;
  defaultContent?: string;
  template?: {
    id: string;
    name: string;
    subject: string;
    content: string;
  };
  onSend: (data: any) => void;
}

export function ComposeEmail({
  onClose,
  onMinimize,
  onMaximize,
  isMinimized,
  isMaximized,
  defaultRecipient,
  defaultSubject,
  defaultContent,
  template,
  onSend,
}: ComposeEmailProps) {
  const [emailData, setEmailData] = useState({
    to: defaultRecipient || '',
    cc: '',
    subject: defaultSubject || template?.subject || '',
    content: defaultContent || template?.content || '',
    attachments: [] as File[],
    scheduledDate: null as Date | null,
    selectedGroup: null as { name: string; recipients: string[] } | null,
  });

  const [showScheduler, setShowScheduler] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TipTapLink.configure({
        openOnClick: false,
      }),
      TipTapImage,
    ],
    content: emailData.content,
    onUpdate: ({ editor }) => {
      setEmailData(prev => ({
        ...prev,
        content: editor.getHTML()
      }));
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setEmailData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSchedule = (date: Date) => {
    setEmailData(prev => ({
      ...prev,
      scheduledDate: date
    }));
    setShowScheduler(false);
  };

  const handleGroupSelect = (recipients: string[], groupName?: string) => {
    setEmailData(prev => ({
      ...prev,
      to: recipients.join(', '),
      selectedGroup: groupName ? { name: groupName, recipients } : null
    }));
    setShowGroupSelector(false);
  };

  const handleSend = async () => {
    try {
      setIsSending(true);
      await onSend({
        ...emailData,
        content: editor?.getHTML() || emailData.content
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      // TODO: Afficher une notification d'erreur
    } finally {
      setIsSending(false);
    }
  };

  // Mise à jour du contenu de l'éditeur si le template change
  useEffect(() => {
    if (template && editor) {
      editor.commands.setContent(template.content);
    }
  }, [template, editor]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-96 bg-background border rounded-t-lg shadow-lg w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="font-medium truncate">
            {emailData.subject || 'Nouveau message'}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMinimize}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={cn(
        "flex flex-col",
        isMaximized ? "w-full h-full" : "w-[800px] h-[600px]"
      )}>
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Nouveau message</DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onMinimize}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onMaximize}
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
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="space-y-4 flex-shrink-0">
            {/* Champs destinataires */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="to" className="text-foreground font-medium">À *</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6"
                  onClick={() => setShowGroupSelector(true)}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Groupe
                </Button>
              </div>
              <Input
                id="to"
                value={emailData.to}
                onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                placeholder="exemple@domaine.com, ..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cc" className="text-foreground font-medium">Cc</Label>
              <Input
                id="cc"
                value={emailData.cc}
                onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
                placeholder="exemple@domaine.com, ..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-foreground font-medium">Objet *</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Entrez l'objet..."
                required
              />
            </div>

            {/* Liste des pièces jointes */}
            {emailData.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {emailData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    <File className="h-4 w-4" />
                    <span className="max-w-[200px] truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-muted-foreground/20"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Éditeur de texte */}
          <div className="flex-1 min-h-0 space-y-2">
            <Label htmlFor="message" className="text-foreground font-medium">Message *</Label>
            <div className="border rounded-md h-full flex flex-col bg-background shadow-sm dark:shadow-accent/10">
              {/* Barre d'outils */}
              <div className="flex items-center gap-1 p-2 border-b">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  data-active={editor?.isActive('bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  data-active={editor?.isActive('italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  data-active={editor?.isActive('bulletList')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  data-active={editor?.isActive('orderedList')}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const url = window.prompt('URL:');
                    if (url) {
                      editor?.chain().focus().setLink({ href: url }).run();
                    }
                  }}
                  data-active={editor?.isActive('link')}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    const url = window.prompt('URL de l\'image:');
                    if (url) {
                      editor?.chain().focus().setImage({ src: url }).run();
                    }
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().undo().run()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => editor?.chain().focus().redo().run()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              {/* Zone d'édition */}
              <EditorContent
                editor={editor}
                className="flex-1 overflow-y-auto p-4"
              />
            </div>
          </div>

          {/* Barre d'actions */}
          <div className="flex-shrink-0 flex items-center justify-between gap-2 pt-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="attachments"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachments')?.click()}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Joindre
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline">
                    <Clock className="h-4 w-4 mr-2" />
                    Programmer
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={emailData.scheduledDate || undefined}
                    onSelect={(date) => date && handleSchedule(date)}
                    disabled={(date) =>
                      date < new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="submit"
              onClick={handleSend}
              disabled={isSending}
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

        {/* Sélecteur de groupe */}
        <GroupEmail
          open={showGroupSelector}
          onClose={() => setShowGroupSelector(false)}
          onSelect={handleGroupSelect}
        />

        {/* Programmation d'envoi */}
        <ScheduledEmail
          open={showScheduler}
          onClose={() => setShowScheduler(false)}
          onSchedule={handleSchedule}
          currentDate={emailData.scheduledDate}
        />
      </DialogContent>
    </Dialog>
  );
}
