import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Star, Rocket, Compass, Lightbulb, Target,
  BookOpen, Trophy, Gamepad2, Palette, Code, Zap,
  Heart, Gift, Crown, Flame
} from "lucide-react";

const featuredItems = [
  {
    title: "Celestial Memory",
    description: "A beautiful space-themed memory game with achievements and progression",
    path: "/memory-game",
    icon: Gamepad2,
    badge: "Mini Project",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
  },
  {
    title: "Creative Canvas",
    description: "Professional drawing tools with shapes, colors, and gallery",
    path: "/canvas",
    icon: Palette,
    badge: "New",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
  },
  {
    title: "Learning Journal",
    description: "Track your learning journey with entries and tags",
    path: "/journal",
    icon: BookOpen,
    badge: "Core",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
  },
  {
    title: "Achievements",
    description: "Earn badges and track your progress across the app",
    path: "/achievements",
    icon: Trophy,
    badge: "Gamified",
    gradient: "from-yellow-500 via-orange-500 to-red-500",
  },
];

const quickLinks = [
  { path: "/lab3-demo", label: "Local Storage Demo", icon: Code },
  { path: "/lab4-demo", label: "IndexedDB Demo", icon: Code },
  { path: "/lab5-demo", label: "Service Worker Demo", icon: Code },
  { path: "/lab6-demo", label: "API Integration Demo", icon: Code },
  { path: "/lab7-demo", label: "PWA Features Demo", icon: Code },
  { path: "/portfolio", label: "Academic Portfolio", icon: Target },
  { path: "/analytics", label: "Analytics Dashboard", icon: Zap },
  { path: "/projects", label: "Project Tracker", icon: Rocket },
];

const tips = [
  { icon: Lightbulb, text: "Add journal entries regularly to track your learning progress" },
  { icon: Star, text: "Complete achievements in the Memory Game to unlock special rewards" },
  { icon: Heart, text: "Your data syncs automatically when you're back online" },
  { icon: Gift, text: "Export your portfolio as a PDF for academic submissions" },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Compass className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="text-explore-title">Explore</h1>
          <p className="text-muted-foreground text-lg">Discover all the features this app has to offer</p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Featured
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Card className="overflow-hidden hover-elevate cursor-pointer h-full" data-testid={`card-featured-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${item.gradient}`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardDescription className="mt-1">{item.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">{item.badge}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card data-testid="card-quick-links">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Quick Links
              </CardTitle>
              <CardDescription>Jump to any section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    <Button variant="ghost" className="w-full justify-start gap-2 h-auto py-2" data-testid={`button-quick-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <link.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{link.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-tips">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Pro Tips
              </CardTitle>
              <CardDescription>Get the most out of the app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                    <tip.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm">{tip.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" data-testid="card-cta">
          <CardContent className="py-8 text-center">
            <Flame className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
            <p className="text-muted-foreground mb-4">Begin your learning journey today</p>
            <div className="flex justify-center gap-4">
              <Link href="/journal">
                <Button className="gap-2" data-testid="button-start-journal">
                  <BookOpen className="h-4 w-4" />
                  Start Journaling
                </Button>
              </Link>
              <Link href="/memory-game">
                <Button variant="outline" className="gap-2" data-testid="button-play-game">
                  <Gamepad2 className="h-4 w-4" />
                  Play Memory Game
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
