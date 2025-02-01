import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

export interface EmailTemplateType {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

interface EmailTemplateProps {
  templates: EmailTemplateType[];
  onSelect: (template: EmailTemplateType) => void;
  onSave: (template: EmailTemplateType) => void;
  onDelete: (id: string) => void;
}

export function EmailTemplate({
  templates,
  onSelect,
  onSave,
  onDelete,
}: EmailTemplateProps) {
  const [newTemplate, setNewTemplate] = React.useState<Partial<EmailTemplateType>>({
    name: '',
    subject: '',
    content: '',
    variables: [],
  });
  const [showDialog, setShowDialog] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<EmailTemplateType | null>(null);

  const handleSave = () => {
    if (editingTemplate) {
      onSave({ ...editingTemplate, ...newTemplate } as EmailTemplateType);
    } else {
      onSave({
        id: Date.now().toString(),
        ...newTemplate,
      } as EmailTemplateType);
    }
    setShowDialog(false);
    setNewTemplate({ name: '', subject: '', content: '', variables: [] });
    setEditingTemplate(null);
  };

  const handleEdit = (template: EmailTemplateType) => {
    setEditingTemplate(template);
    setNewTemplate(template);
    setShowDialog(true);
  };

  const handleAddVariable = () => {
    const variable = prompt('Enter variable name (without {}):');
    if (variable) {
      setNewTemplate(prev => ({
        ...prev,
        variables: [...(prev.variables || []), variable],
        content: prev.content + ` {${variable}}`,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
              <DialogDescription>
                Create reusable email templates with custom variables
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Template Name</label>
                <Input
                  value={newTemplate.name}
                  onChange={e =>
                    setNewTemplate(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={newTemplate.subject}
                  onChange={e =>
                    setNewTemplate(prev => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="Email subject"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Content</label>
                  <Button variant="outline" size="sm" onClick={handleAddVariable}>
                    Add Variable
                  </Button>
                </div>
                <Textarea
                  value={newTemplate.content}
                  onChange={e =>
                    setNewTemplate(prev => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Email content with {variables}"
                  className="min-h-[200px]"
                />
              </div>
              {newTemplate.variables && newTemplate.variables.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Variables</label>
                  <div className="flex flex-wrap gap-2">
                    {newTemplate.variables.map(variable => (
                      <div
                        key={variable}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-sm"
                      >
                        {`{${variable}}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription className="truncate">
                {template.subject}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                {template.content}
              </p>
              {template.variables.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.variables.map(variable => (
                    <span
                      key={variable}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 mt-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(template)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(template.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button onClick={() => onSelect(template)}>Use Template</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
