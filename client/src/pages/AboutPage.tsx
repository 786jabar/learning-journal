import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Zap, Shield, Cloud, Smartphone, Code } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Journal Entries",
      description: "Create rich journal entries with Markdown support to document your learning journey with formatting, code blocks, and more.",
    },
    {
      icon: Code,
      title: "Project Tracking",
      description: "Manage your learning projects, track technologies you're using, and showcase your portfolio of work.",
    },
    {
      icon: Zap,
      title: "Analytics Dashboard",
      description: "Visualize your progress with beautiful charts showing weekly activity, tag distribution, and learning streaks.",
    },
    {
      icon: Shield,
      title: "Offline First",
      description: "Your data is stored locally in IndexedDB. Work offline and sync automatically when you're back online.",
    },
    {
      icon: Cloud,
      title: "Auto Sync",
      description: "Changes are automatically synchronized when you reconnect to the internet, ensuring you never lose your work.",
    },
    {
      icon: Smartphone,
      title: "Progressive Web App",
      description: "Install on any device and use like a native app. Works on desktop, tablet, and mobile with a responsive design.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Learning Journal</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, offline-first progressive web app designed to help you track your learning journey, 
            document your progress, and reflect on your experiences.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>Built With Modern Technologies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "React 18",
                "TypeScript",
                "Vite",
                "Tailwind CSS",
                "ShadCN/UI",
                "React Query",
                "localforage",
                "vite-plugin-pwa",
                "Framer Motion",
                "Recharts",
                "React Markdown",
                "Wouter",
              ].map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center px-4 py-2 bg-accent rounded-md text-sm font-medium font-mono"
                >
                  {tech}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About This App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Learning Journal is designed with a focus on privacy, performance, and user experience. 
              All your data is stored locally on your device using IndexedDB, giving you full control 
              over your information.
            </p>
            <p>
              The app works completely offline, making it perfect for learning on the go. Whether you're 
              taking notes during a workshop, documenting a project, or reflecting on your learning journey, 
              Learning Journal is always available.
            </p>
            <p>
              Built as a Progressive Web App (PWA), it can be installed on any device and provides a 
              native app-like experience with fast loading times and smooth animations.
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm">
                <strong>Version:</strong> 1.0.0
                <br />
                <strong>License:</strong> MIT
                <br />
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
