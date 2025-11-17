import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSyncQueue } from "@/hooks/useSyncQueue";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import JournalPage from "@/pages/JournalPage";
import ProjectsPage from "@/pages/ProjectsPage";
import AboutPage from "@/pages/AboutPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import LandingPage from "@/pages/LandingPage";
import Lab3DemoPage from "@/pages/Lab3DemoPage";
import Lab3Report from "@/pages/Lab3Report";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for ALL routes when not authenticated
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Show authenticated routes only when authenticated
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/journal" component={JournalPage} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/lab3-demo" component={Lab3DemoPage} />
      <Route path="/lab3-report" component={Lab3Report} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Initialize sync queue to process offline operations when online (only when authenticated)
  useSyncQueue();

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && !isLoading && <Navbar />}
      <main className="flex-1">
        <Router />
      </main>
      {isAuthenticated && !isLoading && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="learning-journal-theme">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
