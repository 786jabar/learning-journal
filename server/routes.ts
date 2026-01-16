import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJournalEntrySchema, insertProjectSchema, insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";
import PDFDocument from "pdfkit";

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

  // GET /api/download-portfolio - Generate and download complete portfolio PDF
  app.get("/api/download-portfolio", async (req: Request, res: Response) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="FGCT6021_Portfolio_Complete.pdf"');
      
      doc.pipe(res);
      
      const pageWidth = 595.28;
      const margin = 50;
      const contentWidth = pageWidth - 2 * margin;

      // Cover Page
      doc.fontSize(14).font('Helvetica-Bold').text('UNIVERSITY FOR THE CREATIVE ARTS', { align: 'center' });
      doc.moveDown(4);
      doc.fontSize(24).text('Portfolio', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text('FGCT6021 Mobile Application Development', { align: 'center' });
      doc.moveDown(4);
      doc.fontSize(16).font('Helvetica-Bold').text('Your Name', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text('BSc Computer Science', { align: 'center' });
      doc.moveDown(3);
      doc.text('January 2026', { align: 'center' });
      
      // Declaration
      doc.moveDown(6);
      doc.fontSize(9).font('Helvetica');
      doc.text('I, Your Name, confirm that the work presented in this portfolio is my own. ChatGPT (OpenAI) was used to paraphrase selected sentences and review grammar to improve the clarity of the writing. Where information has been derived from other sources, I confirm that this has been indicated in the portfolio.', { width: contentWidth });
      doc.moveDown(1);
      doc.text('© 2026, Your Name');
      doc.text('School of Games & Creative Technology');
      doc.text('University for the Creative Arts');

      // Table of Contents
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('Contents');
      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica');
      const toc = [
        '1   Introduction',
        '2   Lab 1 – Introduction to Mobile App',
        '3   Lab 2 – Frontend Fundamentals',
        '4   Lab 3 – JavaScript & DOM Manipulation',
        '5   Lab 4 – API',
        '6   Lab 5 – Python & JSON',
        '7   Lab 6 – Frontend & Backend',
        '8   Lab 7 – PWA',
        '9   Mini Project',
        'Appendices',
        'Bibliography'
      ];
      toc.forEach(item => {
        doc.text(item);
        doc.moveDown(0.3);
      });

      // Introduction
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('1   Introduction');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(
        `This portfolio documents the development of my Learning Journal Progressive Web Application (PWA) for the FGCT6021 Mobile Application Development module. The project demonstrates a full-stack web application built with modern technologies including React, TypeScript, Express.js, and PostgreSQL, featuring offline-first architecture and PWA capabilities.

The main objectives of this project were to create a functional learning journal that allows users to track their learning progress, document projects, and reflect on their development journey. The application supports offline functionality through service workers and IndexedDB, ensuring users can access their data without an internet connection.

Throughout this project, I developed skills in frontend development with React and Tailwind CSS, backend API design with Express.js, database management with Drizzle ORM and PostgreSQL, and PWA implementation including service workers and manifest configuration. Key challenges included implementing offline data synchronization, creating an intuitive user interface, and integrating multiple APIs for enhanced functionality.

This portfolio reflects on each lab's learning outcomes and documents the mini project extension - a Candy Rush Saga game that demonstrates advanced JavaScript skills and creative problem-solving.`,
        { width: contentWidth }
      );

      // Lab 1
      doc.moveDown(1.5);
      doc.fontSize(14).font('Helvetica-Bold').text('2   Lab 1 – Introduction to Mobile App');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(
        `In Lab 1, I set up the foundational development environment for the Learning Journal PWA. I began by creating a GitHub repository to manage version control, ensuring all code changes were tracked with meaningful commit messages. Using VS Code as my primary IDE, I configured essential extensions including ESLint, Prettier, and the TypeScript compiler for improved code quality.

I explored PythonAnywhere as a potential deployment platform, understanding how to host Flask applications and serve static files. While my final deployment uses a different approach, this experience was valuable for understanding web hosting concepts.

For Android development exploration, I installed Android Studio and examined how PWAs can be packaged as Android applications using Trusted Web Activities (TWA). I ran sample Kotlin code to understand the basics of native Android development and how it compares to web-based approaches.

The PWA concepts I learned included understanding the role of manifest files for installability, service workers for offline caching, and the app shell architecture pattern. These concepts formed the foundation for later labs where I implemented these features in my Learning Journal.

Challenges I faced included configuring Git credentials correctly and understanding the relationship between local development and remote repositories. I resolved these by carefully reading documentation and using SSH keys for authentication.

GitHub Repository: https://github.com/yourusername/learning-journal-pwa
Live Project: https://yourusername.pythonanywhere.com`,
        { width: contentWidth }
      );

      // Lab 2
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('3   Lab 2 – Frontend Fundamentals');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('3.1 How did you approach mobile-first design?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I approached mobile-first design by starting with the smallest viewport and progressively enhancing for larger screens. Using Tailwind CSS, I implemented responsive breakpoints (sm, md, lg, xl) to adjust layouts. For example, the navigation uses a horizontal scroll on mobile and a full navbar on desktop. Cards stack vertically on mobile but display in grids on larger screens. I ensured touch targets were at least 44px for accessibility and used flexible layouts with Flexbox and CSS Grid to adapt content to any screen size.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('3.2 What was the most useful HTML or CSS concept you applied this week?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `The most useful CSS concept was Flexbox combined with CSS Grid for creating responsive layouts. Flexbox allowed me to easily center content, distribute space between elements, and create flexible navigation bars. I used "flex-wrap" to handle overflow gracefully on smaller screens. For the dashboard layout, CSS Grid enabled me to create complex multi-column layouts that automatically adjust. The combination of "gap" property with Flexbox simplified spacing between elements without complex margin calculations.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('3.3 What part of HTML or CSS did you find most challenging or confusing?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `The most challenging aspect was achieving consistent styling across different browsers and understanding CSS specificity. Initially, I struggled with z-index stacking contexts, especially for sticky headers and modal overlays. I also found it confusing to manage responsive images that maintain aspect ratios while fitting their containers. I overcame these challenges by using Tailwind's utility classes which abstract away browser inconsistencies, and by carefully planning my component hierarchy to avoid z-index conflicts.`,
        { width: contentWidth }
      );

      // Lab 3
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('4   Lab 3 – JavaScript & DOM Manipulation');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('4.1 Which DOM selection methods did you use, and why did you choose them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I primarily used document.getElementById() for accessing unique elements like the theme toggle button and date display, as it provides fast, direct access to specific elements. For collections of similar elements, I used document.querySelectorAll() which returns a NodeList that I could iterate over using forEach(). I also used querySelector() for CSS selector-based selection when I needed more complex targeting. These methods were chosen for their clarity and efficiency - getElementById for unique elements, querySelectorAll for multiple elements with shared characteristics.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('4.2 What was the most challenging part about linking JavaScript with your HTML?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `The most challenging part was managing event listeners and ensuring they were properly attached after DOM elements were rendered. Initially, my JavaScript ran before the HTML loaded, causing null reference errors. I solved this by either placing scripts at the end of the body or using DOMContentLoaded event listeners. Another challenge was understanding event propagation (bubbling and capturing) when implementing click handlers on nested elements. I used event.stopPropagation() and event delegation patterns to handle these scenarios correctly.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('4.3 How did you test and debug your JavaScript code?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I tested my JavaScript code using browser developer tools, primarily the Console tab for logging values and checking for errors. I used console.log() extensively to track variable values and execution flow. For debugging, I set breakpoints in the Sources tab to step through code line by line. I also used try-catch blocks to handle potential errors gracefully and display meaningful error messages. Chrome DevTools' network tab helped me verify API calls were working correctly, while the Elements tab confirmed DOM manipulations were applied as expected.`,
        { width: contentWidth }
      );

      // Lab 4
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('5   Lab 4 – API');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('5.1 Which Storage, Browser, and Third-Party APIs did you choose, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `For Storage APIs, I chose IndexedDB via the localforage library for persistent offline storage of journal entries and projects. I also used localStorage for simple key-value pairs like user preferences and theme settings. For Browser APIs, I integrated the Clipboard API for copy-to-clipboard functionality, the Notifications API for reminders and alerts, and the Geolocation API to record location data with entries. For Third-Party APIs, I integrated the Open-Meteo Weather API (no key required), the GitHub API for displaying user profiles, and experimented with news APIs for tech updates.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('5.2 How did you integrate each API with DOM manipulation?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `Each API integration involved DOM manipulation to display results. For the Weather API, I fetched data using the Fetch API, parsed the JSON response, and dynamically created elements to display temperature, humidity, and weather icons. The GitHub API integration updates user profile cards by populating img src attributes for avatars and textContent for stats. Clipboard API integration attached event listeners to copy buttons that write text to the clipboard and update button states. I used loading spinners and skeleton states while data was being fetched.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('5.3 What challenges did you encounter, and how did you solve them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `The main challenges were handling API errors gracefully and managing asynchronous operations. Network failures could crash the app, so I implemented try-catch blocks with user-friendly error messages. CORS issues arose with some APIs, which I resolved by either using CORS proxies or finding APIs with permissive headers. Rate limiting on the GitHub API required caching responses in localStorage. For geolocation, I handled permission denials by showing alternative content and explaining why location access enhances the experience.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('5.4 In what ways do these APIs improve your Learning Journal PWA?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `These APIs significantly improved my PWA by enabling offline functionality, personalization, and real-time data. IndexedDB allows users to create and view journal entries offline, syncing when connectivity returns. The Weather API adds contextual information to entries, showing what the weather was like during study sessions. Notifications keep users engaged with study reminders. The GitHub API creates a connected experience by displaying the user's coding activity. Together, these APIs transform a simple journal into a comprehensive learning companion.`,
        { width: contentWidth }
      );

      // Lab 5
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('6   Lab 5 – Python & JSON');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('6.1 How is storing data in a JSON file different from using browser storage?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `JSON file storage differs from browser storage in several key ways. JSON files are stored on the server, making data accessible across different devices and browsers, whereas localStorage/IndexedDB are client-side and device-specific. JSON files can be easily backed up, version-controlled with Git, and shared between users. However, browser storage is faster for read/write operations since it doesn't require network requests. JSON files require server-side processing to modify, while browser storage can be manipulated directly by JavaScript. For my PWA, I use both: browser storage for offline access and JSON for server-side persistence.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('6.2 How did you use Python to create or update your JSON file?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I created a Python script that manages the JSON file using the json module. The script reads the existing JSON file, parses it into a Python dictionary, modifies the data (adding, updating, or deleting entries), then writes the updated dictionary back to the file. I used Flask routes to expose these operations as API endpoints. For example, a POST request triggers the script to append a new reflection to the JSON array, assign it an auto-incremented ID, and save the file. Error handling ensures the file is properly closed even if an exception occurs.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('6.3 What does your PWA show locally, and what will users see on GitHub? Are they the same? Why or why not?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `Locally, my PWA shows data from both IndexedDB (for offline-first access) and the server API (for synced data). Users see their locally-cached entries immediately, with updates fetched from the server when online. On GitHub Pages, users would see only the static JSON file content at the time of deployment - it cannot be dynamically updated. This is because GitHub Pages serves static files only; there's no server to process write requests. For dynamic functionality, I deploy to PythonAnywhere where Flask can handle read/write operations to the JSON file.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('6.4 What extra feature did you add to your PWA using the JSON file, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I added a reflections feature that allows users to write daily learning reflections categorized by topic. These reflections are stored in a JSON file and can be filtered, searched, and exported. The JSON structure includes ID, author name, reflection text, category, and timestamp. This feature complements the main journal by providing a quick-capture option for brief thoughts and insights. Users can review their reflections over time to identify learning patterns and track their progress across different subjects.`,
        { width: contentWidth }
      );

      // Lab 6
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('7   Lab 6 – Frontend & Backend');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('7.1 Why is the frontend–backend connection important?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `The frontend-backend connection is essential because it separates concerns and enables data persistence. The frontend handles user interface and user experience, while the backend manages data storage, business logic, and security. This separation allows the frontend to be a lightweight PWA that works offline, while the backend ensures data is safely stored and synchronized. Without a backend, all data would be lost when browser storage is cleared. The connection also enables features like user authentication, data validation, and serving different data to different users.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('7.2 Which HTTP methods did you use in Flask, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I used four HTTP methods in my Flask backend: GET retrieves data (fetching all reflections or a specific one by ID), POST creates new records (adding a new reflection with validation), PUT updates existing records (modifying a reflection's content or category), and DELETE removes records. I chose these methods following REST conventions for clarity and predictability. GET is idempotent and safe for data retrieval, POST for creation, PUT for full updates, and DELETE for removal. Each endpoint returns appropriate status codes (200, 201, 404, 500) to indicate success or failure.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('7.3 What is the difference between using Flask to store and load JSON data and reading JSON directly in the browser?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `Using Flask to handle JSON data provides server-side security, validation, and persistence that browser-based reading cannot offer. Flask can validate data before saving, prevent malicious input, and maintain data integrity across sessions. Reading JSON directly in the browser exposes the entire file to users and cannot prevent tampering. Flask also enables multi-user scenarios where each user's data is kept separate. However, browser-based JSON reading is faster for read-only data that doesn't need protection, making it suitable for static configuration files or public data.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('7.4 Did you face any difficulties when running your project on PythonAnywhere? How did you handle them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `On PythonAnywhere, I initially faced issues with file paths - the working directory was different from local development. I resolved this by using os.path.abspath() to construct absolute paths to my JSON files. Another challenge was CORS errors when my frontend tried to access the Flask API from a different domain. I added Flask-CORS and configured it to allow requests from my frontend URL. I also had to ensure the virtual environment had all required packages installed using pip. The web app configuration required specifying the correct WSGI file path.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('7.5 What extra feature did you build into your PWA with Flask, and why did you add it?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I built a full CRUD (Create, Read, Update, Delete) management system for learning reflections with Flask. This feature allows users to write reflections, categorize them by topic, edit existing entries, and delete unwanted ones. I added this because a complete journal needs all CRUD operations - not just creating entries. The search functionality filters reflections by content, making it easy to find past thoughts on specific topics. I also added data export to JSON format, allowing users to backup their reflections or migrate to another platform.`,
        { width: contentWidth }
      );

      // Lab 7
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('8   Lab 7 – PWA');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('8.1 Why is it useful to enhance your Flask app with PWA features?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `Enhancing a Flask app with PWA features provides significant benefits: offline access, installability, and app-like experience. Users can continue accessing their journal entries even without internet connectivity - crucial for students who may study in areas with poor connectivity. The install-to-home-screen feature makes the app feel native and easily accessible without opening a browser. Push notifications can remind users to write journal entries. Service workers improve performance by caching assets and API responses, reducing load times on repeat visits.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('8.2 What did you use to support offline access and dynamic data?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `For offline access, I implemented a service worker that caches static assets (HTML, CSS, JavaScript, images) using a cache-first strategy. For dynamic data, I use IndexedDB via the localforage library to store journal entries and projects locally. When offline, the app reads from IndexedDB; when online, it syncs with the server. I implemented a sync queue that tracks changes made offline and pushes them to the server when connectivity returns. The service worker also implements a network-first strategy for API calls, falling back to cached responses when the network fails.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('8.3 What extra feature did you add, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I added a comprehensive PWA demo page that showcases all PWA features in one place. Users can check their online/offline status, view service worker registration status, see cached resources, trigger the install prompt, and test offline functionality. I also added a visual indicator in the navbar showing connection status. This feature helps users understand and appreciate the PWA capabilities, and serves as a debugging tool during development. The demo includes buttons to manually trigger cache updates and view cache contents.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('8.4 Did you face any challenges deploying your PWA, and how did you solve them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `The main deployment challenge was ensuring the service worker scope was correctly configured. Initially, the service worker only cached the root path, missing nested routes. I fixed this by adjusting the scope in the registration call and updating the service worker's fetch event to handle all routes. Another challenge was cache versioning - old cached files persisted after updates. I implemented cache busting by including version numbers in cache names and adding logic to delete outdated caches on activation. Testing offline mode required using Chrome DevTools' offline simulation.`,
        { width: contentWidth }
      );

      // Mini Project
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('9   Mini Project');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('9.1 What additional features did you add to your Learning Journal?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I added several significant features to enhance the Learning Journal beyond the core requirements:

1. Candy Rush Saga Game: A fully-featured match-3 puzzle game with multiple levels, objectives, power-ups, and a scoring system. The game features candy animations, special candies (striped, wrapped, color bomb), blockers like jellies and ice, and progressive difficulty across levels. Players can earn stars and compete for high scores.

2. Analytics Dashboard: A comprehensive analytics page showing learning streaks, weekly entry trends using Recharts visualizations, tag clouds for topic analysis, and activity heatmaps similar to GitHub's contribution graph.

3. Achievements System: A gamification system that tracks user progress and awards badges for milestones like writing streaks, completing projects, and consistent journaling. This motivates users to maintain their learning habits.

4. Drawing Canvas: An interactive canvas using the Canvas API where users can create visual notes and sketches to accompany their journal entries, supporting different brush sizes and colors.

5. Enhanced Journal Features: Rich markdown editor with preview, tag management, search and filter functionality, and PDF export capabilities for sharing or printing entries.

6. PWA Enhancements: Comprehensive offline support, install prompts, network status indicators, and a service worker management interface for debugging.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('9.2 Why did you choose your mini project idea?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I chose to create the Candy Rush Saga game as my mini project for several strategic reasons:

Technical Challenge: Match-3 games require complex algorithms including cascade detection, match finding across rows and columns, gravity simulation for falling pieces, and special candy combinations. This allowed me to demonstrate advanced JavaScript programming skills beyond basic DOM manipulation.

User Engagement: A game adds entertainment value to the learning journal, making users more likely to return to the app regularly. The gamification aspect connects to the achievement system, rewarding users for their learning consistency.

Canvas API Exploration: Building the game deepened my understanding of the HTML5 Canvas API, animation frames, and game loop patterns - skills applicable to data visualization and interactive features.

Creative Expression: The course encourages creative extensions, and a game showcases both technical ability and design thinking. The level progression system, visual effects, and user interface design required careful planning and iteration.

Portfolio Value: A polished game is an impressive portfolio piece that demonstrates my ability to take on complex projects and see them through to completion.`,
        { width: contentWidth }
      );
      
      doc.addPage();
      doc.fontSize(10).font('Helvetica-Bold').text('9.3 What technical challenges did you face and how did you solve them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `I faced several significant technical challenges during development:

Match-3 Algorithm: Implementing the match detection logic that finds all horizontal and vertical matches of 3+ candies was complex. I solved this by creating a two-pass algorithm - first scanning rows, then columns, and collecting all matched positions in a Set to avoid duplicates.

Cascade System: After matches are cleared, remaining candies must fall and new ones must spawn, potentially creating new matches. I implemented a recursive cascade function that continues until no new matches are found, with proper animation timing using async/await and setTimeout.

State Management: Managing the game state (board, score, moves, objectives, power-ups) became complex. I organized state using React's useState with structured objects and created helper functions for each game action, making the code more maintainable.

Performance Optimization: Initial implementations caused performance issues with re-renders. I optimized by using React.memo for grid cells, batching state updates, and implementing efficient board comparison algorithms.

Offline Synchronization: Ensuring data syncs correctly between IndexedDB and the server required careful handling of conflict resolution and queue management. I implemented a last-write-wins strategy with timestamps.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('9.4 What would you improve if given more time?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `Given more time, I would implement these improvements:

Multiplayer Features: Add real-time multiplayer modes where users can compete in puzzle challenges or collaborate on learning goals. This would require WebSocket integration for live updates.

AI-Powered Features: Integrate AI to provide personalized learning recommendations based on journal entry analysis, suggest related topics, or summarize weekly progress automatically.

Mobile App Packaging: Create native Android and iOS apps using Capacitor or React Native, providing better device integration including native notifications, camera access for photo journals, and better offline sync.

Social Features: Enable users to share achievements, follow other learners, and create study groups within the app. This would transform the personal journal into a learning community.

Advanced Analytics: Implement machine learning to identify learning patterns, predict optimal study times, and track skill progression over time with more sophisticated visualizations.

Voice Notes: Add audio recording capabilities for voice journal entries, with speech-to-text transcription for searchability.

Accessibility Improvements: Conduct thorough accessibility auditing and implement WCAG 2.1 AA compliance, including screen reader optimization and keyboard navigation.`,
        { width: contentWidth }
      );

      // Appendices
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('Appendices');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(
        `Appendix A: Technology Stack
- Frontend: React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- Backend: Node.js, Express.js, Drizzle ORM
- Database: PostgreSQL (Neon), IndexedDB (localforage)
- PWA: Service Workers, Web App Manifest, Workbox
- Build Tools: Vite, ESBuild

Appendix B: Key Features Summary
1. Journal Entries with Markdown support
2. Project Tracking with tech stack tags
3. Analytics Dashboard with visualizations
4. Achievements and Gamification
5. Candy Rush Saga Game (10+ levels)
6. Drawing Canvas
7. Offline-first Architecture
8. PWA Installability

Appendix C: API Endpoints
- GET/POST /api/journals - Journal CRUD
- GET/POST /api/projects - Project CRUD
- GET/POST /api/lab6-reflections - Reflection CRUD
- GET/PUT /api/profile - User profile

Appendix D: Screenshots
[Include screenshots of: Home Dashboard, Journal Entry Page, Analytics Charts, Candy Game, PWA Install Process, Offline Mode]`,
        { width: contentWidth }
      );

      // Bibliography
      doc.moveDown(1.5);
      doc.fontSize(14).font('Helvetica-Bold').text('Bibliography');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(
        `1. Mozilla Developer Network (MDN). (2024). Progressive Web Apps. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

2. React Documentation. (2024). React 18 Documentation. https://react.dev/

3. Tailwind CSS. (2024). Tailwind CSS Documentation. https://tailwindcss.com/docs

4. shadcn/ui. (2024). UI Component Library. https://ui.shadcn.com/

5. Drizzle ORM. (2024). TypeScript ORM Documentation. https://orm.drizzle.team/

6. Workbox. (2024). Service Worker Libraries. https://developers.google.com/web/tools/workbox

7. Open-Meteo. (2024). Free Weather API Documentation. https://open-meteo.com/en/docs

8. GitHub REST API. (2024). GitHub API Documentation. https://docs.github.com/en/rest

9. localforage. (2024). Offline Storage Library. https://localforage.github.io/localForage/

10. Recharts. (2024). React Charting Library. https://recharts.org/

11. jsPDF. (2024). PDF Generation Library. https://github.com/parallax/jsPDF

12. Vite. (2024). Next Generation Frontend Tooling. https://vitejs.dev/`,
        { width: contentWidth }
      );

      // Add page numbers
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(9).text(
          `${i + 1}`,
          0,
          doc.page.height - 30,
          { align: 'center', width: doc.page.width }
        );
      }

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
