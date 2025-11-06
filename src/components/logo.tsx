import { Bot } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg flex items-center justify-center w-14 h-14">
        <img
          src="/icons/icon-192x192.png"
          alt="Interview Pro"
          className="w-10 h-10"
        />
      </div>

      <h1 className="text-2xl font-bold text-foreground font-sans">
        Interview Pro
      </h1>
    </div>
  );
}
