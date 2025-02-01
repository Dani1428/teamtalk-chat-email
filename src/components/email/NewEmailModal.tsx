import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Paperclip, Send } from 'lucide-react';

interface NewEmailModalProps {
  onClose: () => void;
  onSend: (data: EmailData) => void;
}

interface EmailData {
  to: string;
  cc?: string;
  subject: string;
  message: string;
  attachments?: File[];
}

export const NewEmailModal: React.FC<NewEmailModalProps> = ({ onClose, onSend }) => {
  const [emailData, setEmailData] = useState<EmailData>({
    to: '',
    cc: '',
    subject: '',
    message: '',
    attachments: [],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEmailData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(emailData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Nouveau message</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="to">À*</Label>
            <Input
              id="to"
              value={emailData.to}
              onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
              placeholder="adresse@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="cc">Cc</Label>
            <Input
              id="cc"
              value={emailData.cc}
              onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
              placeholder="adresse@email.com"
            />
          </div>

          <div>
            <Label htmlFor="subject">Objet*</Label>
            <Input
              id="subject"
              value={emailData.subject}
              onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Objet de l'email"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Message*</Label>
            <Textarea
              id="message"
              value={emailData.message}
              onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Rédigez votre message..."
              required
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="attachments">Pièces jointes</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="w-full"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Ajouter des fichiers
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
              
              {emailData.attachments && emailData.attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {emailData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Formats acceptés : PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
