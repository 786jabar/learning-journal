import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BookOpen, Clock, Tag } from "lucide-react";
import { StreakTracker } from "@/components/StreakTracker";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { useJournals } from "@/hooks/useJournalStore";
import { useProjects } from "@/hooks/useProjectStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const { journals, isLoading } = useJournals();
  const { projects } = useProjects();
  
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const monthStart = startOfMonth(month);
    const monthEnd = startOfMonth(subMonths(month, -1));
    
    const count = journals.filter(j => {
      const date = new Date(j.date);
      return date >= monthStart && date < monthEnd;
    }).length;
    
    return {
      month: format(month, "MMM"),
      entries: count,
    };
  });
  
  const allTags = journals.flatMap(j => j.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);
  
  const allTechStack = projects.flatMap(p => p.techStack);
  const techCounts = allTechStack.reduce((acc, tech) => {
    acc[tech] = (acc[tech] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTech = Object.entries(techCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, value]) => ({ name, count: value }));
  
  const avgEntriesPerWeek = journals.length > 0 
    ? (journals.length / Math.max(1, Math.ceil(
        (new Date().getTime() - new Date(journals[journals.length - 1].date).getTime()) / (1000 * 60 * 60 * 24 * 7)
      ))).toFixed(1)
    : "0";
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your learning progress and insights
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card overflow-visible card-hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{journals.length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-visible card-hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Avg Per Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{avgEntriesPerWeek}</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-visible card-hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Unique Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{Object.keys(tagCounts).length}</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-visible card-hover-lift">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text">{projects.length}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-12">
          <StreakTracker journals={journals} />
        </div>
        
        <div className="mb-12">
          <CalendarHeatmap journals={journals} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="glass-card overflow-visible card-hover-lift">
            <CardHeader>
              <CardTitle className="gradient-text">6-Month Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="entries" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="glass-card overflow-visible card-hover-lift">
            <CardHeader>
              <CardTitle className="gradient-text">Top Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              {topTech.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topTech} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      type="number"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category"
                      width={100}
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <p>No technologies tracked yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="glass-card overflow-visible card-hover-lift">
          <CardHeader>
            <CardTitle className="gradient-text">Tag Cloud</CardTitle>
            <p className="text-sm text-muted-foreground">All topics you've explored</p>
          </CardHeader>
          <CardContent>
            {sortedTags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {sortedTags.map(([tag, count]) => {
                  const size = Math.min(count * 0.3 + 1, 2.5);
                  return (
                    <Badge 
                      key={tag}
                      variant="outline"
                      className="hover-elevate cursor-default"
                      style={{ fontSize: `${size * 0.75}rem`, padding: `${size * 0.25}rem ${size * 0.5}rem` }}
                    >
                      {tag} ({count})
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Start adding tags to your entries to see them here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
