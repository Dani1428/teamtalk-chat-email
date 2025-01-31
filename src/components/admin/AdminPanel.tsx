import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Mail, Settings, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { toast } = useToast();
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    fromEmail: ""
  });

  const handleSMTPSave = () => {
    // Logique pour sauvegarder la configuration SMTP
    toast({
      title: "Configuration SMTP sauvegardée",
      description: "Les paramètres ont été mis à jour avec succès."
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] rounded-lg bg-white shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Administration</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="flex space-x-4 border-b border-gray-200 pb-2">
            <TabsTrigger value="channels" className="text-lg font-medium text-gray-700">Canaux</TabsTrigger>
            <TabsTrigger value="users" className="text-lg font-medium text-gray-700">Utilisateurs</TabsTrigger>
            <TabsTrigger value="email" className="text-lg font-medium text-gray-700">Email</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="mt-4 space-y-6">
            <div>
              <Label>Nouveau canal</Label>
              <div className="flex space-x-2 mt-2">
                <Input placeholder="Nom du canal" className="flex-1" />
                <Button size="sm" className="flex-shrink-0">
                  <Plus className="w-4 h-4 mr-1" />
                  Créer
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4 space-y-6">
            <div>
              <Label>Inviter un utilisateur</Label>
              <div className="flex space-x-2 mt-2">
                <Input placeholder="Email" type="email" className="flex-1" />
                <Button size="sm" className="flex-shrink-0">Inviter</Button>
              </div>
            </div>

            <div>
              <Label>Utilisateurs</Label>
              <ScrollArea className="h-[200px] mt-2 border rounded-md p-4 bg-gray-50">
                <div className="space-y-2">
                  {["Sophie Martin", "Thomas Dubois", "Marie Lambert"].map((user) => (
                    <div key={user} className="flex items-center justify-between">
                      <span>{user}</span>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Configuration SMTP</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Serveur SMTP</Label>
                  <Input
                    placeholder="smtp.example.com"
                    value={smtpConfig.host}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Port</Label>
                  <Input
                    placeholder="587"
                    value={smtpConfig.port}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, port: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Nom d'utilisateur</Label>
                  <Input
                    placeholder="user@example.com"
                    value={smtpConfig.username}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, username: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Mot de passe</Label>
                  <Input
                    type="password"
                    value={smtpConfig.password}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, password: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Email d'envoi</Label>
                  <Input
                    placeholder="noreply@example.com"
                    value={smtpConfig.fromEmail}
                    onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleSMTPSave} className="mt-4 w-full">
                <Settings className="w-4 h-4 mr-2" />
                Sauvegarder la configuration
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Statistiques des emails</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Envoyés", "Reçus", "Spam", "Échecs"].map((title, idx) => (
                  <div key={title} className="bg-gray-100 p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">{title}</div>
                    <div className="text-2xl font-bold">1,234</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Historique des envois</h3>
              <ScrollArea className="h-[200px] w-full border rounded-md">
                <div className="p-4 space-y-4">
                  {[{ to: "client@example.com", status: "success", date: "2024-01-30 14:23" }, { to: "partner@example.com", status: "failed", date: "2024-01-30 13:15" }].map((email, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{email.to}</div>
                        <div className="text-sm text-gray-500">{email.date}</div>
                      </div>
                      <div className={`flex items-center ${email.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {email.status === 'success' ? 'Envoyé' : 'Échec'}
                        {email.status === 'failed' && <AlertCircle className="w-4 h-4 ml-1" />}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
