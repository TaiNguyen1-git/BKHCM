'use client';

import { useEffect } from 'react';
import { useSettings } from '@/app/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';

/**
 * Component to synchronize settings with theme
 * This component doesn't render anything, it just syncs the settings with the theme
 */
const ThemeSettingsSync = () => {
  const { settings } = useSettings();
  const { theme, toggleTheme } = useTheme();

  // Sync theme from settings to ThemeContext
  useEffect(() => {
    // Only sync if the theme is explicitly set (not 'system')
    if (settings.appearance.theme !== 'system') {
      // If current theme doesn't match settings theme, toggle it
      if ((settings.appearance.theme === 'dark' && theme === 'light') || 
          (settings.appearance.theme === 'light' && theme === 'dark')) {
        console.log(`Syncing theme from settings: ${settings.appearance.theme}`);
        toggleTheme();
      }
    }
  }, [settings.appearance.theme, theme, toggleTheme]);

  return null; // This component doesn't render anything
};

export default ThemeSettingsSync;
