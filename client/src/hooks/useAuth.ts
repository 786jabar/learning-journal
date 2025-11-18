// No authentication - everyone can access the app
// Each device gets a unique ID for data isolation

import { getDeviceId } from "@/lib/deviceId";

export function useAuth() {
  return {
    user: { id: getDeviceId() }, // Use device-specific ID
    clerkUser: null,
    isLoading: false,
    isAuthenticated: true, // Always authenticated (public access)
  };
}
