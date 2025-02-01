import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SettingsForm() {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <Tabs defaultValue="theme" className="w-full">
      <TabsList className="grid grid-cols-7 w-full">
        <TabsTrigger value="theme">Apparence</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="calls">Appels</TabsTrigger>
        <TabsTrigger value="language">Langue</TabsTrigger>
      </TabsList>

      {/* Apparence */}
      <TabsContent value="theme">
        <Card>
          <CardHeader>
            <CardTitle>Apparence</CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Thème</Label>
              <Select
                value={settings.theme.mode}
                onValueChange={(value: any) =>
                  updateSettings('theme', { mode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un thème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Taille de police</Label>
              <Select
                value={settings.theme.fontSize}
                onValueChange={(value: any) =>
                  updateSettings('theme', { fontSize: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petite</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Couleur principale</Label>
              <Input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) =>
                  updateSettings('theme', { primaryColor: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications */}
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {Object.entries(settings.notifications)
                .filter(([key]) => typeof settings.notifications[key as keyof typeof settings.notifications] === 'boolean')
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>{key}</Label>
                    <Switch
                      id={key}
                      checked={value as boolean}
                      onCheckedChange={(checked) =>
                        updateSettings('notifications', { [key]: checked })
                      }
                    />
                  </div>
                ))}
              
              <div className="space-y-2">
                <Label>Volume des notifications</Label>
                <Slider
                  value={[settings.notifications.soundVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) =>
                    updateSettings('notifications', { soundVolume: value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Confidentialité */}
      <TabsContent value="privacy">
        <Card>
          <CardHeader>
            <CardTitle>Confidentialité</CardTitle>
            <CardDescription>
              Gérez vos paramètres de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{key}</Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateSettings('privacy', { [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Email */}
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
              Configurez vos préférences d'email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Signature</Label>
              <Input
                value={settings.email.signature}
                onChange={(e) =>
                  updateSettings('email', { signature: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Police par défaut</Label>
              <Select
                value={settings.email.defaultFont}
                onValueChange={(value) =>
                  updateSettings('email', { defaultFont: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une police" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Calibri">Calibri</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoSave">Sauvegarde automatique</Label>
              <Switch
                id="autoSave"
                checked={settings.email.autoSave}
                onCheckedChange={(checked) =>
                  updateSettings('email', { autoSave: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Chat */}
      <TabsContent value="chat">
        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>
              Personnalisez votre expérience de chat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.chat)
              .filter(([key]) => typeof settings.chat[key as keyof typeof settings.chat] === 'boolean')
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{key}</Label>
                  <Switch
                    id={key}
                    checked={value as boolean}
                    onCheckedChange={(checked) =>
                      updateSettings('chat', { [key]: checked })
                    }
                  />
                </div>
              ))}

            <div className="space-y-2">
              <Label>Style d'emoji</Label>
              <Select
                value={settings.chat.emojiStyle}
                onValueChange={(value: any) =>
                  updateSettings('chat', { emojiStyle: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="native">Natif</SelectItem>
                  <SelectItem value="twemoji">Twemoji</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Appels */}
      <TabsContent value="calls">
        <Card>
          <CardHeader>
            <CardTitle>Appels</CardTitle>
            <CardDescription>
              Configurez vos paramètres d'appel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Qualité vidéo par défaut</Label>
              <Select
                value={settings.calls.defaultVideoQuality}
                onValueChange={(value: any) =>
                  updateSettings('calls', { defaultVideoQuality: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une qualité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {Object.entries(settings.calls)
              .filter(([key]) => typeof settings.calls[key as keyof typeof settings.calls] === 'boolean')
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{key}</Label>
                  <Switch
                    id={key}
                    checked={value as boolean}
                    onCheckedChange={(checked) =>
                      updateSettings('calls', { [key]: checked })
                    }
                  />
                </div>
              ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Langue */}
      <TabsContent value="language">
        <Card>
          <CardHeader>
            <CardTitle>Langue et région</CardTitle>
            <CardDescription>
              Configurez vos préférences régionales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Langue</Label>
              <Select
                value={settings.language.locale}
                onValueChange={(value) =>
                  updateSettings('language', { locale: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr-FR">Français</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format de l'heure</Label>
              <Select
                value={settings.language.timeFormat}
                onValueChange={(value: any) =>
                  updateSettings('language', { timeFormat: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 heures</SelectItem>
                  <SelectItem value="24h">24 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format de date</Label>
              <Select
                value={settings.language.dateFormat}
                onValueChange={(value: any) =>
                  updateSettings('language', { dateFormat: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          variant="outline"
          onClick={() => resetSettings(settings.theme.mode as any)}
        >
          Réinitialiser
        </Button>
        <Button onClick={() => window.location.reload()}>
          Appliquer les changements
        </Button>
      </div>
    </Tabs>
  );
}
