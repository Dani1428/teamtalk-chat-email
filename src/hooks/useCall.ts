import { useState, useCallback } from 'react';

interface UseCallReturn {
  isInCall: boolean;
  callType: 'audio' | 'video' | null;
  error: string | null;
  startCall: (type: 'audio' | 'video') => Promise<void>;
  endCall: () => void;
}

const useCall = (): UseCallReturn => {
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCall = useCallback(async (type: 'audio' | 'video') => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: type === 'video'
      };

      await navigator.mediaDevices.getUserMedia(constraints);
      setCallType(type);
      setIsInCall(true);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du démarrage de l\'appel:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('L\'accès au microphone/caméra a été refusé');
        } else if (err.name === 'NotFoundError') {
          setError('Aucun périphérique audio/vidéo n\'a été trouvé');
        } else {
          setError(`Erreur lors de l'appel: ${err.message}`);
        }
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
      throw err;
    }
  }, []);

  const endCall = useCallback(() => {
    setIsInCall(false);
    setCallType(null);
    setError(null);
  }, []);

  return {
    isInCall,
    callType,
    error,
    startCall,
    endCall
  };
};

export default useCall;
