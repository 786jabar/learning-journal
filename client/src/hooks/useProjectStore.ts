import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { apiRequest } from "@/lib/queryClient";
import { useOfflineStatus } from "./useOfflineStatus";
import type { Project, InsertProject } from "@shared/schema";
import { nanoid } from "nanoid";

export function useProjects() {
  const { isOnline } = useOfflineStatus();
  const queryClient = useQueryClient();

  // Fetch from IndexedDB (primary source)
  const query = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const localProjects = await db.getAllProjects();
      
      // If online, sync with backend
      if (isOnline) {
        try {
          const response = await fetch("/api/projects");
          if (response.ok) {
            const serverProjects = await response.json();
            // Merge server data into IndexedDB
            for (const project of serverProjects) {
              await db.saveProject(project);
            }
            return await db.getAllProjects();
          }
        } catch (error) {
          console.log("Using local data, server unavailable");
        }
      }
      
      return localProjects;
    },
    staleTime: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const project: Project = {
        id: nanoid(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to IndexedDB immediately
      await db.saveProject(project);

      // Try to sync with server if online
      if (isOnline) {
        try {
          await apiRequest("POST", "/api/projects", project);
        } catch (error) {
          await db.addToSyncQueue({ type: "CREATE_PROJECT", data: project });
        }
      } else {
        await db.addToSyncQueue({ type: "CREATE_PROJECT", data: project });
      }

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertProject }) => {
      const existing = await db.getProject(id);
      if (!existing) throw new Error("Project not found");

      const updated: Project = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };

      // Update IndexedDB immediately
      await db.saveProject(updated);

      // Try to sync with server if online
      if (isOnline) {
        try {
          await apiRequest("PUT", `/api/projects/${id}`, data);
        } catch (error) {
          await db.addToSyncQueue({ type: "UPDATE_PROJECT", data: { id, ...data } });
        }
      } else {
        await db.addToSyncQueue({ type: "UPDATE_PROJECT", data: { id, ...data } });
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete from IndexedDB immediately
      await db.deleteProject(id);

      // Try to sync with server if online
      if (isOnline) {
        try {
          await apiRequest("DELETE", `/api/projects/${id}`, undefined);
        } catch (error) {
          await db.addToSyncQueue({ type: "DELETE_PROJECT", data: { id } });
        }
      } else {
        await db.addToSyncQueue({ type: "DELETE_PROJECT", data: { id } });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects: query.data || [],
    isLoading: query.isLoading,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
