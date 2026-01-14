import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, TrendingUp, Users, Zap, Shield, Cloud, CheckCircle2, Sparkles, ArrowRight, Download, Lock, GraduationCap, Rocket, Star, Heart, Code, PenTool } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background with Multiple Layers */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/15 rounded-full blur-[140px] animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[90px] animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-20 w-4 h-4 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Hero Section - Enhanced Glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Floating decorative icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 text-primary/20 animate-float" style={{ animationDelay: '0.5s' }}>
            <BookOpen className="h-16 w-16" />
          </div>
          <div className="absolute top-1/3 right-16 text-secondary/20 animate-float" style={{ animationDelay: '1.5s' }}>
            <GraduationCap className="h-20 w-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/4 text-accent/20 animate-float" style={{ animationDelay: '2.5s' }}>
            <Code className="h-14 w-14" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 text-primary/15 animate-float" style={{ animationDelay: '3.5s' }}>
            <PenTool className="h-12 w-12" />
          </div>
          <div className="absolute top-1/2 left-1/6 text-secondary/15 animate-float" style={{ animationDelay: '1s' }}>
            <Rocket className="h-10 w-10" />
          </div>
        </div>

        <div className="container relative mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Animated Badge with glow */}
            <div className="relative mb-10">
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-primary via-secondary to-accent opacity-50 animate-pulse"></div>
              <Badge className="relative gap-2 glass-card px-8 py-3 text-sm font-medium border-2 border-white/20" variant="secondary" data-testid="badge-pwa">
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                Progressive Web App
                <Star className="h-4 w-4" />
              </Badge>
            </div>

            {/* Main Heading with Enhanced Gradient Text */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 leading-tight max-w-5xl tracking-tight" data-testid="heading-main">
              Your Learning Journey,
              <br />
              <span className="gradient-text bg-clip-text">Beautifully Documented</span>
            </h1>

            {/* Subheading with improved typography */}
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mb-14 leading-relaxed font-light" data-testid="text-description">
              Track your learning progress with journal entries, manage projects, and visualize your growth — 
              all while working seamlessly offline with stunning glassmorphism design.
            </p>

            {/* Enhanced Glass Card for Start Button */}
            <div className="relative group mb-14">
              {/* Animated border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-[2rem] blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-glow"></div>
              
              <div className="relative glass-card rounded-[2rem] p-10 max-w-lg w-full border-2 border-white/20 shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Heart className="h-5 w-5 text-secondary animate-pulse" />
                  <p className="text-base text-foreground/90 font-semibold" data-testid="text-getstarted-prompt">
                    Start using the app right now - no account required!
                  </p>
                </div>
                
                <Link href="/">
                  <Button 
                    size="lg" 
                    className="w-full text-lg gap-4 gradient-bg text-white hover:opacity-90 py-7 rounded-2xl font-semibold shadow-lg glow-button"
                    data-testid="button-start-app"
                  >
                    <BookOpen className="h-6 w-6" />
                    Start Your Learning Journey
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Free forever, works offline
                </p>
              </div>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-3 glass px-6 py-3 rounded-full border border-white/10 hover:border-primary/30 transition-colors">
                <div className="p-1.5 rounded-full bg-primary/20">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-3 glass px-6 py-3 rounded-full border border-white/10 hover:border-secondary/30 transition-colors">
                <div className="p-1.5 rounded-full bg-secondary/20">
                  <Cloud className="h-4 w-4 text-secondary" />
                </div>
                <span className="font-medium">Works Offline</span>
              </div>
              <div className="flex items-center gap-3 glass px-6 py-3 rounded-full border border-white/10 hover:border-accent/30 transition-colors">
                <div className="p-1.5 rounded-full bg-accent/20">
                  <Zap className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium">Lightning Fast</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-muted-foreground font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 rounded-full bg-muted-foreground/50 animate-pulse"></div>
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
