import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, TrendingUp, Users, Zap, Shield, Cloud, CheckCircle2, Sparkles, ArrowRight, Download, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section - Glassmorphism */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        <div className="container relative mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Floating Badge */}
            <Badge className="mb-8 gap-2 glass-card animate-float px-6 py-2 text-sm" variant="secondary" data-testid="badge-pwa">
              <Sparkles className="h-4 w-4" />
              Progressive Web App
            </Badge>

            {/* Main Heading with Gradient Text */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight max-w-5xl" data-testid="heading-main">
              Your Learning Journey,
              <br />
              <span className="gradient-text">Beautifully Documented</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-12 leading-relaxed" data-testid="text-description">
              Track your learning progress with journal entries, manage projects, and visualize your growth — 
              all while working seamlessly offline with stunning glassmorphism design.
            </p>

            {/* Glass Card for Start Button */}
            <div className="glass-card rounded-3xl p-8 max-w-md w-full mb-12 animate-glow">
              <p className="text-sm text-foreground/80 mb-6 font-medium" data-testid="text-getstarted-prompt">
                Start using the app right now - no account required!
              </p>
              
              <Link href="/">
                <Button 
                  size="lg" 
                  className="w-full text-base gap-3 gradient-bg text-white hover:opacity-90"
                  data-testid="button-start-app"
                >
                  <BookOpen className="h-5 w-5" />
                  Start Your Learning Journey
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Glass Pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Cloud className="h-4 w-4 text-secondary" />
                <span>Works Offline</span>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
                <Zap className="h-4 w-4 text-accent" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Glassmorphism Cards */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text" data-testid="heading-features">
              Everything You Need to Learn Better
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A powerful set of features designed to help you document, organize, and analyze your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300" data-testid="card-feature-journal">
              <div className="h-14 w-14 gradient-bg rounded-2xl flex items-center justify-center mb-6 animate-glow">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rich Journal Entries</h3>
              <p className="text-muted-foreground leading-relaxed">
                Write detailed entries with full Markdown support, code blocks, and rich formatting
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300" data-testid="card-feature-projects">
              <div className="h-14 w-14 gradient-bg rounded-2xl flex items-center justify-center mb-6 animate-glow">
                <Lightbulb className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Project Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Manage your learning projects with tech stack tracking and progress monitoring
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300" data-testid="card-feature-analytics">
              <div className="h-14 w-14 gradient-bg rounded-2xl flex items-center justify-center mb-6 animate-glow">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visual Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful charts and graphs to visualize your learning patterns and progress
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300" data-testid="card-feature-multiuser">
              <div className="h-14 w-14 gradient-bg rounded-2xl flex items-center justify-center mb-6 animate-glow">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personal Workspace</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your own private space on this device with complete data isolation from other devices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section - Minimalist with Glass Accents */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Why Choose <span className="gradient-text">Learning Journal</span>?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Built with modern web technologies for the best learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center">
                    <Cloud className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Offline-First Architecture</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Continue working even without internet. Your data is stored locally and syncs automatically when you're back online.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Private & Device-Specific</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your data is completely isolated per device. Each browser has its own private workspace stored locally.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Markdown Support</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Write with full Markdown formatting, including code blocks, tables, lists, and more with live preview.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Export Your Data</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Own your content. Export journal entries and projects as JSON, Markdown, or PDF anytime.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Beautiful Dark Mode</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Seamlessly switch between light and dark themes. Your preference is saved and synced across devices.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 gradient-bg rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Track Your Progress</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Visualize your learning journey with charts, statistics, and insights about your study patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Glass Card with Gradient */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-3xl p-12 max-w-4xl mx-auto text-center animate-glow" data-testid="card-cta">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 gradient-bg rounded-3xl flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Start Your <span className="gradient-text">Learning Journal</span> Today
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Start documenting your learning journey and tracking your progress.
              No account or sign-up required!
            </p>
            <Link href="/">
              <Button 
                size="lg" 
                className="gap-2 gradient-bg text-white hover:opacity-90 transition-opacity text-lg px-8 py-6"
                data-testid="button-cta-getstarted"
              >
                Start Using App Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              Free forever • Works offline • Export anytime • No sign-up needed
            </p>
          </div>
        </div>
      </section>

      {/* Footer - Glass Effect */}
      <footer className="glass border-t px-4 py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 gradient-bg rounded-2xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Learning Journal</p>
                <p className="text-sm text-muted-foreground">Document. Organize. Grow.</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Learning Journal. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Progressive Web App • Offline-First • Glassmorphism Design
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
