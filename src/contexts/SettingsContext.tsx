import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MatchSettings } from '../types';
import { mockMatchSettings } from '../data/mockData';

interface SettingsContextType {
  settings: MatchSettings;
  updateSettings: (newSettings: MatchSettings) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<MatchSettings>(mockMatchSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('scoremate_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.warn('Failed to load settings from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: MatchSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('scoremate_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};