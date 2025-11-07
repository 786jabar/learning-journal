import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, TrendingUp, Users } from "lucide-react";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Learning Journal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Document your learning journey, track projects, and grow your knowledge — all in one beautiful, offline-first app.
          </p>
          <Button 
            size="lg" 
            onClick={handleLogin}
            className="text-lg px-8 py-6"
            data-testid="button-login"
          >
            Sign in with Replit
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover-elevate">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Journal Entries</CardTitle>
              <CardDescription>
                Write detailed journal entries with Markdown support, tags, and search functionality
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Project Management</CardTitle>
              <CardDescription>
                Track your projects, tech stack, and progress in an organized system
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Visualize your learning progress with beautiful charts and statistics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Multi-User Support</CardTitle>
              <CardDescription>
                Secure, personal workspace for each user with full data isolation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Offline-First Architecture</p>
                  <p className="text-sm text-muted-foreground">Works seamlessly without internet connection</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Markdown Editor</p>
                  <p className="text-sm text-muted-foreground">Rich text formatting with live preview</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Export Functionality</p>
                  <p className="text-sm text-muted-foreground">Download your data as JSON, Markdown, or PDF</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-5 w-5 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Beautiful themes for any lighting condition</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
