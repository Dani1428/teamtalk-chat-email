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

      ws.onclose = (event) => {
        console.log('WebSocket déconnecté:', event);
        setConnected(false);
        setSocket(null);

        // Tentative de reconnexion avec délai exponentiel
        const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts);
        reconnectAttempts++;

        toast({
          title: "Déconnecté",
          description: "Tentative de reconnexion...",
          variant: "destructive"
        });

        setTimeout(() => {
          connectWebSocket();
        }, delay);
      };

      ws.onerror = (error) => {
        console.error('Erreur WebSocket:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue avec la connexion WebSocket.",
          variant: "destructive"
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Message reçu:', data);

          // Gérer les différents types de messages
          switch (data.type) {
            case 'error':
              toast({
                title: "Erreur",
                description: data.message,
                variant: "destructive"
              });
              break;
            case 'notification':
              toast({
                title: data.title,
                description: data.message,
              });
              break;
            // Ajouter d'autres cas selon les besoins
          }

          // Émettre un événement personnalisé pour que d'autres composants puissent réagir
          const customEvent = new CustomEvent('websocket-message', {
            detail: data
          });
          window.dispatchEvent(customEvent);
        } catch (error) {
          console.error('Erreur lors du traitement du message:', error);
        }
      };

      setSocket(ws);
      return ws;
    } catch (error) {
      console.error('Erreur lors de la création du WebSocket:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'établir la connexion WebSocket.",
        variant: "destructive"
      });
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
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event, data }));
    } else {
      console.error('WebSocket non connecté');
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message : connexion perdue.",
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
