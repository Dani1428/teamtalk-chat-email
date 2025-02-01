import { useState, useCallback } from "react";
import { EmailArea } from "@/components/email/EmailArea";
import { EmailSidebar } from "@/components/email/EmailSidebar";
import type { Email } from "@/types";

export default function EmailPage() {
  const [currentFolder, setCurrentFolder] = useState<Email['folder']>("inbox");
  const [showCompose, setShowCompose] = useState(false);

  const handleShowComposeChange = useCallback((show: boolean) => {
    setShowCompose(show);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <EmailSidebar
        currentFolder={currentFolder}
        onFolderChange={setCurrentFolder}
        onComposeClick={() => handleShowComposeChange(true)}
      />
      <EmailArea
        currentFolder={currentFolder}
        showCompose={showCompose}
        onShowComposeChange={handleShowComposeChange}
      />
    </div>
  );
}
