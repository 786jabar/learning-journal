import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ProjectCard } from "@/components/ProjectCard";
import { Plus, X } from "lucide-react";
import type { Project, InsertProject } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Code2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjectStore";

export default function ProjectsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState("");
  const { toast } = useToast();

  const {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
  } = useProjects();

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      techStack: [],
    },
  });

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      form.reset({
        name: project.name,
        description: project.description,
        techStack: project.techStack,
      });
    } else {
      setEditingProject(null);
      form.reset({
        name: "",
        description: "",
        techStack: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    form.reset();
  };

  const onSubmit = async (data: InsertProject) => {
    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, data });
        toast({ title: "Success", description: "Project updated!" });
      } else {
        await createProject(data);
        toast({ title: "Success", description: "Project created!" });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: editingProject ? "Failed to update project" : "Failed to create project",
        variant: "destructive"
      });
    }
  };

  const handleAddTech = () => {
    if (techInput.trim() && !form.getValues("techStack").includes(techInput.trim())) {
      const currentTech = form.getValues("techStack");
      form.setValue("techStack", [...currentTech, techInput.trim()]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    const currentTech = form.getValues("techStack");
    form.setValue("techStack", currentTech.filter(tech => tech !== techToRemove));
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast({ title: "Success", description: "Project deleted!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">
              Track your learning projects and technologies
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-new-project">
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-64" />
              </Card>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteProject}
              />
            ))}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="text-center">
              <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first project to showcase what you're building
              </p>
              <Button onClick={() => handleOpenDialog()} data-testid="button-create-first-project">
                <Plus className="h-5 w-5 mr-2" />
                Create First Project
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "New Project"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Project" {...field} data-testid="input-project-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project..."
                          className="min-h-[120px]"
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add technology (e.g., React, TypeScript)"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
                      data-testid="input-tech"
                    />
                    <Button type="button" onClick={handleAddTech} variant="secondary" data-testid="button-add-tech">
                      Add
                    </Button>
                  </div>
                  {form.formState.errors.techStack && (
                    <p className="text-sm text-destructive">{form.formState.errors.techStack.message}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("techStack").map((tech, index) => (
                      <Badge key={index} variant="default" className="gap-1 font-mono" data-testid={`badge-tech-${index}`}>
                        {tech}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTech(tech)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog} data-testid="button-cancel-project">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreating || isUpdating}
                    data-testid="button-submit-project"
                  >
                    {isCreating || isUpdating
                      ? "Saving..."
                      : editingProject
                      ? "Update Project"
                      : "Create Project"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
