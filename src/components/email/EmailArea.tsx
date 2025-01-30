import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";

const EmailArea = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi d'email à implémenter
    console.log("Email envoyé à:", to);
    setTo("");
    setSubject("");
    setContent("");
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold">Nouveau Message</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-4">
        <div>
          <Input
            type="email"
            placeholder="À:"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Objet:"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Textarea
            placeholder="Votre message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[200px] resize-none"
          />
        </div>
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" type="button">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4 mr-2" />
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmailArea;