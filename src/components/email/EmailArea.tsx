import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Search,
  Plus,
  Mail,
  Archive,
  AlertCircle,
  Trash2,
  Send,
  Inbox,
  Paperclip,
  Save
} from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  priority?: "low" | "normal" | "high";
  attachments?: { name: string; size: number }[];
}

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export function EmailArea() {
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("inbox");

  const inboxEmails: Email[] = [
    { id: "inbox-1", from: "John Doe", subject: "Hello", preview: "This is a test email", date: "2024-01-31" },
    { id: "inbox-2", from: "Jane Doe", subject: "Hello again", preview: "This is another test email", date: "2024-01-30" },
  ];

  const sentEmails: Email[] = [
    { id: "sent-1", from: "Me", subject: "Re: Project Update", preview: "Here's the latest update...", date: "2024-01-29" },
    { id: "sent-2", from: "Me", subject: "Meeting Notes", preview: "Notes from today's meeting...", date: "2024-01-28" },
  ];

  const archivedEmails: Email[] = [
    { id: "archived-1", from: "Alice Smith", subject: "Old Project", preview: "Archived project details...", date: "2024-01-15" },
    { id: "archived-2", from: "Bob Johnson", subject: "Past Meeting", preview: "Notes from last month...", date: "2024-01-10" },
  ];

  const spamEmails: Email[] = [
    { id: "spam-1", from: "Unknown", subject: "Special Offer", preview: "You've won...", date: "2024-01-31", priority: "low" },
    { id: "spam-2", from: "Marketing", subject: "Limited Time", preview: "Don't miss out...", date: "2024-01-30", priority: "low" },
  ];

  const trashEmails: Email[] = [
    { id: "trash-1", from: "Deleted", subject: "Removed Item", preview: "This message was deleted...", date: "2024-01-20" },
    { id: "trash-2", from: "Removed", subject: "Deleted Message", preview: "This email was removed...", date: "2024-01-19" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-4 border-b bg-white">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => setShowCompose(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau message
          </Button>

          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="inbox" value={currentTab} className="flex-1 flex flex-col">
        <div className="flex-none border-b bg-white">
          <TabsList className="w-full justify-start p-1">
            <TabsTrigger 
              value="inbox" 
              onClick={() => setCurrentTab("inbox")}
              className="flex gap-2"
            >
              <Inbox className="h-4 w-4" />
              Boîte de réception
            </TabsTrigger>
            <TabsTrigger 
              value="sent" 
              onClick={() => setCurrentTab("sent")}
              className="flex gap-2"
            >
              <Send className="h-4 w-4" />
              Envoyés
            </TabsTrigger>
            <TabsTrigger 
              value="archived" 
              onClick={() => setCurrentTab("archived")}
              className="flex gap-2"
            >
              <Archive className="h-4 w-4" />
              Archivés
            </TabsTrigger>
            <TabsTrigger 
              value="spam" 
              onClick={() => setCurrentTab("spam")}
              className="flex gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              Spam
            </TabsTrigger>
            <TabsTrigger 
              value="trash" 
              onClick={() => setCurrentTab("trash")}
              className="flex gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Corbeille
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="inbox" className="h-full m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {inboxEmails.map((email) => (
                  <EmailItem
                    key={email.id}
                    email={email}
                    isSelected={selectedEmails.includes(email.id)}
                    onSelect={(checked) => {
                      if (checked) {
                        setSelectedEmails([...selectedEmails, email.id]);
                      } else {
                        setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                      }
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="sent" className="h-full m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {sentEmails.map((email) => (
                  <EmailItem
                    key={email.id}
                    email={email}
                    isSelected={selectedEmails.includes(email.id)}
                    onSelect={(checked) => {
                      if (checked) {
                        setSelectedEmails([...selectedEmails, email.id]);
                      } else {
                        setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                      }
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="archived" className="h-full m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {archivedEmails.map((email) => (
                  <EmailItem
                    key={email.id}
                    email={email}
                    isSelected={selectedEmails.includes(email.id)}
                    onSelect={(checked) => {
                      if (checked) {
                        setSelectedEmails([...selectedEmails, email.id]);
                      } else {
                        setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                      }
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="spam" className="h-full m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {spamEmails.map((email) => (
                  <EmailItem
                    key={email.id}
                    email={email}
                    isSelected={selectedEmails.includes(email.id)}
                    onSelect={(checked) => {
                      if (checked) {
                        setSelectedEmails([...selectedEmails, email.id]);
                      } else {
                        setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                      }
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="trash" className="h-full m-0 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {trashEmails.map((email) => (
                  <EmailItem
                    key={email.id}
                    email={email}
                    isSelected={selectedEmails.includes(email.id)}
                    onSelect={(checked) => {
                      if (checked) {
                        setSelectedEmails([...selectedEmails, email.id]);
                      } else {
                        setSelectedEmails(selectedEmails.filter(id => id !== email.id));
                      }
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>

      {/* Actions sur les emails sélectionnés */}
      {selectedEmails.length > 0 && (
        <div className="flex-none p-2 border-t bg-white">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archiver
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Marquer comme lu
            </Button>
          </div>
        </div>
      )}

      {/* Modal de composition */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Nouveau message</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto p-4">
            <Input placeholder="À" />
            <Input placeholder="Objet" />
            <Textarea
              placeholder="Votre message..."
              className="flex-1 min-h-[200px]"
            />
          </div>

          <div className="flex justify-between items-center p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Joindre
              </Button>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Brouillon
              </Button>
            </div>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmailItem({ email, isSelected, onSelect }: EmailItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-3 bg-white rounded-lg border transition-colors",
        isSelected && "border-blue-500 bg-blue-50"
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onSelect}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{email.from}</span>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {format(new Date(email.date), "dd MMM yyyy")}
          </span>
        </div>
        
        <h3 className="font-medium text-gray-900 truncate">
          {email.subject}
        </h3>
        
        <p className="text-sm text-gray-500 line-clamp-1">
          {email.preview}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-none">
        {email.attachments && email.attachments.length > 0 && (
          <Paperclip className="h-4 w-4 text-gray-400" />
        )}
        {email.priority === "high" && (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
      </div>
    </div>
  );
}