'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import en from '@/messages/en.json';
import mr from '@/messages/mr.json';
import hi from '@/messages/hi.json';

const translations: Record<string, any> = { en, mr, hi };

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState(translations.en);

  useEffect(() => {
    // On mount, try to get the language from localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      setMessages(translations[savedLanguage]);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguage(lang);
      setMessages(translations[lang]);
      // Save the language to localStorage
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string) => {
    // Simple key-based lookup
    const message = key
      .split('.')
      .reduce((obj, k) => (obj && obj[k] !== 'undefined' ? obj[k] : key), messages);
    return message;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
