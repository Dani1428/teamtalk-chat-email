import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatArea } from "@/components/layout/ChatArea";
import { EmailArea } from "@/components/email/EmailArea";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [currentChannel, setCurrentChannel] = useState("general");
  const [currentView, setCurrentView] = useState<"chat" | "email">("chat");
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex-none">
        <Sidebar
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
          openAdminPanel={() => navigate("/admin")}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        {currentView === "chat" ? (
          <ChatArea channel={currentChannel} />
        ) : (
          <EmailArea />
        )}
      </div>
    </div>
  );
};

export default Index;