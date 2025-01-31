import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  X, 
  Settings, 
  AlertCircle, 
  BarChart2, 
  CheckCircle, 
  XCircle,
  Mail,
  PieChart as PieChartIcon,
  RefreshCw,
  Save,
  MoreVertical
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Recharts imports for graph
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

  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    host: "",
    port: "",
    username: "",
    password: "",
    fromEmail: ""
  });

  const [emailStats, setEmailStats] = useState<EmailStats>({
    sent: 1234,
    received: 2567,
    spam: 45,
    failed: 23,
  });

  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Marketing", channels: ["général", "campagnes"] },
    { id: 2, name: "Développement", channels: ["général", "bugs", "features"] },
    { id: 3, name: "RH", channels: ["général", "recrutement"] },
  ]);

  const [newDepartment, setNewDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
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

  const handleSMTPSave = () => {
    toast({
      title: "Configuration SMTP sauvegardée",
      description: "Les paramètres ont été mis à jour avec succès.",
    });
  };

  const handleEmailSettingsSave = () => {
    toast({
      title: "Paramètres email sauvegardés",
      description: "Les paramètres ont été mis à jour avec succès."
    });
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      const newDept = {
        id: departments.length + 1,
        name: newDepartment.trim(),
        channels: ["général"]
      };
      setDepartments([...departments, newDept]);
      setNewDepartment("");
      toast({
        title: "Département ajouté",
        description: `Le département ${newDepartment} a été créé avec succès.`
      });
    }
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    toast({
      title: "Département supprimé",
      description: "Le département a été supprimé avec succès."
    });
  };

  const handleAddChannel = () => {
    if (selectedDepartment && newChannel.trim()) {
      setDepartments(departments.map(dept => {
        if (dept.id === selectedDepartment) {
          return {
            ...dept,
            channels: [...dept.channels, newChannel.trim()]
          };
        }
        return dept;
      }));
      setNewChannel("");
      toast({
        title: "Canal ajouté",
        description: `Le canal ${newChannel} a été ajouté avec succès.`
      });
    }
  };

  const handleDeleteChannel = (deptId: number, channel: string) => {
    setDepartments(departments.map(dept => {
      if (dept.id === deptId) {
        return {
          ...dept,
          channels: dept.channels.filter(ch => ch !== channel)
        };
      }
      return dept;
    }));
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
                          value={userProfiles.defaultSettings.language}
                          onChange={(e) => setUserProfiles({
                            ...userProfiles,
                            defaultSettings: { ...userProfiles.defaultSettings, language: e.target.value }
                          })}
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
                          value={userProfiles.defaultSettings.theme}
                          onChange={(e) => setUserProfiles({
                            ...userProfiles,
                            defaultSettings: { ...userProfiles.defaultSettings, theme: e.target.value }
                          })}
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
                          value={userProfiles.defaultSettings.sessionTimeout}
                          onChange={(e) => setUserProfiles({
                            ...userProfiles,
                            defaultSettings: { ...userProfiles.defaultSettings, sessionTimeout: parseInt(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          checked={userProfiles.defaultSettings.notifications}
                          onChange={(e) => setUserProfiles({
                            ...userProfiles,
                            defaultSettings: { ...userProfiles.defaultSettings, notifications: e.target.checked }
                          })}
                        />
                        <Label>Activer les notifications par défaut</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          checked={userProfiles.defaultSettings.emailNotifications}
                          onChange={(e) => setUserProfiles({
                            ...userProfiles,
                            defaultSettings: { ...userProfiles.defaultSettings, emailNotifications: e.target.checked }
                          })}
                        />
                        <Label>Activer les notifications par email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          checked={userProfiles.defaultSettings.twoFactorAuth}
                          onChange={(e) => setUserProfiles({
                            ...userProfiles,
                            defaultSettings: { ...userProfiles.defaultSettings, twoFactorAuth: e.target.checked }
                          })}
                        />
                        <Label>Authentification à deux facteurs</Label>
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
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-1" />
                                Modifier
                              </Button>
                              {role.name !== "Admin" && (
                                <Button variant="destructive" size="sm">
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
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un nouveau rôle
                      </Button>
                    </div>
                  </div>

                  {/* Actions en masse */}
                  <div>
                    <h4 className="font-medium mb-3">Actions en masse</h4>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Réinitialiser les mots de passe
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer un email groupé
                      </Button>
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Mettre à jour les paramètres
                      </Button>
                    </div>
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
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img className="w-10 h-10 rounded-full" src={user.avatar} />
                            <div 
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                                ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}
                            />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs
                              ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                              {user.role}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                              {user.department}
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
                        </div>
                      </div>
                    ))}
                  </div>
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
                          placeholder="smtp.example.com"
                          value={smtpConfig.host}
                          onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Port</Label>
                        <Input 
                          placeholder="587"
                          value={smtpConfig.port}
                          onChange={(e) => setSmtpConfig({...smtpConfig, port: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nom d'utilisateur</Label>
                        <Input 
                          placeholder="user@example.com"
                          value={smtpConfig.username}
                          onChange={(e) => setSmtpConfig({...smtpConfig, username: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Mot de passe</Label>
                        <Input 
                          type="password"
                          value={smtpConfig.password}
                          onChange={(e) => setSmtpConfig({...smtpConfig, password: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email d'envoi</Label>
                      <Input 
                        placeholder="noreply@example.com"
                        value={smtpConfig.fromEmail}
                        onChange={(e) => setSmtpConfig({...smtpConfig, fromEmail: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleSMTPSave} className="w-full">
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
