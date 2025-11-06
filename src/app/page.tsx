'use client';
import { useState, useEffect } from 'react';
import { InterviewSetup } from '@/components/interview/interview-setup';
import { Cpu, Bot, Laptop, User } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { SplashScreen } from '@/components/splash-screen';
import { cn } from '@/lib/utils';

export default function Home() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show splash for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const interviewTypes = [
    { name: t('softwareEngineer'), icon: <Cpu className="w-8 h-8" /> },
    { name: t('itEngineer'), icon: <Laptop className="w-8 h-8" /> },
    { name: t('12thStudent'), icon: <User className="w-8 h-8" /> },
  ];

  if (loading) {
    return <SplashScreen />;
  }

  const welcomeFontClass =
    language === 'hi'
      ? 'font-hi'
      : language === 'mr'
      ? 'font-mr'
      : 'font-headline';

  return (
    <main className="flex flex-col min-h-screen bg-background p-4 sm:p-6 lg:p-8 animate-fade-in">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-sans">
            Interview Pro
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-primary text-primary-foreground p-4 rounded-full mb-6 shadow-lg">
              <Bot className="w-12 h-12" />
            </div>
            <h1
              className={cn(
                'text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight',
                welcomeFontClass
              )}
            >
              {t('welcome')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('appDescription')}
            </p>
          </div>
          <InterviewSetup predefinedTypes={interviewTypes} />
        </div>
      </div>
      <footer className="text-center p-4 mt-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} Interview Pro. {t('allRightsReserved')}
      </footer>
    </main>
  );
}
