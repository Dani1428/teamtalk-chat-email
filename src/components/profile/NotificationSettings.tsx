import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare, AtSign, Hash, Volume2 } from "lucide-react";

export function NotificationSettings() {
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6" />
          <div>
            <CardTitle>Paramètres de notification</CardTitle>
            <CardDescription>
              Gérez vos préférences de notification pour rester informé
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="channels" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="channels">Canaux</TabsTrigger>
            <TabsTrigger value="direct">Messages directs</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div className="space-y-1">
                    <Label>Notifications des canaux</Label>
                    <p className="text-sm text-gray-500">
                      Recevoir des notifications pour tous les messages dans les canaux
                    </p>
                  </div>
                </div>
                <Switch
                  checked={desktopNotifications}
                  onCheckedChange={setDesktopNotifications}
                />
              </div>

              <div className="space-y-2 pl-6">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Messages importants uniquement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Tous les messages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Fichiers partagés</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="direct" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <div className="space-y-1">
                    <Label>Messages directs</Label>
                    <p className="text-sm text-gray-500">
                      Notifications pour les messages privés
                    </p>
                  </div>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>

              <div className="space-y-4">
                <Label>Son de notification</Label>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-gray-500" />
                  <select className="flex-1 p-2 border rounded-md">
                    <option value="default">Son par défaut</option>
                    <option value="ping">Ping</option>
                    <option value="ding">Ding</option>
                    <option value="none">Aucun son</option>
                  </select>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mentions" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AtSign className="h-4 w-4 text-gray-500" />
                  <div className="space-y-1">
                    <Label>Mentions</Label>
                    <p className="text-sm text-gray-500">
                      Notifications lorsque quelqu'un vous mentionne
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="space-y-2 pl-6">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Mentions directes (@utilisateur)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Mentions de groupe (@everyone)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Réactions aux messages</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline">Réinitialiser</Button>
          <Button>Enregistrer les modifications</Button>
        </div>
      </CardContent>
    </Card>
  );
}
