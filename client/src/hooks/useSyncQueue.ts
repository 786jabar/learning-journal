import { useEffect } from "react";
import { useOfflineStatus } from "./useOfflineStatus";
import { db } from "@/lib/db";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

export function useSyncQueue() {
  const { isOnline, isSyncing } = useOfflineStatus();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isOnline || isSyncing) return;

    const syncQueue = async () => {
      const queue = await db.getSyncQueue();
      
      if (queue.length === 0) return;

      console.log(`Syncing ${queue.length} operations...`);

      for (const { key, operation } of queue) {
        try {
          const { type, data } = operation;

          switch (type) {
            case "CREATE_JOURNAL":
              await apiRequest("POST", "/api/journals", data);
              break;
            case "UPDATE_JOURNAL":
              await apiRequest("PUT", `/api/journals/${data.id}`, data);
              break;
            case "DELETE_JOURNAL":
              await apiRequest("DELETE", `/api/journals/${data.id}`, undefined);
              break;
            case "CREATE_PROJECT":
              await apiRequest("POST", "/api/projects", data);
              break;
            case "UPDATE_PROJECT":
              await apiRequest("PUT", `/api/projects/${data.id}`, data);
              break;
            case "DELETE_PROJECT":
              await apiRequest("DELETE", `/api/projects/${data.id}`, undefined);
              break;
            default:
              console.warn("Unknown sync operation type:", type);
          }

          // Remove from queue after successful sync
          await db.removeFromSyncQueue(key);
        } catch (error) {
          console.error("Failed to sync operation:", operation, error);
          // Keep in queue for next sync attempt
        }
      }

      // Invalidate queries after sync
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      
      console.log("Sync complete!");
    };

    syncQueue();
  }, [isOnline, isSyncing, queryClient]);
}
