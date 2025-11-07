// Clerk Authentication setup for Express
// Replaces Replit Auth to enable deployment from GitHub to any platform

import { clerkMiddleware, createClerkClient, requireAuth, getAuth } from "@clerk/express";
import type { Express, RequestHandler } from "express";

// Initialize Clerk client
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

/**
 * Setup Clerk authentication middleware
 * This replaces the Replit Auth setup
 */
export async function setupAuth(app: Express) {
  // Apply Clerk middleware globally to all routes
  // This attaches auth information to req.auth
  app.use(clerkMiddleware());
  
  // No additional routes needed - Clerk handles auth UI in the frontend
  // Just return to continue server setup
  return app;
}

/**
 * Middleware to require authentication for protected routes
 * Replaces the isAuthenticated middleware from Replit Auth
 */
export const isAuthenticated: RequestHandler = (req, res, next) => {
  const auth = getAuth(req);
  
  if (!auth.userId) {
    return res.status(401).json({ message: "Unauthorized - Please sign in" });
  }
  
  // Attach user ID to request for easy access in routes
  (req as any).user = {
    claims: {
      sub: auth.userId,
    },
  };
  
  next();
};

/**
 * Get user ID from authenticated request
 * Helper function for routes
 */
export function getUserId(req: any): string {
  const auth = getAuth(req);
  return auth.userId || "";
}
