'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the settings interface
export interface SystemSettings {
  language: 'vi' | 'en';
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  bookingReminders: boolean;
  systemUpdates: boolean;
}

export interface SecuritySettings {
  sessionTimeout: number; // in minutes
  requireStrongPasswords: boolean;
  twoFactorAuth: boolean;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
}

export interface Settings {
  system: SystemSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
}

// Default settings
const defaultSettings: Settings = {
  system: {
    language: 'vi',
    timeFormat: '24h',
    dateFormat: 'DD/MM/YYYY',
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    systemUpdates: true,
  },
  security: {
    sessionTimeout: 30,
    requireStrongPasswords: true,
    twoFactorAuth: false,
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
    highContrast: false,
  },
};

// Define the context type
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateSystemSettings: (newSettings: Partial<SystemSettings>) => void;
  updateNotificationSettings: (newSettings: Partial<NotificationSettings>) => void;
  updateSecuritySettings: (newSettings: Partial<SecuritySettings>) => void;
  updateAppearanceSettings: (newSettings: Partial<AppearanceSettings>) => void;
  resetSettings: () => void;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Create the provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('adminSettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        console.log('Loaded settings from localStorage:', parsedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
        // If parsing fails, use default settings
        setSettings(defaultSettings);
      }
    } else {
      console.log('No stored settings found, using defaults');
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    console.log('Saving settings to localStorage:', settings);
    localStorage.setItem('adminSettings', JSON.stringify(settings));
  }, [settings]);

  // Update all settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    console.log('Updating all settings:', newSettings);
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  // Update system settings
  const updateSystemSettings = (newSystemSettings: Partial<SystemSettings>) => {
    console.log('Updating system settings:', newSystemSettings);
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        system: {
          ...prevSettings.system,
          ...newSystemSettings,
        },
      };
      console.log('New settings after system update:', updatedSettings);
      return updatedSettings;
    });
  };

  // Update notification settings
  const updateNotificationSettings = (newNotificationSettings: Partial<NotificationSettings>) => {
    console.log('Updating notification settings:', newNotificationSettings);
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        notifications: {
          ...prevSettings.notifications,
          ...newNotificationSettings,
        },
      };
      console.log('New settings after notification update:', updatedSettings);
      return updatedSettings;
    });
  };

  // Update security settings
  const updateSecuritySettings = (newSecuritySettings: Partial<SecuritySettings>) => {
    console.log('Updating security settings:', newSecuritySettings);
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        security: {
          ...prevSettings.security,
          ...newSecuritySettings,
        },
      };
      console.log('New settings after security update:', updatedSettings);
      return updatedSettings;
    });
  };

  // Update appearance settings
  const updateAppearanceSettings = (newAppearanceSettings: Partial<AppearanceSettings>) => {
    console.log('Updating appearance settings:', newAppearanceSettings);
    setSettings(prevSettings => {
      const updatedSettings = {
        ...prevSettings,
        appearance: {
          ...prevSettings.appearance,
          ...newAppearanceSettings,
        },
      };
      console.log('New settings after appearance update:', updatedSettings);
      return updatedSettings;
    });
  };

  // Reset settings to default
  const resetSettings = () => {
    console.log('Resetting settings to defaults');
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateSystemSettings,
        updateNotificationSettings,
        updateSecuritySettings,
        updateAppearanceSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Create a hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
