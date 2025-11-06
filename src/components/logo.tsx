import { Bot } from 'lucide-react';
import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg">
        <Image src="/icons/icon-192x192.png" alt="Interview Pro Logo" width={24} height={24} />
      </div>
      <h1 className="text-2xl font-bold text-foreground font-headline tracking-tight">
        Interview Pro
      </h1>
    </div>
  );
}
