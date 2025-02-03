import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeSnippetProps {
  code: string;
  language: string;
  fileName?: string;
}

export function CodeSnippet({ code, language, fileName }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Code copié',
        description: 'Le code a été copié dans le presse-papiers',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le code',
        variant: 'destructive',
      });
    }
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch(API_ROUTES.chat.runCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      if (!response.ok) throw new Error('Erreur d\'exécution du code');

      const { output } = await response.json();
      toast({
        title: 'Code exécuté',
        description: (
          <div className="mt-2 p-2 bg-secondary rounded">
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'exécuter le code',
        variant: 'destructive',
      });
    }
  };

  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.javascript,
    language
  );

  return (
    <div className="rounded-lg border bg-secondary overflow-hidden">
      {fileName && (
        <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {['javascript', 'python'].includes(language) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRunCode}
                className="text-sm"
              >
                Exécuter
              </Button>
            )}
          </div>
        </div>
      )}
      <ScrollArea className="max-h-[400px]">
        <pre className="p-4 overflow-x-auto">
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </ScrollArea>
    </div>
  );
}
