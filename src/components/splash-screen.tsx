'use client';

import { Logo } from './logo';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 animate-fade-in">
      <div className="animate-pulse-once">
        <Logo />
      </div>
      <p className="text-xs text-muted-foreground/80 mt-2">Made by Gaurav</p>
    </div>
  );
}
