// Generate and store a unique device ID for this browser
// This allows public access while maintaining data isolation per device

import { nanoid } from "nanoid";

const DEVICE_ID_KEY = "learning-journal-device-id";

// Lazily get device ID - only works in browser environment
export function getDeviceId(): string {
  // Guard for non-browser environments (SSR, Node, service workers)
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    // Return a temporary ID for non-browser contexts
    return `temp-${nanoid()}`;
  }
  
  // Check if we already have a device ID in localStorage
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // Generate a new unique ID for this device/browser
    deviceId = `device-${nanoid()}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}
