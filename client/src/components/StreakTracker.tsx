import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Trophy, Calendar } from "lucide-react";
import { startOfDay, subDays, isSameDay } from "date-fns";
import type { JournalEntry } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

interface StreakTrackerProps {
  journals: JournalEntry[];
}

export function StreakTracker({ journals }: StreakTrackerProps) {
  // Group journals by date
  const journalsByDate = journals.reduce((acc, journal) => {
    const dateKey = startOfDay(new Date(journal.date)).getTime();
    acc[dateKey] = true;
    return acc;
  }, {} as Record<number, boolean>);
  
  // Calculate current streak
  let currentStreak = 0;
  let checkDate = startOfDay(new Date());
  
  while (journalsByDate[checkDate.getTime()]) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }
  
  // If no entry today, check if streak should start from yesterday
  if (currentStreak === 0 && journalsByDate[subDays(startOfDay(new Date()), 1).getTime()]) {
    checkDate = subDays(startOfDay(new Date()), 1);
    while (journalsByDate[checkDate.getTime()]) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }
  }
  
  // Calculate longest streak - using calendar day comparison to handle DST
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedDates = Object.keys(journalsByDate)
    .map(Number)
    .sort((a, b) => a - b)
    .map(ts => new Date(ts));
  
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = sortedDates[i - 1];
      const currDate = sortedDates[i];
      const daysDiff = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }
  
  longestStreak = Math.max(longestStreak, currentStreak);
  
  const today = startOfDay(new Date());
  const hasEntryToday = journals.some(j => isSameDay(new Date(j.date), today));
  
  const weekGoal = 5;
  const last7Days = journals.filter(j => {
    const diff = (today.getTime() - startOfDay(new Date(j.date)).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < 7;
  }).length;
  
  const weekProgress = Math.min((last7Days / weekGoal) * 100, 100);
  
  const achievements = [
    { 
      icon: Trophy, 
      title: "First Entry", 
      completed: journals.length >= 1,
      description: "Create your first journal entry"
    },
    { 
      icon: Flame, 
      title: "3 Day Streak", 
      completed: longestStreak >= 3,
      description: "Maintain a 3-day learning streak"
    },
    { 
      icon: Calendar, 
      title: "Week Warrior", 
      completed: longestStreak >= 7,
      description: "Journal for 7 days in a row"
    },
    { 
      icon: Target, 
      title: "10 Entries", 
      completed: journals.length >= 10,
      description: "Write 10 journal entries"
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card overflow-visible">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className={`h-5 w-5 ${currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold gradient-text mb-2">{currentStreak}</div>
              <p className="text-lg text-muted-foreground">{currentStreak === 1 ? "day" : "days"}</p>
              {!hasEntryToday && currentStreak > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-4">
                  Write an entry today to keep your streak!
                </p>
              )}
              {hasEntryToday && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-4">
                  ✓ Entry logged today!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card overflow-visible">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold gradient-text mb-2">{longestStreak}</div>
              <p className="text-lg text-muted-foreground">{longestStreak === 1 ? "day" : "days"}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Your personal record!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-card overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Weekly Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {last7Days} / {weekGoal} entries this week
              </span>
              <span className="text-sm font-semibold">{Math.round(weekProgress)}%</span>
            </div>
            <Progress value={weekProgress} className="h-3" />
            {last7Days >= weekGoal && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center">
                🎉 Weekly goal achieved!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card overflow-visible">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, idx) => (
              <div 
                key={idx}
                className={`
                  flex items-start gap-3 p-4 rounded-xl border transition-all
                  ${achievement.completed 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-muted/30 border-border opacity-60'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg mt-0.5
                  ${achievement.completed ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.completed && (
                  <div className="text-green-500 text-xl">✓</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
