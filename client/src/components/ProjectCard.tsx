import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Code2 } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="glass-card hover:scale-105 transition-all duration-300 overflow-visible h-full flex flex-col border-l-4 border-l-secondary" data-testid={`card-project-${project.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-3 gradient-bg rounded-xl">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg line-clamp-1" data-testid={`text-project-name-${project.id}`}>
              {project.name}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4" data-testid={`text-project-description-${project.id}`}>
          {project.description}
        </p>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <div 
                key={index} 
                className="gradient-bg px-3 py-1 rounded-full text-xs font-mono font-medium text-white"
                data-testid={`badge-project-tech-${project.id}-${index}`}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex justify-end gap-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            data-testid={`button-edit-project-${project.id}`}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.id)}
            data-testid={`button-delete-project-${project.id}`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
