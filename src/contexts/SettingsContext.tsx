import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

interface NotificationSettings {
  email: boolean;
  chat: boolean;
  calls: boolean;
  desktop: boolean;
  sound: boolean;
  soundVolume: number;
}

interface PrivacySettings {
  showOnlineStatus: boolean;
  showLastSeen: boolean;
  showReadReceipts: boolean;
  allowMessageForwarding: boolean;
}

interface EmailSettings {
  signature: string;
  defaultFont: string;
  defaultFontSize: number;
  autoSave: boolean;
  sendDelay: number;
  defaultReplyBehavior: 'reply' | 'replyAll';
}

interface ChatSettings {
  messageGrouping: boolean;
  showTimestamps: boolean;
  enterToSend: boolean;
  emojiStyle: 'native' | 'twemoji';
  autoDownloadMedia: boolean;
  messageAlignment: 'left' | 'right';
}

interface CallSettings {
  defaultMicDevice: string;
  defaultSpeakerDevice: string;
  defaultVideoDevice: string;
  noiseReduction: boolean;
  echoReduction: boolean;
  automaticGainControl: boolean;
  defaultVideoQuality: '720p' | '1080p';
}

interface LanguageSettings {
  locale: string;
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  firstDayOfWeek: 0 | 1;
}

export interface Settings {
  theme: ThemeSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  email: EmailSettings;
  chat: ChatSettings;
  calls: CallSettings;
  language: LanguageSettings;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (section: keyof Settings, values: Partial<Settings[keyof Settings]>) => void;
  resetSettings: (section: keyof Settings) => void;
}

const defaultSettings: Settings = {
  theme: {
    mode: 'system',
    primaryColor: '#0066cc',
    fontSize: 'medium',
  },
  notifications: {
    email: true,
    chat: true,
    calls: true,
    desktop: true,
    sound: true,
    soundVolume: 80,
  },
  privacy: {
    showOnlineStatus: true,
    showLastSeen: true,
    showReadReceipts: true,
    allowMessageForwarding: true,
  },
  email: {
    signature: '',
    defaultFont: 'Arial',
    defaultFontSize: 14,
    autoSave: true,
    sendDelay: 5,
    defaultReplyBehavior: 'reply',
  },
  chat: {
    messageGrouping: true,
    showTimestamps: true,
    enterToSend: true,
    emojiStyle: 'native',
    autoDownloadMedia: true,
    messageAlignment: 'right',
  },
  calls: {
    defaultMicDevice: '',
    defaultSpeakerDevice: '',
    defaultVideoDevice: '',
    noiseReduction: true,
    echoReduction: true,
    automaticGainControl: true,
    defaultVideoQuality: '720p',
  },
  language: {
    locale: 'fr-FR',
    timeFormat: '24h',
    dateFormat: 'DD/MM/YYYY',
    firstDayOfWeek: 1,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Appliquer les paramètres de thème
    document.documentElement.classList.toggle('dark', 
      settings.theme.mode === 'dark' || 
      (settings.theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    
    // Appliquer la taille de police
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }[settings.theme.fontSize];

    // Appliquer la couleur primaire
    document.documentElement.style.setProperty('--primary-color', settings.theme.primaryColor);

  }, [settings]);

  const updateSettings = (
    section: keyof Settings,
    values: Partial<Settings[keyof Settings]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...values,
      },
    }));

    // Émettre un événement personnalisé pour notifier les composants
    const event = new CustomEvent('settings-updated', {
      detail: { section, values },
    });
    window.dispatchEvent(event);
  };

  const resetSettings = (section: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [section]: defaultSettings[section],
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
