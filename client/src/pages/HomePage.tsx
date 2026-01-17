import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, BookOpen, Code2, Calendar, Menu, Compass, Settings, Gamepad2, Palette } from "lucide-react";
import { Link } from "wouter";
import { JournalCard } from "@/components/JournalCard";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import type { JournalEntry } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { useJournals } from "@/hooks/useJournalStore";
import { useProjects } from "@/hooks/useProjectStore";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const quickActions = [
  { path: "/menu", label: "Menu", icon: Menu, description: "All Features", gradient: "from-purple-500 to-pink-500" },
  { path: "/explore", label: "Explore", icon: Compass, description: "Discover", gradient: "from-cyan-500 to-blue-500" },
  { path: "/memory-game", label: "Play Game", icon: Gamepad2, description: "Celestial Memory", gradient: "from-orange-500 to-red-500" },
  { path: "/canvas", label: "Draw", icon: Palette, description: "Creative Canvas", gradient: "from-green-500 to-teal-500" },
];

export default function HomePage() {
  const { journals, isLoading: journalsLoading } = useJournals();
  const { projects, isLoading: projectsLoading } = useProjects();

  // Calculate weekly entries data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const count = journals.filter(
      (j) => startOfDay(new Date(j.date)).getTime() === dayStart.getTime()
    ).length;
    return {
      day: format(date, "EEE"),
      entries: count,
    };
  });

  // Calculate tag distribution
  const tagCounts = journals.reduce((acc, journal) => {
    journal.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const tagData = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  // Calculate streak - fixed version
  const journalsByDate = journals.reduce((acc, journal) => {
    const dateKey = startOfDay(new Date(journal.date)).getTime();
    acc[dateKey] = true;
    return acc;
  }, {} as Record<number, boolean>);
  
  let streak = 0;
  let checkDate = startOfDay(new Date());
  
  // Check from today backwards
  while (journalsByDate[checkDate.getTime()]) {
    streak++;
    checkDate = subDays(checkDate, 1);
  }
  
  // If no entry today, check if streak should start from yesterday
  if (streak === 0 && journalsByDate[subDays(startOfDay(new Date()), 1).getTime()]) {
    checkDate = subDays(startOfDay(new Date()), 1);
    while (journalsByDate[checkDate.getTime()]) {
      streak++;
      checkDate = subDays(checkDate, 1);
    }
  }

  const recentJournals = journals.slice(0, 3);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-spin-slow"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-[calc(env(safe-area-inset-top,0px)+3rem)]">
        {/* Hero Section - Glass Card */}
        <div className="glass-card rounded-3xl p-8 mb-12 animate-pulse-glow">
          <h1 className="text-5xl font-bold mb-4" data-testid="text-welcome">
            Welcome to Your <span className="gradient-text">Learning Journal</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            Track your progress, reflect on your journey, and build amazing projects.
          </p>
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {quickActions.map((action) => (
              <Link key={action.path} href={action.path}>
                <div 
                  className="glass p-4 rounded-xl text-center hover-elevate cursor-pointer transition-all"
                  data-testid={`button-quick-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/journal" asChild>
            <Button size="lg" className="gradient-bg text-white glow-button" data-testid="button-new-entry">
              <Plus className="h-5 w-5 mr-2" />
              New Journal Entry
            </Button>
          </Link>
        </div>

        {/* Stats Cards - Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6 card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Entries</h3>
              <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text" data-testid="text-total-entries">{journals.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              All time journal entries
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Projects</h3>
              <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text" data-testid="text-total-projects">{projects.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Active projects
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Current Streak</h3>
              <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center animate-glow">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text" data-testid="text-current-streak">{streak}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {streak === 1 ? "day" : "days"} in a row
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 card-hover-lift">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">This Week</h3>
              <div className="h-10 w-10 gradient-bg rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text" data-testid="text-week-entries">
              {weeklyData.reduce((sum, day) => sum + day.entries, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Entries this week
            </p>
          </div>
        </div>

        {/* Charts - Glassmorphism */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="day" 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="entries" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Top Tags</h2>
            {tagData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tagData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tagData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>No tags yet. Start adding tags to your entries!</p>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Heatmap */}
        {journals.length > 0 && (
          <div className="mb-12">
            <CalendarHeatmap journals={journals} />
          </div>
        )}

        {/* Recent Entries */}
        {recentJournals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold gradient-text">Recent Entries</h2>
              <Link href="/journal" asChild>
                <Button variant="ghost" data-testid="button-view-all">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJournals.map((journal) => (
                <JournalCard key={journal.id} entry={journal} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Glass Effect */}
        {journals.length === 0 && !journalsLoading && (
          <div className="glass-card rounded-3xl p-16 text-center">
            <div className="h-20 w-20 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 gradient-text">Start Your Learning Journey</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Create your first journal entry to track your learning progress and reflect on your experiences.
            </p>
            <Link href="/journal" asChild>
              <Button size="lg" className="gradient-bg text-white hover:opacity-90 transition-opacity" data-testid="button-start-journey">
                <Plus className="h-5 w-5 mr-2" />
                Create First Entry
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
