import { useState, useCallback, useRef } from 'react';

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  audioBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  error: string | null;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      console.log('Demande d\'accès au microphone...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      console.log('Accès au microphone accordé, création du MediaRecorder...');
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        console.log('Données audio disponibles:', e.data.size, 'bytes');
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log('Enregistrement arrêté, création du blob...');
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => {
          console.log('Arrêt de la piste audio:', track.label);
          track.stop();
        });
      };

      recorder.onerror = (e) => {
        console.error('Erreur du MediaRecorder:', e);
        setError('Erreur lors de l\'enregistrement');
      };

      console.log('Démarrage de l\'enregistrement...');
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de l\'accès au microphone:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('L\'accès au microphone a été refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
        } else if (err.name === 'NotFoundError') {
          setError('Aucun microphone n\'a été trouvé sur votre appareil.');
        } else {
          setError(`Erreur lors de l'accès au microphone: ${err.message}`);
        }
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('Arrêt de l\'enregistrement...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      console.log('Impossible d\'arrêter l\'enregistrement: pas de MediaRecorder actif');
    }
  }, []);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    error
  };
}
