import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { WS_URL } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';

interface SocketContextType {
  socket: WebSocket | null;
  connected: boolean;
  sendMessage: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  sendMessage: () => {},
});

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000;

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  const connectWebSocket = useCallback(() => {
    try {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Nombre maximum de tentatives de reconnexion atteint');
        toast({
          title: "Erreur de connexion",
          description: "Impossible de se connecter au serveur après plusieurs tentatives.",
          variant: "destructive"
        });
        return null;
      }

      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connecté');
        setConnected(true);
        reconnectAttempts = 0; // Réinitialiser le compteur après une connexion réussie
        toast({
          title: "Connecté",
          description: "La connexion au serveur est établie.",
        });
      };

      ws.onclose = () => {
        console.log('WebSocket déconnecté');
        setConnected(false);
        setSocket(null);

        // Augmenter le délai de reconnexion exponentiellement
        const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
        reconnectAttempts++;

        toast({
          title: "Déconnecté",
          description: `La connexion au serveur a été perdue. Tentative de reconnexion ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`,
          variant: "destructive"
        });

        setTimeout(connectWebSocket, delay);
      };

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
      };

      setSocket(ws);
      return ws;
    } catch (error) {
      console.error('Erreur lors de la création du WebSocket:', error);
      return null;
    }
  }, [toast]);

  useEffect(() => {
    const ws = connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((event: string, data: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({ event, data }));
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message au serveur.",
          variant: "destructive"
        });
      }
    } else {
      console.warn('WebSocket non connecté');
      toast({
        title: "Non connecté",
        description: "Impossible d'envoyer le message : non connecté au serveur.",
        variant: "destructive"
      });
    }
  }, [socket, toast]);

  return (
    <SocketContext.Provider value={{ socket, connected, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
