import { createContext, useContext, useEffect, useState, useCallback } from 'react';

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

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { event: eventName, data } = message;
        
        switch (eventName) {
          case 'callUser':
            // Handle incoming call
            break;
          case 'callAccepted':
            // Handle call accepted
            break;
          case 'iceCandidateReceived':
            // Handle ICE candidate
            break;
          case 'callEnded':
            // Handle call ended
            break;
          default:
            console.log('Unhandled event:', eventName, data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setSocket(ws);
    return ws;
  }, []);

  useEffect(() => {
    const ws = connectWebSocket();
    return () => {
      ws.close();
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((event: string, data: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ event, data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connected, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
