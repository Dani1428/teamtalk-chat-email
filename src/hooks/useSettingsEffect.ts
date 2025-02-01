import { useEffect } from 'react';
import { Settings } from '@/contexts/SettingsContext';

type SettingsSection = keyof Settings;

export function useSettingsEffect(
  section: SettingsSection,
  callback: (values: Partial<Settings[SettingsSection]>) => void
) {
  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent<{
      section: SettingsSection;
      values: Partial<Settings[SettingsSection]>;
    }>) => {
      if (event.detail.section === section) {
        callback(event.detail.values);
      }
    };

    // Écouter les changements de paramètres
    window.addEventListener('settings-updated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate as EventListener);
    };
  }, [section, callback]);
}
