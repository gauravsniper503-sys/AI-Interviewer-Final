'use client';

import { Logo } from './logo';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50 animate-fade-in">
      <div className="animate-pulse-once text-center">
        <div className="inline-block">
          <Logo />
        </div>
        <p className="text-sm text-muted-foreground mt-2">Made by Gaurav</p>
      </div>
    </div>
  );
}
