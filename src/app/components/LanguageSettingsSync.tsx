'use client';

import { useEffect } from 'react';
import { useSettings } from '@/app/context/SettingsContext';

/**
 * Component to synchronize language settings with the HTML lang attribute
 * This component doesn't render anything, it just syncs the language setting
 */
const LanguageSettingsSync = () => {
  const { settings } = useSettings();

  // Sync language from settings to HTML lang attribute
  useEffect(() => {
    if (document && document.documentElement) {
      const currentLang = document.documentElement.lang;
      if (currentLang !== settings.system.language) {
        console.log(`Changing language from ${currentLang} to ${settings.system.language}`);
        document.documentElement.lang = settings.system.language;
      }
    }
  }, [settings.system.language]);

  return null; // This component doesn't render anything
};

export default LanguageSettingsSync;
