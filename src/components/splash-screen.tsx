'use client';

import { Bot } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 animate-fade-in">
      <div className="animate-pulse-once flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg flex items-center justify-center w-14 h-14">
            <Bot className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-sans">
            Interview Pro
          </h1>
        </div>
      </div>
      <p className="text-xs text-muted-foreground/80 mt-2">Made by Gaurav</p>
    </div>
  );
}
