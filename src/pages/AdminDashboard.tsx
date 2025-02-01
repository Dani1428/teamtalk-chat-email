import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { API_ROUTES } from '@/config/api';
import { useDepartments } from '@/contexts/DepartmentContext';
import { 
  Settings, 
  Mail, 
  Plus, 
  X, 
  Save, 
  RefreshCw, 
  MoreVertical, 
  AlertCircle, 
  BarChart2, 
  CheckCircle, 
  XCircle,
  PieChart as PieChartIcon
} from "lucide-react";

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SmtpConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
}

interface EmailStats {
  sent: number;
  received: number;
  spam: number;
  failed: number;
}

interface Department {
  id: number;
  name: string;
  channels: string[];
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  department: string;
  lastActive: string;
}

interface EmailHistory {
  id: number;
  to: string;
  subject: string;
  status: string;
  date: string;
  department: string;
}

interface EmailSettings {
  maxRetries: number;
  retryDelay: number;
  maxAttachmentSize: number;
  allowedFileTypes: string;
  signature: string;
}

interface UserProfile {
  defaultSettings: {
    language: string;
    theme: string;
    notifications: boolean;
    emailNotifications: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  roles: {
    id: number;
    name: string;
    permissions: string[];
  }[];
  permissions: {
    id: string;
    description: string;
  }[];
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { 
    departments,
    addDepartment,
    deleteDepartment,
    addChannel,
    deleteChannel,
    selectedDepartment,
    setSelectedDepartment 
  } = useDepartments();

  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    host: "smtp.zeptomail.com",
    port: "587",
    username: "emailapikey",
    password: "wSsVR61+qRH5X6d1yTGpJuhtzAlRVFOkF0x73ATwvXD9SqzL8sc4wRGcBAL0SqUcFzQ/ETMT8bh9nEsD1DcLidopzAwCXCiF9mqRe1U4J3x17qnvhDzMXm5amxCOKI4OwQ9qkmlkE84m+g==",
    fromEmail: "noreply@teamtalk.com"
  });

  const [emailStats, setEmailStats] = useState<EmailStats>({
    sent: 1234,
    received: 2567,
    spam: 45,
    failed: 23,
  });

  const [newDepartment, setNewDepartment] = useState("");
  const [newChannel, setNewChannel] = useState("");

  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: "Sophie Martin", 
      email: "sophie.martin@example.com",
      role: "Admin",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      department: "Marketing",
      lastActive: "2024-01-30T15:45:00Z"
    },
    { 
      id: 2, 
      name: "Thomas Dubois", 
      email: "thomas.dubois@example.com",
      role: "User",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      department: "Développement",
      lastActive: "2024-01-30T16:30:00Z"
    },
    { 
      id: 3, 
      name: "Marie Lambert", 
      email: "marie.lambert@example.com",
      role: "User",
      status: "inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      department: "RH",
      lastActive: "2024-01-29T10:15:00Z"
    }
  ]);

  const [newUser, setNewUser] = useState({
    email: "",
    role: "User",
    department: ""
  });

  const [emailHistory] = useState<EmailHistory[]>([
    {
      id: 1,
      to: "client@example.com",
      subject: "Mise à jour importante",
      status: "delivered",
      date: "2024-01-30T14:23:00Z",
      department: "Marketing"
    },
    {
      id: 2,
      to: "partner@example.com",
      subject: "Invitation réunion",
      status: "failed",
      date: "2024-01-30T13:15:00Z",
      department: "Développement"
    },
    {
      id: 3,
      to: "team@example.com",
      subject: "Rapport hebdomadaire",
      status: "delivered",
      date: "2024-01-30T12:00:00Z",
      department: "RH"
    }
  ]);

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    maxRetries: 3,
    retryDelay: 5,
    maxAttachmentSize: 10,
    allowedFileTypes: ".pdf,.doc,.docx,.xls,.xlsx",
    signature: "<p>Cordialement,<br/>L'équipe TeamTalk</p>"
  });

  const [defaultSettings, setDefaultSettings] = useState({
    language: 'fr',
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: 30
  });

  const [userProfiles, setUserProfiles] = useState<UserProfile>({
    defaultSettings: {
      language: "fr",
      theme: "light",
      notifications: true,
      emailNotifications: true,
      twoFactorAuth: false,
      sessionTimeout: 30
    },
    roles: [
      { id: 1, name: "Admin", permissions: ["all"] },
      { id: 2, name: "Manager", permissions: ["read", "write", "invite"] },
      { id: 3, name: "User", permissions: ["read", "write"] },
      { id: 4, name: "Guest", permissions: ["read"] }
    ],
    permissions: [
      { id: "all", description: "Accès complet" },
      { id: "read", description: "Lecture seule" },
      { id: "write", description: "Écriture" },
      { id: "invite", description: "Inviter des utilisateurs" },
      { id: "manage_channels", description: "Gérer les canaux" },
      { id: "manage_users", description: "Gérer les utilisateurs" }
    ]
  });

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    permissions: [] as string[]
  });

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
  const [bulkEmailContent, setBulkEmailContent] = useState({
    subject: '',
    message: ''
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSMTPSave = async () => {
    try {
      // Mode test : simuler la sauvegarde
      // En production, décommenter le code ci-dessous
      /*
      const response = await fetch(API_ROUTES.settings.smtp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smtpConfig),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde de la configuration SMTP');
      }
      */

      // Simulation de la sauvegarde réussie
      console.log('Configuration SMTP sauvegardée:', smtpConfig);
      
      toast({
        title: "Configuration sauvegardée",
        description: "La configuration SMTP a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration SMTP:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de la configuration SMTP.",
        variant: "destructive",
      });
    }
  };

  const handleEmailSettingsSave = () => {
    toast({
      title: "Paramètres email sauvegardés",
      description: "Les paramètres ont été mis à jour avec succès."
    });
  };

  const handleAddDepartment = async () => {
    if (newDepartment.trim()) {
      try {
        await addDepartment(newDepartment.trim());
        setNewDepartment("");
        toast({
          title: "Département ajouté",
          description: `Le département ${newDepartment} a été créé avec succès.`
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le département.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      await deleteDepartment(id);
      toast({
        title: "Département supprimé",
        description: "Le département a été supprimé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le département.",
        variant: "destructive"
      });
    }
  };

  const handleAddChannel = async () => {
    if (selectedDepartment && newChannel.trim()) {
      try {
        await addChannel(selectedDepartment, newChannel.trim());
        setNewChannel("");
        toast({
          title: "Canal ajouté",
          description: `Le canal ${newChannel} a été ajouté avec succès.`
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le canal.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteChannel = async (deptId: number, channel: string) => {
    try {
      await deleteChannel(deptId, channel);
      toast({
        title: "Canal supprimé",
        description: "Le canal a été supprimé avec succès."
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le canal.",
        variant: "destructive"
      });
    }
  };

  const handleInviteUser = () => {
    if (newUser.email && newUser.department) {
      toast({
        title: "Invitation envoyée",
        description: `Une invitation a été envoyée à ${newUser.email}`,
      });
      setNewUser({ email: "", role: "User", department: "" });
    }
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Utilisateur supprimé",
      description: "L'utilisateur a été supprimé avec succès."
    });
  };

  const handleUpdateUserProfile = (userId: number, updates: any) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, ...updates };
      }
      return user;
    }));
    toast({
      title: "Profil mis à jour",
      description: "Les modifications ont été enregistrées avec succès."
    });
  };

  const handleEditRole = (roleId: number) => {
    setEditingRole(roleId);
    const role = userProfiles.roles.find(r => r.id === roleId);
    if (role) {
      setNewRole({
        name: role.name,
        permissions: [...role.permissions]
      });
    }
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setUserProfiles(prev => ({
        ...prev,
        roles: prev.roles.map(role => 
          role.id === editingRole
            ? { ...role, name: newRole.name, permissions: newRole.permissions }
            : role
        )
      }));
    } else {
      // Ajouter un nouveau rôle
      const newRoleId = Math.max(...userProfiles.roles.map(r => r.id)) + 1;
      setUserProfiles(prev => ({
        ...prev,
        roles: [...prev.roles, { id: newRoleId, ...newRole }]
      }));
    }
    setEditingRole(null);
    setNewRole({ name: '', permissions: [] });
    toast({
      title: editingRole ? "Rôle modifié" : "Rôle ajouté",
      description: "Les modifications ont été enregistrées avec succès."
    });
  };

  const handleDeleteRole = (roleId: number) => {
    setUserProfiles(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role.id !== roleId)
    }));
    toast({
      title: "Rôle supprimé",
      description: "Le rôle a été supprimé avec succès."
    });
  };

  const handleTogglePermission = (permission: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleBulkPasswordReset = async () => {
    try {
      const response = await fetch(`${API_ROUTES.users.bulkActions}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (!response.ok) throw new Error('Erreur lors de la réinitialisation des mots de passe');

      toast({
        title: "Mots de passe réinitialisés",
        description: "Les mots de passe ont été réinitialisés avec succès. Les utilisateurs recevront un email avec leur nouveau mot de passe.",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la réinitialisation des mots de passe.",
        variant: "destructive"
      });
    }
  };

  const handleSendBulkEmail = async () => {
    try {
      // Création d'un FormData pour envoyer les fichiers
      const formData = new FormData();
      formData.append('subject', bulkEmailContent.subject);
      formData.append('message', bulkEmailContent.message);
      
      // Ajout des pièces jointes
      attachments.forEach((file, index) => {
        formData.append(`attachment${index}`, file);
      });

      // Mode test : simulation de l'envoi
      console.log('Email à envoyer:', {
        subject: bulkEmailContent.subject,
        message: bulkEmailContent.message,
        attachments: attachments.map(file => file.name)
      });

      /*
      const response = await fetch(API_ROUTES.users.bulkEmail, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des emails');
      }
      */

      // Réinitialisation du formulaire
      setBulkEmailContent({ subject: '', message: '' });
      setAttachments([]);

      toast({
        title: "Emails envoyés",
        description: "Les emails ont été envoyés avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi des emails.",
        variant: "destructive",
      });
    }
  };

  const handleBulkSettingsUpdate = async () => {
    try {
      const response = await fetch(API_ROUTES.users.bulkActions.settings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          settings: userProfiles.defaultSettings,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour des paramètres');

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été mis à jour avec succès pour tous les utilisateurs sélectionnés.",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive"
      });
    }
  };

  const handleDefaultSettingsUpdate = async (updates: Partial<typeof defaultSettings>) => {
    try {
      const newSettings = { ...defaultSettings, ...updates };
      setDefaultSettings(newSettings);

      const response = await fetch(API_ROUTES.settings.updateDefaults, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour des paramètres');

      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres par défaut ont été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des paramètres.",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Data for the pie chart
  const data = [
    { name: 'Envoyés', value: emailStats.sent },
    { name: 'Reçus', value: emailStats.received },
    { name: 'Spam', value: emailStats.spam },
    { name: 'Échecs', value: emailStats.failed },
  ];

  // Colors for pie chart sections
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Retour à l'application
          </Button>
        </div>

        {/* Admin Dashboard Container */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <Tabs defaultValue="channels" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="channels">Canaux</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            {/* Canaux Tab */}
            <TabsContent value="channels">
              <div className="space-y-6">
                {/* Ajout de département */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ajouter un département</h3>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nom du département"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                    />
                    <Button onClick={handleAddDepartment}>
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>

                {/* Liste des départements */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Départements</h3>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium">{dept.name}</h4>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDepartment(dept.id)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Canal
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDepartment(dept.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Liste des canaux du département */}
                        <div className="pl-4 space-y-2">
                          {dept.channels.map((channel) => (
                            <div key={channel} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">#{channel}</span>
                              {channel !== "général" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteChannel(dept.id, channel)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Formulaire d'ajout de canal */}
                        {selectedDepartment === dept.id && (
                          <div className="mt-4 flex space-x-2">
                            <Input
                              placeholder="Nom du canal"
                              value={newChannel}
                              onChange={(e) => setNewChannel(e.target.value)}
                              size="sm"
                            />
                            <Button size="sm" onClick={handleAddChannel}>
                              Ajouter
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Utilisateurs Tab */}
            <TabsContent value="users">
              <div className="space-y-6">
                {/* Formulaire d'invitation */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Inviter un utilisateur</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input 
                        type="email" 
                        placeholder="email@example.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Rôle</Label>
                      <select 
                        className="w-full px-3 py-2 border rounded-md"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      >
                        <option value="User">Utilisateur</option>
                        <option value="Admin">Administrateur</option>
                      </select>
                    </div>
                    <div>
                      <Label>Département</Label>
                      <select 
                        className="w-full px-3 py-2 border rounded-md"
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      >
                        <option value="">Sélectionner...</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Button 
                    className="mt-4"
                    onClick={handleInviteUser}
                    disabled={!newUser.email || !newUser.department}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Inviter l'utilisateur
                  </Button>
                </div>

                {/* Paramètres des profils */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Paramètres des profils</h3>
                  
                  {/* Paramètres par défaut */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Paramètres par défaut</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Langue par défaut</Label>
                        <select 
                          className="w-full px-3 py-2 border rounded-md"
                          value={defaultSettings.language}
                          onChange={(e) => handleDefaultSettingsUpdate({ language: e.target.value })}
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                        </select>
                      </div>
                      <div>
                        <Label>Thème par défaut</Label>
                        <select 
                          className="w-full px-3 py-2 border rounded-md"
                          value={defaultSettings.theme}
                          onChange={(e) => handleDefaultSettingsUpdate({ theme: e.target.value })}
                        >
                          <option value="light">Clair</option>
                          <option value="dark">Sombre</option>
                          <option value="system">Système</option>
                        </select>
                      </div>
                      <div>
                        <Label>Timeout session (minutes)</Label>
                        <Input 
                          type="number"
                          min="1"
                          max="1440"
                          value={defaultSettings.sessionTimeout}
                          onChange={(e) => handleDefaultSettingsUpdate({ 
                            sessionTimeout: Math.max(1, Math.min(1440, parseInt(e.target.value) || 30))
                          })}
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          id="notifications"
                          checked={defaultSettings.notifications}
                          onChange={(e) => handleDefaultSettingsUpdate({ notifications: e.target.checked })}
                        />
                        <Label htmlFor="notifications">Activer les notifications par défaut</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          id="emailNotifications"
                          checked={defaultSettings.emailNotifications}
                          onChange={(e) => handleDefaultSettingsUpdate({ emailNotifications: e.target.checked })}
                        />
                        <Label htmlFor="emailNotifications">Activer les notifications par email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          id="twoFactorAuth"
                          checked={defaultSettings.twoFactorAuth}
                          onChange={(e) => handleDefaultSettingsUpdate({ twoFactorAuth: e.target.checked })}
                        />
                        <Label htmlFor="twoFactorAuth">Authentification à deux facteurs</Label>
                      </div>
                    </div>
                  </div>

                  {/* Gestion des rôles */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Rôles et permissions</h4>
                    <div className="space-y-4">
                      {userProfiles.roles.map((role) => (
                        <div key={role.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{role.name}</span>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditRole(role.id)}
                              >
                                <Settings className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                              {role.name !== "Admin" && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteRole(role.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                              <span 
                                key={permission}
                                className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                              >
                                {userProfiles.permissions.find(p => p.id === permission)?.description}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setEditingRole(null);
                          setNewRole({ name: '', permissions: [] });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un nouveau rôle
                      </Button>
                    </div>

                    {/* Modal d'édition de rôle */}
                    {(editingRole !== null || newRole.name !== '') && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                          <h3 className="text-lg font-semibold mb-4">
                            {editingRole !== null ? "Modifier le rôle" : "Nouveau rôle"}
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label>Nom du rôle</Label>
                              <Input
                                value={newRole.name}
                                onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Nom du rôle"
                              />
                            </div>
                            <div>
                              <Label>Permissions</Label>
                              <div className="mt-2 space-y-2">
                                {userProfiles.permissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={newRole.permissions.includes(permission.id)}
                                      onChange={() => handleTogglePermission(permission.id)}
                                    />
                                    <span>{permission.description}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingRole(null);
                                  setNewRole({ name: '', permissions: [] });
                                }}
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={handleSaveRole}
                                disabled={!newRole.name || newRole.permissions.length === 0}
                              >
                                Enregistrer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions en masse */}
                  <div>
                    <h4 className="font-medium mb-3">Actions en masse</h4>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        onClick={handleBulkPasswordReset}
                        disabled={selectedUsers.length === 0}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Réinitialiser les mots de passe
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setShowBulkEmailModal(true)}
                        disabled={selectedUsers.length === 0}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer un email groupé
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={handleBulkSettingsUpdate}
                        disabled={selectedUsers.length === 0}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Mettre à jour les paramètres
                      </Button>
                    </div>
                  </div>

                  {/* Liste des utilisateurs */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Utilisateurs ({users.length})</h3>
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div 
                          key={user.id} 
                          className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-sm text-gray-500">({user.department})</span>
                            </div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(user.lastActive).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs
                                ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-400 text-gray-700'}`}>
                                {user.status === 'active' ? 'Actif' : 'Inactif'}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs
                                ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {user.role}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user.id);
                                  setEditingProfile(true);
                                }}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(prev => [...prev, user.id]);
                                } else {
                                  setSelectedUsers(prev => prev.filter(id => id !== user.id));
                                }
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Liste des utilisateurs avec cases à cocher */}
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(prev => [...prev, user.id]);
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                          }
                        }}
                      />
                      {/* ... reste du contenu de l'utilisateur ... */}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Email Configuration Tab */}
            <TabsContent value="email" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Configuration SMTP */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Configuration SMTP</h3>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Tester la connexion
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Serveur SMTP</Label>
                        <Input 
                          value={smtpConfig.host}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                          placeholder="smtp.zeptomail.com"
                        />
                      </div>
                      <div>
                        <Label>Port</Label>
                        <Input 
                          value={smtpConfig.port}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                          placeholder="587"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nom d'utilisateur</Label>
                        <Input 
                          value={smtpConfig.username}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                          placeholder="emailapikey"
                        />
                      </div>
                      <div>
                        <Label>Mot de passe</Label>
                        <Input 
                          type="password"
                          value={smtpConfig.password}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email d'envoi</Label>
                      <Input 
                        type="email"
                        value={smtpConfig.fromEmail}
                        onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
                        placeholder="noreply@teamtalk.com"
                      />
                    </div>
                    <Button 
                      className="mt-4"
                      onClick={handleSMTPSave}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder la configuration
                    </Button>
                  </div>
                </div>

                {/* Paramètres avancés */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Paramètres avancés</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tentatives max.</Label>
                        <Input 
                          type="number"
                          value={emailSettings.maxRetries}
                          onChange={(e) => setEmailSettings({...emailSettings, maxRetries: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label>Délai (minutes)</Label>
                        <Input 
                          type="number"
                          value={emailSettings.retryDelay}
                          onChange={(e) => setEmailSettings({...emailSettings, retryDelay: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Taille max. pièces jointes (MB)</Label>
                      <Input 
                        type="number"
                        value={emailSettings.maxAttachmentSize}
                        onChange={(e) => setEmailSettings({...emailSettings, maxAttachmentSize: parseInt(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label>Types de fichiers autorisés</Label>
                      <Input 
                        placeholder=".pdf,.doc,.docx"
                        value={emailSettings.allowedFileTypes}
                        onChange={(e) => setEmailSettings({...emailSettings, allowedFileTypes: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Signature par défaut</Label>
                      <Textarea 
                        value={emailSettings.signature}
                        onChange={(e) => setEmailSettings({...emailSettings, signature: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleEmailSettingsSave} variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Sauvegarder les paramètres
                    </Button>
                  </div>
                </div>

                {/* Statistiques des emails */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Statistiques des emails</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Mail className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-sm text-gray-600">Envoyés</div>
                      <div className="text-2xl font-bold text-blue-600">{emailStats.sent}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
                      <div className="text-sm text-gray-600">Reçus</div>
                      <div className="text-2xl font-bold text-green-600">{emailStats.received}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <AlertCircle className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                      <div className="text-sm text-gray-600">Spam</div>
                      <div className="text-2xl font-bold text-yellow-600">{emailStats.spam}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <XCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                      <div className="text-sm text-gray-600">Échecs</div>
                      <div className="text-2xl font-bold text-red-600">{emailStats.failed}</div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Historique des emails */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Historique des envois</h3>
                  <div className="space-y-4">
                    {emailHistory.map((email) => (
                      <div 
                        key={email.id} 
                        className="flex items-center justify-between p-4 rounded-lg border bg-gray-50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{email.to}</span>
                            <span className="text-sm text-gray-500">({email.department})</span>
                          </div>
                          <div className="text-sm text-gray-600">{email.subject}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(email.date).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs
                              ${email.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          >
                            {email.status === 'delivered' ? 'Envoyé' : 'Échec'}
                          </span>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
