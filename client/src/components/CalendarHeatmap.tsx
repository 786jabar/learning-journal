import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JournalEntry } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarHeatmapProps {
  journals: JournalEntry[];
  month?: Date;
}

export function CalendarHeatmap({ journals, month = new Date() }: CalendarHeatmapProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const journalsByDate = journals.reduce((acc, journal) => {
    const dateKey = format(new Date(journal.date), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(journal);
    return acc;
  }, {} as Record<string, JournalEntry[]>);
  
  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-primary/30";
    if (count === 2) return "bg-primary/60";
    return "bg-primary";
  };
  
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  return (
    <Card className="glass-card overflow-visible">
      <CardHeader>
        <CardTitle className="gradient-text">Learning Activity Calendar</CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(month, "MMMM yyyy")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-2 text-xs text-center font-medium text-muted-foreground mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          <TooltipProvider>
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7 gap-2">
                {week.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const dayJournals = journalsByDate[dateKey] || [];
                  const count = dayJournals.length;
                  const isCurrentMonth = day.getMonth() === month.getMonth();
                  
                  return (
                    <Tooltip key={day.toISOString()}>
                      <TooltipTrigger asChild>
                        <div
                          className={`
                            aspect-square rounded-lg border transition-all duration-200
                            ${getIntensity(count)}
                            ${isCurrentMonth ? "opacity-100" : "opacity-30"}
                            ${count > 0 ? "hover-elevate cursor-pointer" : ""}
                            flex items-center justify-center text-xs font-medium
                            ${isSameDay(day, new Date()) ? "ring-2 ring-primary" : ""}
                          `}
                        >
                          <span className={count > 0 ? "text-primary-foreground" : "text-foreground"}>
                            {format(day, "d")}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p className="font-semibold">{format(day, "MMM d, yyyy")}</p>
                          {count > 0 ? (
                            <>
                              <p className="text-muted-foreground">{count} {count === 1 ? "entry" : "entries"}</p>
                              {dayJournals.slice(0, 2).map((journal) => (
                                <p key={journal.id} className="text-xs truncate max-w-xs">• {journal.title}</p>
                              ))}
                              {count > 2 && <p className="text-xs text-muted-foreground">+{count - 2} more</p>}
                            </>
                          ) : (
                            <p className="text-muted-foreground">No entries</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </TooltipProvider>
          
          <div className="flex items-center gap-3 mt-6 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted/30"></div>
              <div className="w-4 h-4 rounded bg-primary/30"></div>
              <div className="w-4 h-4 rounded bg-primary/60"></div>
              <div className="w-4 h-4 rounded bg-primary"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
