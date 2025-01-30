import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X } from "lucide-react";

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Administration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label>Nouveau canal</Label>
            <div className="flex space-x-2 mt-2">
              <Input placeholder="Nom du canal" />
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Créer
              </Button>
            </div>
          </div>

          <div>
            <Label>Inviter un utilisateur</Label>
            <div className="flex space-x-2 mt-2">
              <Input placeholder="Email" type="email" />
              <Button size="sm">
                Inviter
              </Button>
            </div>
          </div>

          <div>
            <Label>Utilisateurs</Label>
            <ScrollArea className="h-[200px] mt-2 border rounded-md p-4">
              <div className="space-y-2">
                {["Sophie Martin", "Thomas Dubois", "Marie Lambert"].map((user) => (
                  <div key={user} className="flex items-center justify-between">
                    <span>{user}</span>
                    <Button variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;