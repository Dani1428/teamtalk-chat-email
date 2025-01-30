import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatArea from "@/components/layout/ChatArea";
import EmailArea from "@/components/email/EmailArea";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [currentChannel, setCurrentChannel] = useState("general");
  const [currentView, setCurrentView] = useState<"chat" | "email">("chat");
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
        openAdminPanel={() => navigate("/admin")}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      {currentView === "chat" ? (
        <ChatArea channel={currentChannel} />
      ) : (
        <EmailArea />
      )}
    </div>
  );
};

export default Index;