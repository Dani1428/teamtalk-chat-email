import React, { useState, useRef } from 'react';
import {
  Smile,
  Paperclip,
  Send,
  Image as ImageIcon,
  Mic,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';

interface ChatInputProps {
  onSend: (content: string, attachments: File[]) => void;
  onTyping?: () => void;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
  onCancelReply?: () => void;
}

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🤔'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function ChatInput({
  onSend,
  onTyping,
  replyTo,
  onCancelReply,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMessage);
      // Mettre à jour la position du curseur après l'emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(message + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);
    
    if (validFiles.length < files.length) {
      // Afficher un message d'erreur pour les fichiers trop volumineux
      alert('Certains fichiers dépassent la taille maximale de 50MB');
    }

    setAttachments([...attachments, ...validFiles]);
    
    // Simuler un upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(0);
      }
    }, 100);
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSend(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const toggleRecording = () => {
    // Implémenter l'enregistrement audio
    setIsRecording(!isRecording);
  };

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-950 p-4 space-y-4">
      {/* Zone de réponse */}
      {replyTo && (
        <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded">
          <div className="flex-1">
            <span className="font-medium">{replyTo.sender.name}</span>
            <p className="text-gray-500 line-clamp-1">{replyTo.content}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Zone des pièces jointes */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded"
            >
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Barre de progression */}
      {uploadProgress > 0 && (
        <Progress value={uploadProgress} className="h-1" />
      )}

      {/* Zone de saisie */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Écrivez votre message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              onTyping?.();
            }}
            onKeyPress={handleKeyPress}
            className="min-h-[80px] pr-12"
            rows={1}
          />
          
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="flex gap-1">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? 'text-red-500' : ''}
          >
            <Mic className="h-4 w-4" />
          </Button>

          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
