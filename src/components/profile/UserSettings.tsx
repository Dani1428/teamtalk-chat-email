import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UserSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Paramètres</CardTitle>
        <CardDescription>
          Personnalisez votre expérience TeamTalk Sphere
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Mode sombre</Label>
                  <p className="text-sm text-gray-500">
                    Activer le thème sombre pour réduire la fatigue oculaire
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="space-y-4">
                <Label>Taille de la police</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{fontSize}px</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Mode compact</Label>
                  <p className="text-sm text-gray-500">
                    Réduire l'espacement entre les éléments
                  </p>
                </div>
                <Switch
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sons de notification</Label>
                  <p className="text-sm text-gray-500">
                    Jouer un son lors de la réception d'un message
                  </p>
                </div>
                <Switch
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
              </div>

              <div className="space-y-4">
                <Label>Volume des notifications</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="50"
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">50%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notifications par email</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Messages directs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Mentions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm">Tous les messages</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Statut en ligne</Label>
                  <p className="text-sm text-gray-500">
                    Afficher votre statut aux autres utilisateurs
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Lecture automatique des médias</Label>
                  <p className="text-sm text-gray-500">
                    Lire automatiquement les vidéos et les GIFs
                  </p>
                </div>
                <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
              </div>

              <div className="space-y-2">
                <Label>Qui peut me contacter ?</Label>
                <select className="w-full p-2 border rounded-md">
                  <option value="everyone">Tout le monde</option>
                  <option value="team">Mon équipe uniquement</option>
                  <option value="contacts">Mes contacts uniquement</option>
                </select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
