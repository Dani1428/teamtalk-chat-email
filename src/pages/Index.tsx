import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatArea from "@/components/layout/ChatArea";
import AdminPanel from "@/components/admin/AdminPanel";

const Index = () => {
  const [currentChannel, setCurrentChannel] = useState("general");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        openAdminPanel={() => setIsAdminPanelOpen(true)}
      />
      <ChatArea channel={currentChannel} />
      {isAdminPanelOpen && (
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}
    </div>
  );
};

export default Index;