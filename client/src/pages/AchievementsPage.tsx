import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Flame, 
  Star, 
  Target, 
  BookOpen, 
  Code, 
  Zap,
  Award,
  Calendar,
  TrendingUp
} from "lucide-react";
import localforage from "localforage";
import { useQuery } from "@tanstack/react-query";
import type { JournalEntry, Project } from "@shared/schema";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  type: "entries" | "projects" | "streak" | "special";
  unlocked: boolean;
  progress: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  totalEntries: number;
  totalProjects: number;
  unlockedAchievements: string[];
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  totalEntries: 0,
  totalProjects: 0,
  unlockedAchievements: [],
};

const ACHIEVEMENTS_CONFIG = [
  { id: "first_entry", title: "First Steps", description: "Create your first journal entry", icon: <BookOpen className="h-6 w-6" />, requirement: 1, type: "entries" as const },
  { id: "five_entries", title: "Getting Started", description: "Create 5 journal entries", icon: <Star className="h-6 w-6" />, requirement: 5, type: "entries" as const },
  { id: "ten_entries", title: "Dedicated Learner", description: "Create 10 journal entries", icon: <Trophy className="h-6 w-6" />, requirement: 10, type: "entries" as const },
  { id: "first_project", title: "Builder", description: "Add your first project", icon: <Code className="h-6 w-6" />, requirement: 1, type: "projects" as const },
  { id: "three_projects", title: "Portfolio Pro", description: "Add 3 projects", icon: <Target className="h-6 w-6" />, requirement: 3, type: "projects" as const },
  { id: "streak_3", title: "On Fire", description: "Maintain a 3-day streak", icon: <Flame className="h-6 w-6" />, requirement: 3, type: "streak" as const },
  { id: "streak_7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: <Zap className="h-6 w-6" />, requirement: 7, type: "streak" as const },
  { id: "streak_14", title: "Unstoppable", description: "Maintain a 14-day streak", icon: <Award className="h-6 w-6" />, requirement: 14, type: "streak" as const },
];

export default function AchievementsPage() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const { data: journals = [], isLoading: journalsLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journals"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const loading = journalsLoading || projectsLoading;

  useEffect(() => {
    if (!loading) {
      loadStreakData();
    }
  }, [loading, journals, projects]);

  const loadStreakData = async () => {
    try {
      const savedStreak = await localforage.getItem<StreakData>("streak-data");
      const journalCount = journals.length;
      const projectCount = projects.length;

      let data = savedStreak || DEFAULT_STREAK_DATA;
      
      data = {
        ...data,
        totalEntries: journalCount,
        totalProjects: projectCount,
      };

      const today = new Date().toDateString();
      
      const hasRecentActivity = journals.some((j) => {
        const entryDate = new Date(j.createdAt).toDateString();
        return entryDate === today;
      }) || projects.some((p) => {
        const projectDate = new Date(p.createdAt).toDateString();
        return projectDate === today;
      });

      if (hasRecentActivity) {
        if (data.lastActivityDate) {
          const lastDate = new Date(data.lastActivityDate).toDateString();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate === today) {
          } else if (lastDate === yesterday.toDateString()) {
            data.currentStreak += 1;
            data.lastActivityDate = today;
            if (data.currentStreak > data.longestStreak) {
              data.longestStreak = data.currentStreak;
            }
          } else {
            data.currentStreak = 1;
            data.lastActivityDate = today;
          }
        } else {
          data.currentStreak = 1;
          data.lastActivityDate = today;
        }
      }

      await localforage.setItem("streak-data", data);
      setStreakData(data);

      const updatedAchievements = ACHIEVEMENTS_CONFIG.map((config) => {
        let progress = 0;
        let unlocked = false;

        switch (config.type) {
          case "entries":
            progress = Math.min((journalCount / config.requirement) * 100, 100);
            unlocked = journalCount >= config.requirement;
            break;
          case "projects":
            progress = Math.min((projectCount / config.requirement) * 100, 100);
            unlocked = projectCount >= config.requirement;
            break;
          case "streak":
            progress = Math.min((data.longestStreak / config.requirement) * 100, 100);
            unlocked = data.longestStreak >= config.requirement;
            break;
        }

        return {
          ...config,
          unlocked,
          progress,
        };
      });

      setAchievements(updatedAchievements);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground">Loading achievements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2" data-testid="text-achievements-title">
          Achievements & Streaks
        </h1>
        <p className="text-muted-foreground">
          Track your learning progress and unlock achievements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card" data-testid="card-current-streak">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Flame className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold" data-testid="text-current-streak">{streakData.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card" data-testid="card-longest-streak">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Trophy className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-3xl font-bold" data-testid="text-longest-streak">{streakData.longestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card" data-testid="card-achievements-progress">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="text-3xl font-bold" data-testid="text-achievements-count">{unlockedCount}/{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Total Entries:</span>
              <span className="font-bold" data-testid="text-total-entries">{streakData.totalEntries}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Code className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Total Projects:</span>
              <span className="font-bold" data-testid="text-total-projects">{streakData.totalProjects}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            All Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30"
                    : "bg-muted/30 border-muted opacity-60"
                }`}
                data-testid={`card-achievement-${achievement.id}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-primary to-primary/70 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{achievement.title}</h3>
                      {achievement.unlocked && (
                        <Badge variant="default" className="text-xs">Unlocked</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <Progress value={achievement.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(achievement.progress)}% complete
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            How to Earn More
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Visit daily to build your streak
            </li>
            <li className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Add journal entries to unlock entry achievements
            </li>
            <li className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Add projects to your portfolio
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
