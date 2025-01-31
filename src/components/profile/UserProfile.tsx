import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/avatars/john-doe.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Profil Utilisateur</CardTitle>
              <CardDescription>Gérez vos informations personnelles et préférences</CardDescription>
            </div>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Informations</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  defaultValue="John Doe"
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  defaultValue="Développeur Senior"
                  disabled={!isEditing}
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button>Enregistrer</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input
                  id="current-password"
                  type="password"
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  disabled={!isEditing}
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button>Mettre à jour</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Langue</Label>
                <select className="w-full p-2 border rounded-md" disabled={!isEditing}>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Fuseau horaire</Label>
                <select className="w-full p-2 border rounded-md" disabled={!isEditing}>
                  <option value="UTC+1">Paris (UTC+1)</option>
                  <option value="UTC">Londres (UTC)</option>
                  <option value="UTC-5">New York (UTC-5)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Notifications par email</Label>
                <input
                  type="checkbox"
                  defaultChecked
                  disabled={!isEditing}
                  className="w-4 h-4"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button>Enregistrer</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
