'use client';
import { InterviewSetup } from '@/components/interview/interview-setup';
import { Logo } from '@/components/logo';
import { Cpu, Bot, Laptop, User } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const { t } = useLanguage();
  const interviewTypes = [
    { name: t('softwareEngineer'), icon: <Cpu className="w-8 h-8" /> },
    { name: t('itEngineer'), icon: <Laptop className="w-8 h-8" /> },
    { name: t('12thStudent'), icon: <User className="w-8 h-8" /> },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <Logo />
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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground font-headline tracking-tight">
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
        © {new Date().getFullYear()} InterviewAce. {t('allRightsReserved')}
      </footer>
    </main>
  );
}
