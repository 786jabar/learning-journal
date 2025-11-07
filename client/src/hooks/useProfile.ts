import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserProfile, InsertUserProfile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<UserProfile | null>({
    queryKey: ["/api/profile"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: InsertUserProfile) => {
      return apiRequest("POST", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });

  return {
    profile,
    isLoading,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
}
