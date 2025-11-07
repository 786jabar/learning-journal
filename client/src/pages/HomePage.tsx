import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, BookOpen, Code2, Calendar } from "lucide-react";
import { Link } from "wouter";
import { JournalCard } from "@/components/JournalCard";
import type { JournalEntry } from "@shared/schema";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { useJournals } from "@/hooks/useJournalStore";
import { useProjects } from "@/hooks/useProjectStore";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

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

  // Calculate streak
  const sortedJournals = [...journals].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  
  for (const journal of sortedJournals) {
    const journalDate = startOfDay(new Date(journal.date));
    const expectedDate = startOfDay(subDays(currentDate, streak));
    
    if (journalDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else if (journalDate.getTime() < expectedDate.getTime()) {
      break;
    }
  }

  const recentJournals = journals.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-welcome">
            Welcome to Your Learning Journal
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Track your progress, reflect on your journey, and build amazing projects.
          </p>
          <Link href="/journal" asChild>
            <Button size="lg" data-testid="button-new-entry">
              <Plus className="h-5 w-5 mr-2" />
              New Journal Entry
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-entries">{journals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time journal entries
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-projects">{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-current-streak">{streak}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {streak === 1 ? "day" : "days"} in a row
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-week-entries">
                {weeklyData.reduce((sum, day) => sum + day.entries, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Entries this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <Bar dataKey="entries" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Tags</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        {recentJournals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Entries</h2>
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

        {/* Empty State */}
        {journals.length === 0 && !journalsLoading && (
          <Card className="py-16">
            <CardContent className="text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Start Your Learning Journey</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first journal entry to track your learning progress and reflect on your experiences.
              </p>
              <Link href="/journal" asChild>
                <Button data-testid="button-start-journey">
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Entry
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
