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
  // All routes are now public - no authentication required
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/landing" component={LandingPage} />
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
  // Initialize sync queue to process offline operations when online
  useSyncQueue();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
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
