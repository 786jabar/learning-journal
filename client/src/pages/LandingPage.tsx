import { SignInButton } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, TrendingUp, Users, Zap, Shield, Cloud, CheckCircle2, Sparkles, ArrowRight, Download, Lock } from "lucide-react";
import { SiGoogle, SiGithub, SiX, SiApple } from "react-icons/si";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto px-4 py-20 sm:py-28">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <Badge className="mb-6 gap-1" variant="secondary" data-testid="badge-pwa">
              <Sparkles className="h-3 w-3" />
              Progressive Web App
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight" data-testid="heading-main">
              Your Learning Journey,
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Beautifully Documented</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-12 leading-relaxed" data-testid="text-description">
              Track your learning progress with journal entries, manage projects, and visualize your growth — 
              all while working seamlessly offline.
            </p>

            {/* Login Buttons using Clerk */}
            <div className="max-w-md w-full space-y-3 mb-8">
              <p className="text-sm text-muted-foreground mb-6" data-testid="text-signin-prompt">
                Get started in seconds with your account
              </p>
              
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="w-full text-base gap-3 bg-white dark:bg-white text-gray-900 dark:text-gray-900 border border-gray-300 dark:border-gray-300"
                  data-testid="button-login-google"
                >
                  <SiGoogle className="h-5 w-5" />
                  Continue with Google
                </Button>
              </SignInButton>
              
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="w-full text-base gap-3 bg-[#24292e] dark:bg-[#24292e] text-white border border-[#24292e]"
                  data-testid="button-login-github"
                >
                  <SiGithub className="h-5 w-5" />
                  Continue with GitHub
                </Button>
              </SignInButton>
              
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="w-full text-base gap-3 bg-black dark:bg-black text-white border border-black"
                  data-testid="button-login-x"
                >
                  <SiX className="h-5 w-5" />
                  Continue with X
                </Button>
              </SignInButton>
              
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="w-full text-base gap-3 bg-black dark:bg-black text-white border border-black"
                  data-testid="button-login-apple"
                >
                  <SiApple className="h-5 w-5" />
                  Continue with Apple
                </Button>
              </SignInButton>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-primary" />
                <span>Works Offline</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="heading-features">
              Everything You Need to Learn Better
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A powerful set of features designed to help you document, organize, and analyze your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate" data-testid="card-feature-journal">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Rich Journal Entries</CardTitle>
                <CardDescription>
                  Write detailed entries with full Markdown support, code blocks, and rich formatting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-projects">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Project Tracking</CardTitle>
                <CardDescription>
                  Manage your learning projects with tech stack tracking and progress monitoring
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-analytics">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Visual Analytics</CardTitle>
                <CardDescription>
                  Beautiful charts and graphs to visualize your learning patterns and progress
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover-elevate" data-testid="card-feature-multiuser">
              <CardHeader>
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Personal Workspace</CardTitle>
                <CardDescription>
                  Your own secure, private space with complete data isolation from other users
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Choose Learning Journal?
              </h2>
              <p className="text-lg text-muted-foreground">
                Built with modern web technologies for the best learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Cloud className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Offline-First Architecture</h3>
                  <p className="text-muted-foreground">
                    Continue working even without internet. Your data is stored locally and syncs automatically when you're back online.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Private & Secure</h3>
                  <p className="text-muted-foreground">
                    Your data is completely isolated. Each user has their own secure workspace with encrypted sessions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Markdown Support</h3>
                  <p className="text-muted-foreground">
                    Write with full Markdown formatting, including code blocks, tables, lists, and more with live preview.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Export Your Data</h3>
                  <p className="text-muted-foreground">
                    Own your content. Export journal entries and projects as JSON, Markdown, or PDF anytime.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Beautiful Dark Mode</h3>
                  <p className="text-muted-foreground">
                    Seamlessly switch between light and dark themes. Your preference is saved and synced across devices.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
                  <p className="text-muted-foreground">
                    Visualize your learning journey with charts, statistics, and insights about your study patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2" data-testid="card-cta">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Start Your Learning Journal Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join learners who are documenting their journey and tracking their progress. 
                Get started in seconds with your preferred account.
              </p>
              <SignInButton mode="modal">
                <Button 
                  size="lg" 
                  className="gap-2"
                  data-testid="button-cta-getstarted"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignInButton>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • Works offline • Export anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">Learning Journal</p>
                <p className="text-sm text-muted-foreground">Document. Organize. Grow.</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Learning Journal. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Progressive Web App • Offline-First • Open Source
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
