import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Inbox, Archive, AlertOctagon, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const EmailArea = () => {
  const { toast } = useToast();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi d'email à implémenter
    toast({
      title: "Email envoyé",
      description: `Email envoyé à ${to}`,
    });
    setTo("");
    setSubject("");
    setContent("");
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <Tabs defaultValue="new" className="flex-1 flex flex-col">
        <div className="border-b border-gray-200">
          <TabsList className="w-full justify-start h-12">
            <TabsTrigger value="new" className="data-[state=active]:bg-gray-100">
              Nouveau Message
            </TabsTrigger>
            <TabsTrigger value="inbox" className="data-[state=active]:bg-gray-100">
              <Inbox className="w-4 h-4 mr-2" />
              Boîte de réception
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-gray-100">
              <Archive className="w-4 h-4 mr-2" />
              Envoyés
            </TabsTrigger>
            <TabsTrigger value="spam" className="data-[state=active]:bg-gray-100">
              <AlertOctagon className="w-4 h-4 mr-2" />
              Spam
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="new" className="flex-1 p-4">
          <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-4">
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
        </TabsContent>

        <TabsContent value="inbox" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {[
                { from: "Sophie Martin", subject: "Réunion demain", date: "14:23", unread: true },
                { from: "Thomas Dubois", subject: "Projet X", date: "13:15", unread: false },
                { from: "Marie Lambert", subject: "Documents", date: "Hier", unread: false },
              ].map((email, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    email.unread ? "bg-blue-50 hover:bg-blue-100" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className={`font-medium ${email.unread ? "font-semibold" : ""}`}>
                        {email.from}
                      </div>
                      <div className="text-sm text-gray-600">{email.subject}</div>
                    </div>
                    <div className="text-sm text-gray-500">{email.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="sent" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {[
                { to: "client@example.com", subject: "Proposition commerciale", date: "Hier" },
                { to: "team@example.com", subject: "Planning hebdomadaire", date: "28 Jan" },
              ].map((email, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{email.to}</div>
                      <div className="text-sm text-gray-600">{email.subject}</div>
                    </div>
                    <div className="text-sm text-gray-500">{email.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="spam" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {[
                { from: "unknown@spam.com", subject: "Offre spéciale !!!", date: "12:00" },
              ].map((email, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 bg-red-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{email.from}</div>
                      <div className="text-sm text-gray-600">{email.subject}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">{email.date}</div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailArea;