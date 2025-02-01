import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, Send, Plus, Square, Loader2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

interface MessageInputProps {
  channel: string;
  className?: string;
}

function MessageInput({ channel, className }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const {
    isRecording,
    startRecording,
    stopRecording,
    error
  } = useVoiceRecorder();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur d'enregistrement",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier s'il y a du contenu à envoyer
    const hasContent = message.trim() || attachments.length > 0 || audioBlob;
    if (!hasContent || isLoading || isRecording) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Créer un FormData pour envoyer le message et les fichiers
      const formData = new FormData();
      formData.append('channel', channel);
      
      // N'ajouter le message que s'il n'est pas vide
      if (message.trim()) {
        formData.append('message', message.trim());
      }
      
      // Ajouter les pièces jointes
      if (attachments.length > 0) {
        attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      // Ajouter l'enregistrement vocal s'il existe
      if (audioBlob) {
        formData.append('audio', audioBlob, 'voice-message.webm');
      }

      // Envoyer le message au serveur
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Erreur lors de l'envoi du message: ${response.statusText}`
        );
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }

      // Réinitialiser le formulaire après l'envoi réussi
      setMessage("");
      setAttachments([]);
      setAudioBlob(null);

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès.",
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Vérifier la taille des fichiers (max 10MB par fichier)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const invalidFiles = files.filter(file => file.size > maxSize);
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Fichiers trop volumineux",
          description: "Certains fichiers dépassent la limite de 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const handleVoiceRecord = async () => {
    try {
      if (isRecording) {
        const blob = await stopRecording();
        setAudioBlob(blob);
        toast({
          title: "Enregistrement terminé",
          description: "Votre message vocal a été enregistré",
        });
      } else {
        await startRecording();
        toast({
          title: "Enregistrement démarré",
          description: "Parlez dans votre microphone...",
        });
      }
    } catch (err) {
      console.error('Erreur avec l\'enregistrement vocal:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue avec l'enregistrement vocal",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex flex-col space-y-2">
        {/* Zone de prévisualisation des pièces jointes */}
        {(attachments.length > 0 || audioBlob) && (
          <div className="flex flex-wrap gap-2 p-2 bg-accent/50 rounded-md">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-background/95 border rounded-md p-1 text-sm shadow-sm"
              >
                <span className="max-w-[150px] truncate text-foreground">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {audioBlob && (
              <div className="flex items-center gap-2 bg-background/95 border rounded-md p-1 shadow-sm">
                <audio 
                  className="h-8" 
                  controls 
                  src={URL.createObjectURL(audioBlob)} 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  onClick={() => setAudioBlob(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Zone de saisie du message */}
        <div className="relative flex items-end gap-2">
          <Textarea
            placeholder="Écrivez votre message..."
            className="min-h-[80px] flex-1 bg-background text-foreground placeholder:text-muted-foreground resize-none focus-visible:ring-1 focus-visible:ring-ring"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isRecording}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 interactive-element"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={cn(
                "interactive-element",
                isRecording 
                  ? "text-destructive-foreground hover:bg-destructive/90" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Button
              type="submit"
              variant="default"
              size="icon"
              disabled={(!message.trim() && !attachments.length && !audioBlob) || isLoading || isRecording}
              className={cn(
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
    </form>
  );
}

export default MessageInput;