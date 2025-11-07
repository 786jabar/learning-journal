import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            <span>using React, TypeScript & Vite</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} Learning Journal. All rights reserved.</span>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>Progressive Web App • Offline-First • Open Source</p>
        </div>
      </div>
    </footer>
  );
}
