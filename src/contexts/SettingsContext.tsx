import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { lightColors, darkColors, ColorsType } from '../theme/colors';
import { translations, TranslationKey } from '../i18n';

type Language = 'lt' | 'en';
type Theme = 'light' | 'dark' | 'system';

interface SettingsContextType {
  language: Language;
  theme: Theme;
  colors: ColorsType;
  t: (key: TranslationKey) => string;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>('lt');
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('app_theme');
        if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') {
          setThemeState(savedTheme as Theme);
        }
      } catch (e) {
        console.log('Failed to load settings', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadSettings();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await SecureStore.setItemAsync('app_language', lang);
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await SecureStore.setItemAsync('app_theme', newTheme);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const activeTheme = theme === 'system' ? (systemColorScheme || 'light') : theme;
  const currentColors = activeTheme === 'dark' ? darkColors : lightColors;

  if (!isLoaded) return null;

  return (
    <SettingsContext.Provider value={{ language, theme, colors: currentColors, t, setLanguage, setTheme }}>
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
