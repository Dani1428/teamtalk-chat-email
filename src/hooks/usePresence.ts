import { useState, useEffect } from 'react';

interface PresenceState {
  [userId: string]: {
    online: boolean;
    lastSeen: Date;
  };
}

export const usePresence = () => {
  const [presenceState, setPresenceState] = useState<PresenceState>({});

  const updatePresence = (userId: string, online: boolean) => {
    setPresenceState(prev => ({
      ...prev,
      [userId]: {
        online,
        lastSeen: new Date(),
      },
    }));
  };

  useEffect(() => {
    // Simuler la mise à jour de la présence toutes les 30 secondes
    const interval = setInterval(() => {
      // Ici, vous ajouterez plus tard la logique de synchronisation avec le backend
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    presenceState,
    updatePresence,
  };
};
