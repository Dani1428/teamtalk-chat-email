import { Routes, Route } from "react-router-dom";
import { EmailArea } from "@/components/email/EmailArea";
import { ChatArea } from "@/components/layout/ChatArea";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AppRoutes() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Routes>
        <Route path="/email/*" element={<EmailArea />} />
        <Route path="/chat/:channel" element={<ChatArea channel="" />} />
      </Routes>
    </div>
  );
}
