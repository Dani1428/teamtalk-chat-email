import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatArea from "@/components/layout/ChatArea";
import EmailArea from "@/components/email/EmailArea";
import AdminPanel from "@/components/admin/AdminPanel";

const Index = () => {
  const [currentChannel, setCurrentChannel] = useState("general");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"chat" | "email">("chat");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        openAdminPanel={() => setIsAdminPanelOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      {currentView === "chat" ? (
        <ChatArea channel={currentChannel} />
      ) : (
        <EmailArea />
      )}
      {isAdminPanelOpen && (
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}
    </div>
  );
};

export default Index;