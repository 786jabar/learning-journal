import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { useOfflineStatus } from "@/hooks/useOfflineStatus";
import { Moon, Sun, BookOpen, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isOnline, isSyncing } = useOfflineStatus();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/journal", label: "Journal" },
    { path: "/projects", label: "Projects" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors" data-testid="link-home-logo">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Learning Journal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                  location === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section: Status & Theme Toggle */}
          <div className="flex items-center gap-3">
            {/* Offline Status Badge */}
            {isSyncing ? (
              <Badge variant="secondary" className="gap-1.5" data-testid="badge-syncing">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span className="text-xs">Syncing...</span>
              </Badge>
            ) : !isOnline ? (
              <Badge variant="secondary" className="gap-1.5" data-testid="badge-offline">
                <WifiOff className="h-3 w-3" />
                <span className="text-xs">Offline</span>
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1.5" data-testid="badge-online">
                <Wifi className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span className="text-xs">Online</span>
              </Badge>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors hover-elevate active-elevate-2 ${
                location === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
              data-testid={`link-nav-mobile-${item.label.toLowerCase()}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
