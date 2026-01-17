import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, FolderKanban, BarChart3, Beaker, Trophy, 
  Gamepad2, Palette, User, Settings, Compass, Home,
  Sparkles
} from "lucide-react";

const menuSections = [
  {
    title: "Core Features",
    items: [
      { path: "/", label: "Home", icon: Home, description: "Dashboard overview" },
      { path: "/journal", label: "Journal", icon: BookOpen, description: "Learning entries" },
      { path: "/projects", label: "Projects", icon: FolderKanban, description: "Track your work" },
      { path: "/analytics", label: "Analytics", icon: BarChart3, description: "View statistics" },
    ]
  },
  {
    title: "Lab Demonstrations",
    items: [
      { path: "/lab3-demo", label: "Lab 3", icon: Beaker, description: "Local Storage" },
      { path: "/lab4-demo", label: "Lab 4", icon: Beaker, description: "IndexedDB" },
      { path: "/lab5-demo", label: "Lab 5", icon: Beaker, description: "Service Worker" },
      { path: "/lab6-demo", label: "Lab 6", icon: Beaker, description: "APIs" },
      { path: "/lab7-demo", label: "Lab 7", icon: Beaker, description: "PWA Features" },
    ]
  },
  {
    title: "Creative & Fun",
    items: [
      { path: "/memory-game", label: "Memory Game", icon: Gamepad2, description: "Celestial Memory" },
      { path: "/canvas", label: "Canvas", icon: Palette, description: "Creative drawing" },
      { path: "/explore", label: "Explore", icon: Compass, description: "Discover features" },
    ]
  },
  {
    title: "Profile & Settings",
    items: [
      { path: "/achievements", label: "Achievements", icon: Trophy, description: "Your progress" },
      { path: "/settings", label: "Settings", icon: Settings, description: "App preferences" },
      { path: "/about", label: "About", icon: User, description: "App information" },
    ]
  }
];

export default function MenuPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="text-menu-title">Menu</h1>
          <p className="text-muted-foreground">Navigate to any section of the app</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {menuSections.map((section) => (
            <Card key={section.title} className="overflow-hidden" data-testid={`card-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {section.items.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant="outline"
                        className="w-full h-auto py-4 flex flex-col items-center gap-2 hover-elevate"
                        data-testid={`button-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <item.icon className="h-6 w-6 text-primary" />
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
