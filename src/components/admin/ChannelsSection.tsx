import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Settings,
  Users,
  Lock,
  Hash,
  Trash2,
  Edit,
  MessageSquare,
  Bell,
  Search
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  memberCount: number;
  messageCount: number;
  createdAt: string;
}

export function ChannelsSection() {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: "1",
      name: "general",
      description: "Canal général pour toutes les discussions",
      isPrivate: false,
      memberCount: 150,
      messageCount: 1234,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "annonces",
      description: "Annonces importantes de l'équipe",
      isPrivate: false,
      memberCount: 145,
      messageCount: 567,
      createdAt: "2024-01-02",
    },
    {
      id: "3",
      name: "projet-alpha",
      description: "Discussions sur le projet Alpha",
      isPrivate: true,
      memberCount: 45,
      messageCount: 890,
      createdAt: "2024-01-03",
    },
  ]);

  const [showNewChannel, setShowNewChannel] = useState(false);
  const [showEditChannel, setShowEditChannel] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">Gestion des canaux</h2>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {channels.length} canaux
          </div>
        </div>
        <Button onClick={() => setShowNewChannel(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau canal
        </Button>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="flex gap-4 max-w-3xl">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un canal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Membres</TableHead>
              <TableHead className="text-center">Messages</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels
              .filter(channel => 
                channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                channel.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((channel) => (
                <TableRow key={channel.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {channel.isPrivate ? (
                        <Lock className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Hash className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="font-medium">{channel.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {channel.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{channel.memberCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span>{channel.messageCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {channel.isPrivate ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Privé
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Public
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentChannel(channel);
                          setShowEditChannel(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Modal Nouveau Canal */}
      <Dialog open={showNewChannel} onOpenChange={setShowNewChannel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau canal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du canal</Label>
              <Input id="name" placeholder="ex: projet-beta" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Décrivez le but de ce canal..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Canal privé</Label>
                <div className="text-sm text-gray-500">
                  Seuls les membres invités peuvent rejoindre
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <div className="text-sm text-gray-500">
                  Activer les notifications par défaut
                </div>
              </div>
              <Switch />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewChannel(false)}>
              Annuler
            </Button>
            <Button>Créer le canal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Édition Canal */}
      <Dialog open={showEditChannel} onOpenChange={setShowEditChannel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le canal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom du canal</Label>
              <Input
                id="edit-name"
                value={currentChannel?.name}
                placeholder="ex: projet-beta"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={currentChannel?.description}
                placeholder="Décrivez le but de ce canal..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Canal privé</Label>
                <div className="text-sm text-gray-500">
                  Seuls les membres invités peuvent rejoindre
                </div>
              </div>
              <Switch checked={currentChannel?.isPrivate} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditChannel(false)}>
              Annuler
            </Button>
            <Button>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
