import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Clock,
  X,
  ChevronDown,
  Users,
  Star,
  Tag,
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: any) => void;
  initialData?: any;
  type?: 'reply' | 'replyAll' | 'forward' | 'new';
}

export function EmailComposer({
  isOpen,
  onClose,
  onSend,
  initialData,
  type = 'new',
}: EmailComposerProps) {
  const [email, setEmail] = useState({
    to: initialData?.to || '',
    cc: initialData?.cc || '',
    bcc: initialData?.bcc || '',
    subject: initialData?.subject || '',
    content: initialData?.content || '',
    attachments: [] as File[],
    scheduledDate: null as Date | null,
    priority: 'normal' as 'high' | 'normal' | 'low',
    labels: [] as string[],
  });

  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);

  const handleAttachFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setEmail(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)],
      }));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setEmail(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSend = () => {
    onSend(email);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {type === 'reply' ? 'Répondre' :
               type === 'replyAll' ? 'Répondre à tous' :
               type === 'forward' ? 'Transférer' :
               'Nouveau message'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Labels
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                    Travail
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    Personnel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                    Important
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={() => setShowScheduler(true)}>
                <Clock className="h-4 w-4 mr-2" />
                Programmer
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="to">À:</Label>
                <div className="flex-1">
                  <Input
                    id="to"
                    value={email.to}
                    onChange={e => setEmail(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="Destinataires"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCc(true);
                    setShowBcc(true);
                  }}
                >
                  Cc/Cci
                </Button>
              </div>

              {showCc && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="cc">Cc:</Label>
                  <Input
                    id="cc"
                    value={email.cc}
                    onChange={e => setEmail(prev => ({ ...prev, cc: e.target.value }))}
                    placeholder="Copie à"
                  />
                </div>
              )}

              {showBcc && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="bcc">Cci:</Label>
                  <Input
                    id="bcc"
                    value={email.bcc}
                    onChange={e => setEmail(prev => ({ ...prev, bcc: e.target.value }))}
                    placeholder="Copie cachée à"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Label htmlFor="subject">Objet:</Label>
                <Input
                  id="subject"
                  value={email.subject}
                  onChange={e => setEmail(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Objet du message"
                />
              </div>
            </div>

            <div className="border-t border-b py-2 flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Italic className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-gray-200" />
              <Button variant="ghost" size="icon">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-gray-200" />
              <Button variant="ghost" size="icon">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <AlignRight className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-gray-200" />
              <Button variant="ghost" size="icon">
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <Textarea
                value={email.content}
                onChange={e => setEmail(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Composez votre message..."
                className="min-h-[200px] resize-none border-0 focus-visible:ring-0"
              />

              {email.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Pièces jointes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {email.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={handleAttachFiles}
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer"
              >
                <Button variant="outline" size="sm" type="button">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Joindre
                </Button>
              </Label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Modèles
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    Invitation à une réunion
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Rapport hebdomadaire
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Gérer les modèles
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSend}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
