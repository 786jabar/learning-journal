import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2 } from "lucide-react";
import type { JournalEntry } from "@shared/schema";
import { format } from "date-fns";

interface JournalCardProps {
  entry: JournalEntry;
  onEdit?: (entry: JournalEntry) => void;
  onDelete?: (id: string) => void;
}

export function JournalCard({ entry, onEdit, onDelete }: JournalCardProps) {
  // Extract preview of markdown content (first 150 characters)
  const preview = entry.content.length > 150 
    ? entry.content.substring(0, 150) + "..." 
    : entry.content;

  return (
    <Card className="hover-elevate transition-all duration-200 overflow-visible h-full flex flex-col" data-testid={`card-journal-${entry.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2" data-testid={`text-journal-title-${entry.id}`}>
            {entry.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={entry.date.toString()} data-testid={`text-journal-date-${entry.id}`}>
            {format(new Date(entry.date), "PPP")}
          </time>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-journal-preview-${entry.id}`}>
          {preview}
        </p>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {entry.tags.slice(0, 4).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
                data-testid={`badge-journal-tag-${entry.id}-${index}`}
              >
                {tag}
              </Badge>
            ))}
            {entry.tags.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{entry.tags.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 flex justify-end gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(entry)}
            data-testid={`button-edit-journal-${entry.id}`}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(entry.id)}
            data-testid={`button-delete-journal-${entry.id}`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
