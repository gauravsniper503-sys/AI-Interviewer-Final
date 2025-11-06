import { Bot } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="bg-primary text-primary-foreground p-2 rounded-lg flex items-center justify-center w-14 h-14">
        <img 
          src="/icons/icon-192x192.png" 
          alt="Interview Pro" 
          className="w-10 h-10"
          onError={(e) => {
            // Fallback for when the image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>';
            target.parentNode?.appendChild(fallback.firstChild!);
          }}
        />
      </div>

      <h1 className="text-2xl font-bold text-foreground font-sans">
        Interview Pro
      </h1>
    </div>
  );
}
