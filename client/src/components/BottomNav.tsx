import { Link, useLocation } from "wouter";
import { Home, Compass, Gamepad2, Palette, Menu } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/explore", label: "Explore", icon: Compass },
  { path: "/memory-game", label: "Game", icon: Gamepad2 },
  { path: "/canvas", label: "Canvas", icon: Palette },
  { path: "/menu", label: "More", icon: Menu },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t md:hidden safe-area-bottom" data-testid="nav-bottom">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto pb-safe">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div 
                className="flex flex-col items-center gap-1 px-3 py-1 cursor-pointer"
                data-testid={`button-bottom-nav-${item.label.toLowerCase()}`}
              >
                <div 
                  className={`p-2 rounded-full transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground scale-110" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span 
                  className={`text-xs font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
