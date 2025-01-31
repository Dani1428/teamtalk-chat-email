import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Mic, Send, Plus, Square, Loader2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const {
    isRecording,
    audioBlob,
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
    if (message.trim() || attachments.length > 0 || audioBlob) {
      try {
        setIsLoading(true);
        // Créer un FormData pour envoyer le message et les fichiers
        const formData = new FormData();
        formData.append('channel', channel);
        formData.append('message', message);
        
        // Ajouter les pièces jointes
        attachments.forEach(file => {
          formData.append('attachments', file);
        });

        // Ajouter l'enregistrement vocal s'il existe
        if (audioBlob) {
          formData.append('audio', audioBlob, 'voice-message.webm');
        }

        // TODO: Envoyer le formData au serveur
        console.log("Message à envoyer:", {
          message,
          attachments: attachments.map(f => f.name),
          audioBlob: audioBlob ? 'présent' : 'absent'
        });
        
        // Simuler un délai d'envoi
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Réinitialiser le formulaire
        setMessage("");
        setAttachments([]);
        
        toast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès",
        });
      } catch (err) {
        console.error('Erreur lors de l\'envoi du message:', err);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du message",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
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
        await stopRecording();
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

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
          {/* Bouton d'ajout de contenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                disabled={isRecording || isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem 
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || isLoading}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Fichier
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleVoiceRecord}
                disabled={isLoading}
              >
                <Mic className="h-4 w-4 mr-2" />
                Message vocal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Zone de texte */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isRecording ? "Enregistrement en cours..." : "Écrivez votre message..."}
            className="min-h-[40px] flex-1 resize-none border-0 focus:ring-0 p-2 text-sm bg-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isRecording || isLoading}
          />

          {/* Boutons d'action */}
          <div className="flex items-center gap-2">
            {/* Bouton d'enregistrement */}
            <Button
              type="button"
              variant={isRecording ? "destructive" : "ghost"}
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                isRecording && "animate-pulse"
              )}
              onClick={handleVoiceRecord}
              disabled={isLoading}
            >
              {isRecording ? (
                <Square className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            {/* Bouton d'envoi */}
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={(!message.trim() && !attachments.length && !audioBlob) || isLoading || isRecording}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Input de fichier caché */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />

        {/* Affichage des pièces jointes */}
        {(attachments.length > 0 || audioBlob) && (
          <div className="mt-2 space-y-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
              >
                <Paperclip className="h-4 w-4" />
                <span className="flex-1 truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setAttachments(attachments.filter((_, i) => i !== index));
                  }}
                  disabled={isLoading}
                >
                  ×
                </Button>
              </div>
            ))}
            {audioBlob && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                <Mic className="h-4 w-4" />
                <span className="flex-1">Message vocal</span>
                <audio className="mx-2 h-8" controls src={URL.createObjectURL(audioBlob)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setAttachments(attachments.filter(file => !file.name.includes('voice-message')));
                  }}
                  disabled={isLoading}
                >
                  ×
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

export default MessageInput;