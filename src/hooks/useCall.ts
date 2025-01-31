import { useState, useCallback, useRef } from 'react';

interface UseCallReturn {
  isInCall: boolean;
  isReceivingCall: boolean;
  callType: 'audio' | 'video' | null;
  startCall: (type: 'audio' | 'video') => Promise<void>;
  endCall: () => void;
  answerCall: () => Promise<void>;
  rejectCall: () => void;
  error: string | null;
}

const useCall = (): UseCallReturn => {
  const [isInCall, setIsInCall] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCall = useCallback(async (type: 'audio' | 'video') => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
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
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setIsInCall(false);
    setCallType(null);
    setError(null);
  }, []);

  const answerCall = useCallback(async () => {
    try {
      const constraints = {
        audio: true,
        video: callType === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsReceivingCall(false);
      setIsInCall(true);
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la réponse à l\'appel:', err);
      if (err instanceof Error) {
        setError(`Erreur lors de la réponse: ${err.message}`);
      } else {
        setError('Une erreur inattendue s\'est produite');
      }
      throw err;
    }
  }, [callType]);

  const rejectCall = useCallback(() => {
    setIsReceivingCall(false);
    setCallType(null);
    setError(null);
  }, []);

  return {
    isInCall,
    isReceivingCall,
    callType,
    startCall,
    endCall,
    answerCall,
    rejectCall,
    error
  };
};

export default useCall;
