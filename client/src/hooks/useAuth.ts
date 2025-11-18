// No authentication - everyone can access the app

export function useAuth() {
  return {
    user: null,
    clerkUser: null,
    isLoading: false,
    isAuthenticated: true, // Always authenticated (public access)
  };
}
