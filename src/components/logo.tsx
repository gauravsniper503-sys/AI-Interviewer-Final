import { Bot } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Bot className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-foreground font-headline tracking-tight">
        Interview Pro
      </h1>
    </div>
  );
}
