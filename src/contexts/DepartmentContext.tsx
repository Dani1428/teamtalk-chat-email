import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { API_ROUTES } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';

interface Department {
  id: number;
  name: string;
  channels: string[];
}

interface DepartmentContextType {
  departments: Department[];
  selectedDepartment: number | null;
  setSelectedDepartment: (id: number | null) => void;
  addDepartment: (name: string) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
  addChannel: (departmentId: number, channelName: string) => Promise<void>;
  deleteChannel: (departmentId: number, channelName: string) => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export function DepartmentProvider({ children }: { children: React.ReactNode }) {
  const { socket, connected } = useSocket();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

  const loadDepartments = async () => {
    try {
      const response = await fetch(API_ROUTES.departments.list);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des départements');
      }
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.warn('Utilisation des données de test :', error);
      // Utiliser les données de test en mode développement
      if (process.env.NODE_ENV === 'development') {
        setDepartments([
          { id: 1, name: "Marketing", channels: ["général", "campagnes"] },
          { id: 2, name: "Développement", channels: ["général", "bugs", "features"] },
          { id: 3, name: "RH", channels: ["général", "recrutement"] },
        ]);
        toast({
          title: "Mode développement",
          description: "Utilisation des données de test pour la démonstration.",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les départements. Veuillez réessayer plus tard.",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    if (!connected && process.env.NODE_ENV === 'production') {
      console.warn('WebSocket non connecté, certaines fonctionnalités peuvent être limitées');
      toast({
        title: "Connexion limitée",
        description: "La connexion au serveur est limitée. Certaines fonctionnalités peuvent ne pas être disponibles.",
        variant: "destructive"
      });
    }
    loadDepartments();
  }, [connected]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        switch (message.event) {
          case 'department_updated':
            loadDepartments(); // Recharger tous les départements
            break;
          case 'department_added':
            setDepartments(prev => [...prev, message.data]);
            break;
          case 'department_deleted':
            setDepartments(prev => prev.filter(dept => dept.id !== message.data));
            break;
          case 'channel_added':
          case 'channel_deleted':
            loadDepartments(); // Recharger tous les départements
            break;
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message WebSocket:', error);
      }
    };

    if (socket) {
      socket.addEventListener('message', handleMessage);
      return () => {
        socket.removeEventListener('message', handleMessage);
      };
    }
  }, [socket, connected, toast]);

  const addDepartment = async (name: string) => {
    try {
      // En mode test, simuler l'ajout d'un département
      const newDepartment = {
        id: departments.length + 1,
        name,
        channels: ["général"]
      };
      setDepartments(prev => [...prev, newDepartment]);
      toast({
        title: "Département ajouté",
        description: `Le département ${name} a été créé avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du département:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du département.",
        variant: "destructive"
      });
      throw new Error('Erreur lors de l\'ajout du département');
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      // En mode test, simuler la suppression
      setDepartments(prev => prev.filter(dept => dept.id !== id));
      toast({
        title: "Département supprimé",
        description: "Le département a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du département:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du département.",
        variant: "destructive"
      });
      throw new Error('Erreur lors de la suppression du département');
    }
  };

  const addChannel = async (departmentId: number, channelName: string) => {
    try {
      // En mode test, simuler l'ajout d'un canal
      setDepartments(prev => prev.map(dept => 
        dept.id === departmentId
          ? { ...dept, channels: [...dept.channels, channelName] }
          : dept
      ));
      toast({
        title: "Canal ajouté",
        description: `Le canal ${channelName} a été ajouté avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du canal:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du canal.",
        variant: "destructive"
      });
      throw new Error('Erreur lors de l\'ajout du canal');
    }
  };

  const deleteChannel = async (departmentId: number, channelName: string) => {
    try {
      // En mode test, simuler la suppression du canal
      setDepartments(prev => prev.map(dept => 
        dept.id === departmentId
          ? { ...dept, channels: dept.channels.filter(ch => ch !== channelName) }
          : dept
      ));
      toast({
        title: "Canal supprimé",
        description: `Le canal ${channelName} a été supprimé avec succès.`
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du canal:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du canal.",
        variant: "destructive"
      });
      throw new Error('Erreur lors de la suppression du canal');
    }
  };

  return (
    <DepartmentContext.Provider 
      value={{ 
        departments, 
        selectedDepartment,
        setSelectedDepartment,
        addDepartment,
        deleteDepartment,
        addChannel,
        deleteChannel
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartments must be used within a DepartmentProvider');
  }
  return context;
};
