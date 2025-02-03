import React, { useState, useEffect } from 'react';
import { Globe2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettings } from '@/contexts/SettingsContext';
import { API_ROUTES } from '@/config/api';

interface TranslationLayerProps {
  content: string;
  messageId: string;
}

const LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

export function TranslationLayer({ content, messageId }: TranslationLayerProps) {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('fr');
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();

  const translateContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ROUTES.chat.translate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          targetLanguage,
          messageId,
        }),
      });

      if (!response.ok) throw new Error('Erreur de traduction');

      const { translation } = await response.json();
      setTranslatedContent(translation);
      setIsTranslated(true);
    } catch (error) {
      console.error('Erreur de traduction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Traduction automatique si la langue est différente de la langue préférée
  useEffect(() => {
    if (settings.preferredLanguage && settings.preferredLanguage !== targetLanguage) {
      setTargetLanguage(settings.preferredLanguage);
      translateContent();
    }
  }, [settings.preferredLanguage]);

  if (!isTranslated) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <Globe2 className="h-4 w-4 text-muted-foreground" />
        <Select
          value={targetLanguage}
          onValueChange={setTargetLanguage}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          onClick={translateContent}
          disabled={isLoading}
        >
          {isLoading ? 'Traduction...' : 'Traduire'}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-1 text-sm text-muted-foreground">
      <div className="flex items-center gap-2 mb-1">
        <Check className="h-4 w-4 text-green-500" />
        <span>Traduit en {LANGUAGES.find(l => l.code === targetLanguage)?.name}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsTranslated(false)}
        >
          Voir l'original
        </Button>
      </div>
      {translatedContent}
    </div>
  );
}
