import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Editor } from '@tinymce/tinymce-react';

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: EmailData) => void;
}

interface EmailData {
  to: string;
  subject: string;
  content: string;
  attachments: File[];
}

export const EmailComposer = ({ isOpen, onClose, onSend }: EmailComposerProps) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    onSend({ to, subject, content, attachments });
    onClose();
    // Reset form
    setTo('');
    setSubject('');
    setContent('');
    setAttachments([]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouveau Message</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="À"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          
          <Input
            placeholder="Objet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <Editor
            apiKey="your-tinymce-api-key"
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            }}
            value={content}
            onEditorChange={setContent}
          />

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mr-2"
            >
              Ajouter des pièces jointes
            </Button>
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSend}>
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
