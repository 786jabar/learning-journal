import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
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
import Lab4DemoPage from "@/pages/Lab4DemoPage";
import Lab4Report from "@/pages/Lab4Report";
import Lab5DemoPage from "@/pages/Lab5DemoPage";
import Lab5Report from "@/pages/Lab5Report";
import Lab6DemoPage from "@/pages/Lab6DemoPage";
import Lab6Report from "@/pages/Lab6Report";
import Lab7DemoPage from "@/pages/Lab7DemoPage";
import AchievementsPage from "@/pages/AchievementsPage";
import MemoryGamePage from "@/pages/MemoryGamePage";
import CanvasPage from "@/pages/CanvasPage";
import MenuPage from "@/pages/MenuPage";
import OptionsPage from "@/pages/OptionsPage";
import SettingsPage from "@/pages/SettingsPage";
import ExplorePage from "@/pages/ExplorePage";

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
      <Route path="/lab4-demo" component={Lab4DemoPage} />
      <Route path="/lab4-report" component={Lab4Report} />
      <Route path="/lab5-demo" component={Lab5DemoPage} />
      <Route path="/lab5-report" component={Lab5Report} />
      <Route path="/lab6-demo" component={Lab6DemoPage} />
      <Route path="/lab6-report" component={Lab6Report} />
      <Route path="/lab7-demo" component={Lab7DemoPage} />
      <Route path="/achievements" component={AchievementsPage} />
      <Route path="/memory-game" component={MemoryGamePage} />
      <Route path="/canvas" component={CanvasPage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/options" component={OptionsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/explore" component={ExplorePage} />
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
      <main className="flex-1 pb-20 md:pb-0">
        <Router />
      </main>
      <Footer />
      <BottomNav />
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
