'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/messages/en.json';
import mr from '@/messages/mr.json';
import hi from '@/messages/hi.json';

const translations: Record<string, any> = { en, mr, hi };

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState(translations.en);

  useEffect(() => {
    setMessages(translations[language]);
  }, [language]);

  const t = (key: string) => {
    return messages[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
