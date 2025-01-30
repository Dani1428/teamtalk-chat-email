import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Users, Settings } from "lucide-react";

interface SidebarProps {
  currentChannel: string;
  setCurrentChannel: (channel: string) => void;
  openAdminPanel: () => void;
}

const Sidebar = ({ currentChannel, setCurrentChannel, openAdminPanel }: SidebarProps) => {
  const channels = [
    { id: "general", name: "Général", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "marketing", name: "Marketing", icon: <Users className="w-4 h-4" /> },
    { id: "tech", name: "Technique", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col animate-slide-in">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">Enterprise Chat</h1>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 px-2 mb-2">Canaux</h2>
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant={currentChannel === channel.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => setCurrentChannel(channel.id)}
              >
                {channel.icon}
                <span className="ml-2">{channel.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={openAdminPanel}
        >
          <Settings className="w-4 h-4 mr-2" />
          Administration
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;