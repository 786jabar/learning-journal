import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJournalEntrySchema, insertProjectSchema, insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";

// Helper to extract device ID from request headers
// Each device gets its own unique ID for data isolation
function getDeviceId(req: Request): string {
  const deviceId = req.headers["x-device-id"] as string;
  // Return a default guest ID if header is missing (for backward compatibility)
  return deviceId || "guest-fallback";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // No authentication - all routes are public
  // Data isolation is achieved through device-specific IDs

  // Journal Entry Routes (all public)
  
  // GET /api/journals - Get all journal entries
  app.get("/api/journals", async (req: any, res) => {
    try {
      const journals = await storage.getAllJournals(getDeviceId(req));
      res.json(journals);
    } catch (error) {
      console.error("Error fetching journals:", error);
      res.status(500).json({ error: "Failed to fetch journals" });
    }
  });

  // GET /api/journals/:id - Get single journal entry
  app.get("/api/journals/:id", async (req: any, res) => {
    try {
      const journal = await storage.getJournal(req.params.id, getDeviceId(req));
      if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
      }
      res.json(journal);
    } catch (error) {
      console.error("Error fetching journal:", error);
      res.status(500).json({ error: "Failed to fetch journal" });
    }
  });

  // POST /api/journals - Create new journal entry
  app.post("/api/journals", async (req: any, res) => {
    try {
      // Accept client-provided ID, createdAt, updatedAt for offline-first sync
      const data = {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : new Date(),
        createdAt: req.body.createdAt ? new Date(req.body.createdAt) : undefined,
        updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : undefined,
      };
      
      // Validate only the required fields
      insertJournalEntrySchema.parse({
        title: data.title,
        content: data.content,
        tags: data.tags,
        date: data.date,
      });
      
      const journal = await storage.createJournal(data, getDeviceId(req));
      res.status(201).json(journal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating journal:", error);
      res.status(500).json({ error: "Failed to create journal" });
    }
  });

  // PUT /api/journals/:id - Update journal entry
  app.put("/api/journals/:id", async (req: any, res) => {
    try {
      // Extract only the fields we need for validation, ignore id/createdAt/updatedAt
      const data = {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        date: req.body.date ? new Date(req.body.date) : new Date(),
      };
      
      // Validate the extracted fields
      insertJournalEntrySchema.parse(data);
      
      const journal = await storage.updateJournal(req.params.id, data, getDeviceId(req));
      if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
      }
      res.json(journal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error updating journal:", error);
      res.status(500).json({ error: "Failed to update journal" });
    }
  });

  // DELETE /api/journals/:id - Delete journal entry
  app.delete("/api/journals/:id", async (req: any, res) => {
    try {
      const success = await storage.deleteJournal(req.params.id, getDeviceId(req));
      if (!success) {
        return res.status(404).json({ error: "Journal not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting journal:", error);
      res.status(500).json({ error: "Failed to delete journal" });
    }
  });

  // Project Routes (all public)
  
  // GET /api/projects - Get all projects
  app.get("/api/projects", async (req: any, res) => {
    try {
      const projects = await storage.getAllProjects(getDeviceId(req));
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // GET /api/projects/:id - Get single project
  app.get("/api/projects/:id", async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id, getDeviceId(req));
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // POST /api/projects - Create new project
  app.post("/api/projects", async (req: any, res) => {
    try {
      // Accept client-provided ID, createdAt, updatedAt for offline-first sync
      const data = {
        ...req.body,
        createdAt: req.body.createdAt ? new Date(req.body.createdAt) : undefined,
        updatedAt: req.body.updatedAt ? new Date(req.body.updatedAt) : undefined,
      };
      
      // Validate only the required fields
      insertProjectSchema.parse({
        name: data.name,
        description: data.description,
        techStack: data.techStack,
      });
      
      const project = await storage.createProject(data, getDeviceId(req));
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // PUT /api/projects/:id - Update project
  app.put("/api/projects/:id", async (req: any, res) => {
    try {
      // Extract only the fields we need for validation, ignore id/createdAt/updatedAt
      const data = {
        name: req.body.name,
        description: req.body.description,
        techStack: req.body.techStack,
      };
      
      // Validate the extracted fields
      insertProjectSchema.parse(data);
      
      const project = await storage.updateProject(req.params.id, data, getDeviceId(req));
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  // DELETE /api/projects/:id - Delete project
  app.delete("/api/projects/:id", async (req: any, res) => {
    try {
      const success = await storage.deleteProject(req.params.id, getDeviceId(req));
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // User Profile Routes (all public)
  
  // GET /api/profile - Get user profile
  app.get("/api/profile", async (req: any, res) => {
    try {
      const profile = await storage.getProfile(getDeviceId(req));
      res.json(profile || null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // POST /api/profile - Create or update user profile
  app.post("/api/profile", async (req: any, res) => {
    try {
      insertUserProfileSchema.parse(req.body);
      const profile = await storage.createOrUpdateProfile(req.body, getDeviceId(req));
      res.status(200).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      console.error("Error saving profile:", error);
      res.status(500).json({ error: "Failed to save profile" });
    }
  });

  // Lab 5: Python & JSON Backend Routes
  
  // POST /api/save-reflection - Save a reflection entry
  app.post("/api/save-reflection", async (req: any, res) => {
    try {
      // In a production environment, this would call a Python backend
      // For now, we store in memory and return success
      const { text, category, date } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Reflection text is required" });
      }

      // Return success response
      res.status(201).json({
        success: true,
        message: "Reflection saved successfully",
        entry: {
          text,
          category: category || "general",
          date: date || new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error saving reflection:", error);
      res.status(500).json({ error: "Failed to save reflection" });
    }
  });

  // Lab 6: Frontend & Backend Integration (Flask-like REST API)
  // In-memory storage for demo purposes
  const lab6Reflections: any[] = [
    {
      id: 1,
      name: "Sample User",
      date: new Date().toLocaleDateString(),
      reflection: "This is a sample reflection. Try adding more reflections using the form above!"
    }
  ];
  let nextId = 2;

  // GET /api/lab6-reflections - Get all reflections
  app.get("/api/lab6-reflections", async (req: any, res) => {
    try {
      res.json(lab6Reflections);
    } catch (error) {
      console.error("Error fetching reflections:", error);
      res.status(500).json({ error: "Failed to fetch reflections" });
    }
  });

  // POST /api/lab6-reflections - Create new reflection
  app.post("/api/lab6-reflections", async (req: any, res) => {
    try {
      const { name, reflection } = req.body;

      if (!name || !reflection) {
        return res.status(400).json({ error: "Name and reflection are required" });
      }

      const newReflection = {
        id: nextId++,
        name,
        date: new Date().toLocaleDateString(),
        reflection
      };

      lab6Reflections.push(newReflection);
      res.status(201).json(newReflection);
    } catch (error) {
      console.error("Error creating reflection:", error);
      res.status(500).json({ error: "Failed to create reflection" });
    }
  });

  // PUT /api/lab6-reflections/:id - Update reflection
  app.put("/api/lab6-reflections/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { name, reflection } = req.body;

      if (!name || !reflection) {
        return res.status(400).json({ error: "Name and reflection are required" });
      }

      const reflectionIndex = lab6Reflections.findIndex(r => r.id === id);
      if (reflectionIndex === -1) {
        return res.status(404).json({ error: "Reflection not found" });
      }

      lab6Reflections[reflectionIndex] = {
        ...lab6Reflections[reflectionIndex],
        name,
        reflection
      };

      res.json(lab6Reflections[reflectionIndex]);
    } catch (error) {
      console.error("Error updating reflection:", error);
      res.status(500).json({ error: "Failed to update reflection" });
    }
  });

  // DELETE /api/lab6-reflections/:id - Delete reflection
  app.delete("/api/lab6-reflections/:id", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const reflectionIndex = lab6Reflections.findIndex(r => r.id === id);

      if (reflectionIndex === -1) {
        return res.status(404).json({ error: "Reflection not found" });
      }

      lab6Reflections.splice(reflectionIndex, 1);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting reflection:", error);
      res.status(500).json({ error: "Failed to delete reflection" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
