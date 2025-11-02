'use client';

import { Logo } from './logo';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50 animate-fade-in">
      <div className="animate-pulse-once">
        <Logo />
      </div>
    </div>
  );
}
