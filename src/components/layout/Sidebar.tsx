import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Mail, Settings } from "lucide-react";

interface SidebarProps {
  currentChannel: string;
  setCurrentChannel: (channel: string) => void;
  openAdminPanel: () => void;
  currentView: "chat" | "email";
  setCurrentView: (view: "chat" | "email") => void;
}

const Sidebar = ({
  currentChannel,
  setCurrentChannel,
  openAdminPanel,
  currentView,
  setCurrentView,
}: SidebarProps) => {
  const channels = ["general", "marketing", "tech", "sales"];

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Entreprise Chat</h1>
      </div>
      
      <div className="p-2 border-b border-gray-700">
        <div className="flex space-x-2">
          <Button
            variant={currentView === "chat" ? "secondary" : "ghost"}
            className="flex-1"
            onClick={() => setCurrentView("chat")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
          <Button
            variant={currentView === "email" ? "secondary" : "ghost"}
            className="flex-1"
            onClick={() => setCurrentView("email")}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {currentView === "chat" && (
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-2 p-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Canaux
            </h2>
            {channels.map((channel) => (
              <Button
                key={channel}
                variant={currentChannel === channel ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentChannel(channel)}
              >
                # {channel}
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="p-4 border-t border-gray-700">
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
  );
};

export default Sidebar;