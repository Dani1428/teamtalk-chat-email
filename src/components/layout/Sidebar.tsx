import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  MessageSquare, 
  Mail, 
  Settings,
  User,
  Bell,
  Moon,
  LogOut,
  Edit,
  Trash,
  Menu
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DirectMessages } from "@/components/chat/DirectMessages";
import { UserProfile } from "@/components/profile/UserProfile";
import { UserSettings } from "@/components/profile/UserSettings";
import { NotificationSettings } from "@/components/profile/NotificationSettings";

interface Channel {
  id: string;
  name: string;
  unreadCount?: number;
  type: "text" | "voice" | "announcement";
  category: string;
}

const MOCK_CHANNELS: Channel[] = [
  { id: "1", name: "général", type: "text", category: "Général" },
  { id: "2", name: "annonces", type: "announcement", category: "Général" },
  { id: "3", name: "développement", type: "text", category: "Projets" },
  { id: "4", name: "design", type: "text", category: "Projets" },
  { id: "5", name: "marketing", type: "text", category: "Projets" },
  { id: "6", name: "salle-de-réunion", type: "voice", category: "Vocal" },
  { id: "7", name: "café", type: "voice", category: "Vocal" },
];

interface SidebarProps {
  currentChannel: string;
  setCurrentChannel: (channel: string) => void;
  currentView: "chat" | "email";
  setCurrentView: (view: "chat" | "email") => void;
  openAdminPanel: () => void;
}

export function Sidebar({ currentChannel, setCurrentChannel, currentView, setCurrentView, openAdminPanel }: SidebarProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const categories = Array.from(new Set(MOCK_CHANNELS.map((channel) => channel.category)));

  const SidebarContent = () => (
    <div className="pb-12 w-full">
      <div className="space-y-4 py-4">
        {/* Onglets Chat/Email */}
        <div className="px-3 py-2">
          <Tabs value={currentView} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                value="chat"
                onClick={() => setCurrentView("chat")}
                className="flex-1"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="email"
                onClick={() => setCurrentView("email")}
                className="flex-1"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {currentView === "chat" && (
          <>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Rechercher...
                </Button>
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Canaux</h2>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category} className="space-y-2">
                    <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {category}
                    </h3>
                    {MOCK_CHANNELS
                      .filter((channel) => channel.category === category)
                      .map((channel) => (
                        <Button
                          key={channel.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2 px-2 font-normal text-sm",
                            "hover:bg-gray-100 hover:text-gray-900",
                            "focus:bg-gray-100 focus:text-gray-900",
                            "data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900",
                            "truncate",
                            channel.type === "text" && "text-gray-700",
                            channel.type === "voice" && "text-emerald-600",
                            channel.type === "announcement" && "text-amber-600"
                          )}
                        >
                          <span className="flex-1 truncate">
                            # {channel.name}
                          </span>
                          {channel.unreadCount && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
                              {channel.unreadCount}
                            </span>
                          )}
                        </Button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Messages directs</h2>
              <div className="space-y-1">
                <DirectMessages
                  onSelectUser={(userId) => setCurrentChannel(`dm-${userId}`)}
                  selectedUserId={currentChannel.startsWith('dm-') ? currentChannel.slice(3) : undefined}
                />
              </div>
            </div>
          </>
        )}

        {currentView === "email" && (
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Rechercher des emails...
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentChannel("inbox")}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Boîte de réception
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentChannel("sent")}>
                <Mail className="mr-2 h-4 w-4" />
                Messages envoyés
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentChannel("drafts")}>
                <Edit className="mr-2 h-4 w-4" />
                Brouillons
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => setCurrentChannel("trash")}>
                <Trash className="mr-2 h-4 w-4" />
                Corbeille
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Version mobile */}
      <div className="lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:w-[350px] p-0">
            <ScrollArea className="h-full">
              <SidebarContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Version desktop */}
      <div className="hidden lg:block">
        <div className="flex flex-col h-full w-full max-w-[280px] min-w-[250px] bg-gray-50 border-r border-gray-200">
          {/* En-tête avec recherche */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-8 bg-gray-50 border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Zone de défilement pour les canaux */}
          <ScrollArea className="flex-1 py-2">
            <SidebarContent />
          </ScrollArea>

          {/* Pied avec profil utilisateur */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 truncate hidden sm:block">
                  john.doe@example.com
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 relative"
                  >
                    <span className="sr-only">Menu utilisateur</span>
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white shadow-lg border border-gray-100"
                  style={{
                    position: 'fixed',
                    zIndex: 1000,
                    marginTop: '0.5rem',
                    marginRight: '0.5rem'
                  }}
                >
                  <DropdownMenuItem 
                    className="flex items-center hover:bg-gray-50"
                    onClick={() => setShowProfile(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center hover:bg-gray-50"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center hover:bg-gray-50"
                    onClick={() => setShowNotifications(true)}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center hover:bg-gray-50">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Mode sombre</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center hover:bg-gray-50 text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-2 border-t space-y-2">
            <Button
              variant={currentView === "chat" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentView("chat")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button
              variant={currentView === "email" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentView("email")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={openAdminPanel}
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogues pour les différentes sections */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl">
          <UserProfile />
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl">
          <UserSettings />
        </DialogContent>
      </Dialog>

      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-4xl">
          <NotificationSettings />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Sidebar;