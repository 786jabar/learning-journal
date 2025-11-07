import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { apiRequest } from "@/lib/queryClient";
import { useOfflineStatus } from "./useOfflineStatus";
import type { JournalEntry, InsertJournalEntry } from "@shared/schema";
import { nanoid } from "nanoid";
import { useToast } from "./use-toast";

export function useJournals() {
  const { isOnline } = useOfflineStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch from IndexedDB (primary source)
  const query = useQuery<JournalEntry[]>({
    queryKey: ["journals"],
    queryFn: async () => {
      const localJournals = await db.getAllJournals();
      
      // If online, sync with backend
      if (isOnline) {
        try {
          const response = await fetch("/api/journals");
          if (response.ok) {
            const serverJournals = await response.json();
            // Merge server data into IndexedDB
            for (const journal of serverJournals) {
              await db.saveJournal(journal);
            }
            return await db.getAllJournals();
          }
        } catch (error) {
          console.log("Using local data, server unavailable");
        }
      }
      
      return localJournals;
    },
    staleTime: 0,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertJournalEntry) => {
      const journal: JournalEntry = {
        id: nanoid(),
        ...data,
        date: data.date || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to IndexedDB immediately
      await db.saveJournal(journal);

      // Try to sync with server if online
      if (isOnline) {
        try {
          await apiRequest("POST", "/api/journals", journal);
        } catch (error) {
          // Queue for later sync
          await db.addToSyncQueue({ type: "CREATE_JOURNAL", data: journal });
        }
      } else {
        // Queue for later sync when online
        await db.addToSyncQueue({ type: "CREATE_JOURNAL", data: journal });
      }

      return journal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertJournalEntry }) => {
      const existing = await db.getJournal(id);
      if (!existing) throw new Error("Journal not found");

      const updated: JournalEntry = {
        ...existing,
        ...data,
        date: data.date || existing.date,
        updatedAt: new Date(),
      };

      // Update IndexedDB immediately
      await db.saveJournal(updated);

      // Try to sync with server if online
      if (isOnline) {
        try {
          await apiRequest("PUT", `/api/journals/${id}`, data);
        } catch (error) {
          await db.addToSyncQueue({ type: "UPDATE_JOURNAL", data: { id, ...data } });
        }
      } else {
        await db.addToSyncQueue({ type: "UPDATE_JOURNAL", data: { id, ...data } });
      }

      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Delete from IndexedDB immediately
      await db.deleteJournal(id);

      // Try to sync with server if online
      if (isOnline) {
        try {
          await apiRequest("DELETE", `/api/journals/${id}`, undefined);
        } catch (error) {
          await db.addToSyncQueue({ type: "DELETE_JOURNAL", data: { id } });
        }
      } else {
        await db.addToSyncQueue({ type: "DELETE_JOURNAL", data: { id } });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });

  return {
    journals: query.data || [],
    isLoading: query.isLoading,
    createJournal: createMutation.mutateAsync,
    updateJournal: updateMutation.mutateAsync,
    deleteJournal: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
