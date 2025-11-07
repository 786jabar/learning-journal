// Clerk Auth hook for checking authentication status
// Replaces Replit Auth for portable deployment

import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Sync Clerk user to our database when authenticated
  const { data: dbUser, isLoading: isLoadingDbUser } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: isSignedIn && isLoaded,
    retry: false,
  });

  // Loading if Clerk is still loading OR if we're syncing to database
  const isLoading = !isLoaded || (isSignedIn && isLoadingDbUser);

  return {
    user: dbUser || null,
    clerkUser,
    isLoading,
    isAuthenticated: isSignedIn || false,
  };
}
