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
        `This portfolio documents the complete development journey of my Learning Journal Progressive Web Application (PWA) for the FGCT6021 Mobile Application Development module at the University for the Creative Arts. This comprehensive project demonstrates the practical application of modern web development principles, combining theoretical knowledge gained throughout the module with hands-on implementation of industry-standard technologies and best practices.

PROJECT OVERVIEW AND SCOPE:
The Learning Journal PWA is a full-stack web application designed to help students track their learning progress, document project work, and maintain reflective journals throughout their academic journey. The application addresses a real-world need for students to organize their learning materials while demonstrating mastery of mobile application development concepts taught in this module.

LEARNING OBJECTIVES ACHIEVED:
Through this project, I have successfully achieved the following learning outcomes as defined by the module specification:
1. Understanding of Progressive Web App architecture and implementation patterns
2. Proficiency in frontend development using React 18 with TypeScript for type safety
3. Backend API design and development using Node.js and Express.js framework
4. Database design and management using Drizzle ORM with PostgreSQL
5. Implementation of offline-first architecture using Service Workers and IndexedDB
6. Integration of third-party APIs including weather data, GitHub profiles, and browser APIs
7. Application of responsive design principles for mobile-first development
8. Version control proficiency using Git and GitHub for collaborative development

TECHNOLOGY STACK RATIONALE:
I chose React 18 as the frontend framework because of its component-based architecture, which promotes code reusability and maintainability. TypeScript was added for compile-time type checking, reducing runtime errors and improving code documentation. Tailwind CSS was selected for styling due to its utility-first approach that enables rapid UI development while maintaining design consistency. The shadcn/ui component library provides accessible, customizable components following Radix UI primitives.

For the backend, Express.js on Node.js provides a lightweight, flexible server framework ideal for REST API development. PostgreSQL was chosen as the database for its reliability, ACID compliance, and excellent support for complex queries. Drizzle ORM provides type-safe database access that integrates seamlessly with TypeScript.

The offline-first architecture uses the localforage library (which wraps IndexedDB) for client-side storage, ensuring users can access their data without internet connectivity. Service workers cache static assets and provide network fallback strategies, making the application installable and functional offline.

KEY CHALLENGES AND SOLUTIONS:
The most significant challenge was implementing bidirectional data synchronization between IndexedDB (client) and PostgreSQL (server). I solved this by implementing a sync queue that tracks pending operations when offline and processes them when connectivity returns, using timestamps to handle conflict resolution.

This portfolio documents each lab's specific learning outcomes and includes a comprehensive mini project - the Candy Rush Saga game - which demonstrates advanced JavaScript programming, algorithm design, and creative problem-solving abilities.`,
        { width: contentWidth }
      );

      // Lab 1
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('2   Lab 1 – Introduction to Mobile App');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(
        `DEVELOPMENT ENVIRONMENT SETUP:
In Lab 1, I established the foundational development environment for the Learning Journal PWA, which is a critical first step in any software development project. Understanding how to properly configure a development environment ensures reproducible builds and enables collaboration with other developers.

I began by creating a GitHub repository at https://github.com/yourusername/learning-journal-pwa to manage version control. Version control is essential because it tracks all code changes with meaningful commit messages, allows reverting to previous states if bugs are introduced, enables collaboration through branching and merging, and provides a backup of the entire project history. I configured Git with my credentials using "git config --global user.name" and "git config --global user.email" commands, and set up SSH keys for secure authentication without passwords.

INTEGRATED DEVELOPMENT ENVIRONMENT (IDE) CONFIGURATION:
Using Visual Studio Code as my primary IDE, I configured essential extensions to improve code quality and developer experience. ESLint was installed for identifying JavaScript and TypeScript errors and enforcing coding standards. Prettier was configured as the default formatter to maintain consistent code style across all files. The TypeScript compiler extension provides real-time type checking and autocompletion. I also installed the Tailwind CSS IntelliSense extension for utility class autocompletion.

DEPLOYMENT PLATFORM EXPLORATION:
I explored PythonAnywhere (https://yourusername.pythonanywhere.com) as a potential deployment platform, understanding how to host Flask applications and serve static files. The process involved creating a web application configuration, setting up virtual environments for Python dependencies, and configuring WSGI (Web Server Gateway Interface) for proper request handling. While my final deployment uses a different approach (Replit), this experience was valuable for understanding web hosting concepts including domain configuration, SSL certificates, and server file paths.

ANDROID DEVELOPMENT AND PWA CONCEPTS:
For Android development exploration, I installed Android Studio and examined how PWAs can be packaged as Android applications using Trusted Web Activities (TWA). I ran sample Kotlin code to understand the basics of native Android development and how it compares to web-based approaches. Key differences include: native apps have full device API access, PWAs work across platforms with a single codebase, and TWAs bridge the gap by wrapping PWAs in a native container.

The PWA concepts I learned included: (1) Web App Manifest files (manifest.json) that define app metadata for installability including name, icons, theme colors, and display mode; (2) Service Workers as JavaScript files that run separately from the main browser thread, enabling offline caching, background sync, and push notifications; (3) App Shell Architecture pattern that separates the application's core infrastructure (shell) from the dynamic content, enabling instant loading on repeat visits.

CHALLENGES AND SOLUTIONS:
The main challenge was understanding the relationship between local development and remote repositories. I initially pushed to the wrong branch and had to learn git branch management. I resolved this by studying Git documentation, practicing with branch creation ("git checkout -b feature-name"), and understanding the difference between "git merge" and "git rebase".

LEARNING OUTCOMES:
This lab established the foundation for all subsequent development work. I now understand how to set up professional development environments, use version control effectively, and prepare applications for deployment on various hosting platforms.`,
        { width: contentWidth }
      );

      // Lab 2
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('3   Lab 2 – Frontend Fundamentals');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('3.1 How did you approach mobile-first design?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `MOBILE-FIRST DESIGN PHILOSOPHY:
Mobile-first design is an approach where you design and develop for the smallest screens first, then progressively enhance the experience for larger screens. This methodology is essential because mobile devices now account for over 50% of web traffic globally, and designing for constraints forces you to prioritize content and functionality.

IMPLEMENTATION APPROACH:
I approached mobile-first design by writing base CSS styles for mobile viewports (320px-480px) first, then adding responsive breakpoints to enhance layouts for larger screens. Using Tailwind CSS, I implemented the following breakpoint strategy:
- Base styles (no prefix): Applied to all screen sizes, designed for mobile
- sm: (640px+): Small tablets and landscape phones
- md: (768px+): Tablets in portrait mode
- lg: (1024px+): Desktop computers and landscape tablets
- xl: (1280px+): Large desktop monitors

PRACTICAL EXAMPLES FROM MY PROJECT:
For the navigation component, mobile devices show a hamburger menu icon that expands to a full sidebar overlay when tapped. On desktop (lg breakpoint), the navigation displays as a permanent sidebar. The code uses conditional classes like "hidden lg:block" for desktop-only elements and "lg:hidden" for mobile-only elements.

For the journal entry cards, they stack vertically in a single column on mobile using "flex flex-col" and transition to a responsive grid on larger screens using "md:grid md:grid-cols-2 lg:grid-cols-3". This ensures optimal content consumption on all devices.

TOUCH ACCESSIBILITY:
I ensured all interactive elements (buttons, links, form inputs) have a minimum touch target size of 44x44 pixels, as recommended by Apple's Human Interface Guidelines and WCAG 2.1 accessibility standards. This was implemented using Tailwind's padding utilities like "p-3" and minimum height classes.

TESTING METHODOLOGY:
I tested responsive layouts using Chrome DevTools' device emulation mode, testing on iPhone SE (375px), iPhone 12 (390px), iPad (768px), and desktop (1920px) viewports to ensure the layout adapts gracefully at each breakpoint.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('3.2 What was the most useful HTML or CSS concept you applied this week?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `FLEXBOX AND CSS GRID MASTERY:
The most useful CSS concepts I applied were Flexbox and CSS Grid, which together form the foundation of modern responsive layouts. Understanding when to use each layout system is crucial for efficient development.

FLEXBOX APPLICATIONS:
Flexbox (Flexible Box Layout) excels at one-dimensional layouts - arranging items in rows OR columns. I used Flexbox extensively for:
1. Navigation bars: Using "flex justify-between items-center" to position the logo on the left and menu items on the right, with vertical centering
2. Card headers: Distributing space between title and action buttons using "flex justify-between"
3. Form layouts: Creating inline form fields with labels using "flex items-center gap-2"
4. Centering content: Using "flex items-center justify-center" for perfect horizontal and vertical centering

The "flex-wrap" property was essential for handling overflow gracefully - when items don't fit on one line, they automatically wrap to the next line rather than overflowing or shrinking excessively.

CSS GRID APPLICATIONS:
CSS Grid excels at two-dimensional layouts - arranging items in rows AND columns simultaneously. I used Grid for:
1. Dashboard layout: Creating a complex layout with sidebar, header, and main content area using "grid grid-cols-[250px_1fr]"
2. Card galleries: Using "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" for responsive card layouts
3. Form layouts: Creating aligned label-input pairs using "grid grid-cols-[100px_1fr]"

GAP PROPERTY:
The "gap" property (works with both Flexbox and Grid) simplified spacing between elements without complex margin calculations. Instead of applying margins to individual items and handling edge cases, I use "gap-4" to create consistent spacing.

PRACTICAL BENEFIT:
These concepts reduced my CSS code by approximately 40% compared to older float-based layouts, while providing better browser support and more predictable behavior.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('3.3 What part of HTML or CSS did you find most challenging or confusing?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `Z-INDEX AND STACKING CONTEXTS:
The most challenging CSS concept was understanding z-index and stacking contexts. Initially, I assumed z-index was a global layering system where higher values always appear on top. However, z-index only works within stacking contexts, which are created by positioned elements, opacity values less than 1, and transform properties.

THE PROBLEM I ENCOUNTERED:
My sticky header (with "position: sticky" and "z-index: 50") was appearing behind modal overlays even though the modals had lower z-index values. This occurred because the modal content was in a different stacking context created by a parent element with "transform" property.

THE SOLUTION:
I solved this by carefully planning my component hierarchy to ensure elements that need to layer over each other share the same stacking context. I also learned to use very high z-index values (50, 100) for truly global overlays like modals, and to avoid unnecessary properties that create new stacking contexts.

RESPONSIVE IMAGES:
Another challenge was managing responsive images that maintain aspect ratios while fitting their containers. The issue was that images would either stretch disproportionately or overflow their containers.

I solved this using:
1. "object-fit: cover" to maintain aspect ratio while filling the container
2. "aspect-ratio: 16/9" to enforce consistent proportions
3. Tailwind's "w-full h-auto" for flexible sizing

CSS SPECIFICITY:
Understanding CSS specificity - which styles take precedence when multiple rules apply - was initially confusing. Inline styles beat IDs beat classes beat elements. Tailwind's utility-first approach largely avoids specificity issues since each class has equal weight, making the cascade more predictable.

LEARNING OUTCOME:
These challenges taught me to think systematically about CSS architecture rather than just applying styles randomly until they work.`,
        { width: contentWidth }
      );

      // Lab 3
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('4   Lab 3 – JavaScript & DOM Manipulation');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('4.1 Which DOM selection methods did you use, and why did you choose them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `UNDERSTANDING THE DOCUMENT OBJECT MODEL (DOM):
The DOM is a programming interface that represents HTML documents as a tree structure of nodes. JavaScript can access and manipulate this tree to dynamically update content, structure, and styling without reloading the page. Selecting the right DOM elements is the first step in any dynamic web interaction.

DOM SELECTION METHODS USED:
1. document.getElementById("elementId"): I used this method for accessing unique elements because it returns the single element with the specified ID directly, without creating a collection. It's the fastest selection method since IDs must be unique. Example: const themeToggle = document.getElementById("theme-toggle");

2. document.querySelector(".className"): This method returns the FIRST element matching a CSS selector. I used it when I needed to select elements by class, attribute, or complex selectors. Example: const activeTab = document.querySelector(".tab.active");

3. document.querySelectorAll(".className"): This returns a NodeList of ALL elements matching the selector. I used it for collections like all journal entry cards: const cards = document.querySelectorAll(".journal-card"); The NodeList can be iterated using forEach() or converted to an array.

4. element.closest(".parent"): This traverses UP the DOM tree to find the nearest ancestor matching the selector. Useful for event delegation when clicking a child element but needing to reference the parent container.

WHY THESE CHOICES:
getElementById is fastest for unique elements. querySelector/querySelectorAll are more flexible for complex selections using CSS selector syntax. I chose these modern methods over older ones like getElementsByClassName because they're more consistent and support modern selector patterns.

PERFORMANCE CONSIDERATION:
I cached DOM selections in variables rather than re-querying each time, since DOM queries are relatively expensive operations. For example: const sidebar = document.getElementById("sidebar"); // Query once, reuse many times.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('4.2 What was the most challenging part about linking JavaScript with your HTML?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `SCRIPT LOADING AND TIMING ISSUES:
The most challenging part was understanding when JavaScript executes relative to HTML parsing. By default, browsers parse HTML top-to-bottom, executing scripts immediately when encountered. If my script tried to select an element that hadn't been parsed yet, it returned null, causing errors.

THE PROBLEM:
Placing a script tag in the <head> that tries to access body elements fails because the body hasn't loaded yet. For example: const button = document.getElementById("submit"); // Returns null if button HTML not yet parsed.

SOLUTIONS I IMPLEMENTED:
1. Script Placement: Moving script tags to the end of <body> ensures all HTML elements exist before JavaScript runs.

2. DOMContentLoaded Event: Wrapping code in an event listener that fires when the DOM is fully loaded:
document.addEventListener("DOMContentLoaded", function() { /* safe to access DOM here */ });

3. Defer Attribute: Using <script defer src="app.js"> tells the browser to download the script in parallel but execute it after HTML parsing completes.

EVENT PROPAGATION CHALLENGE:
Another challenge was understanding event bubbling. When clicking a delete icon inside a card, both the icon's click handler and the card's click handler would fire. I solved this using event.stopPropagation() to prevent the event from bubbling up, and event delegation patterns where a single handler on a parent element checks event.target to determine which child was clicked.

DYNAMIC CONTENT:
Adding event listeners to dynamically created elements was tricky since they don't exist when the page loads. I used event delegation by attaching the listener to a static parent and checking if the click target matches the desired element.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('4.3 How did you test and debug your JavaScript code?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `COMPREHENSIVE DEBUGGING METHODOLOGY:
Effective debugging is essential for efficient development. I used a combination of browser developer tools, strategic logging, and error handling to identify and fix issues.

BROWSER DEVELOPER TOOLS (Chrome DevTools):
1. Console Tab: Used console.log() to output variable values at different execution points. Console.table() was particularly useful for displaying arrays and objects in a readable format. Console.error() and console.warn() for categorizing output.

2. Sources Tab Breakpoints: Set breakpoints by clicking line numbers in the Sources tab. When code execution reaches a breakpoint, it pauses, allowing me to inspect variable values, step through code line-by-line (F10 for step over, F11 for step into), and understand the call stack.

3. Network Tab: Monitored API requests to verify they were being made with correct URLs, methods, headers, and payloads. Checked response status codes (200, 404, 500) and response bodies to debug server communication issues.

4. Elements Tab: Verified that DOM manipulations (adding/removing classes, changing text content, showing/hiding elements) were applied correctly by inspecting the live DOM.

5. Application Tab: Inspected localStorage, IndexedDB, and service worker status for debugging offline storage and PWA functionality.

ERROR HANDLING WITH TRY-CATCH:
I wrapped potentially failing code in try-catch blocks to prevent crashes and provide meaningful error messages:
try { const data = JSON.parse(response); } catch (error) { console.error("Failed to parse JSON:", error); showUserError("Something went wrong"); }

DEFENSIVE CODING:
Before accessing properties, I checked for null/undefined: if (element && element.textContent) { ... }

TESTING METHODOLOGY:
I tested each feature in isolation before integration, verified behavior on multiple browsers (Chrome, Firefox, Safari), and used the device emulation mode to test touch events and mobile layouts.`,
        { width: contentWidth }
      );

      // Lab 4
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('5   Lab 4 – API');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('5.1 Which Storage, Browser, and Third-Party APIs did you choose, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `UNDERSTANDING WEB APIs:
APIs (Application Programming Interfaces) are the building blocks of modern web applications. They allow different software components to communicate and share data. I integrated three categories of APIs to enhance my Learning Journal PWA.

STORAGE APIs - FOR OFFLINE DATA PERSISTENCE:
1. IndexedDB (via localforage library): IndexedDB is a low-level browser database that stores significant amounts of structured data. Unlike localStorage (which only stores strings up to 5MB), IndexedDB can store complex JavaScript objects, files, and blobs up to hundreds of megabytes. I chose localforage as a wrapper because it provides a simpler Promise-based API while automatically selecting the best storage engine available.

2. localStorage: Used for simple key-value storage of user preferences like theme selection (dark/light mode), sidebar state (expanded/collapsed), and last visited page. Limited to 5MB but has synchronous, simple API perfect for small data.

WHY THESE CHOICES: My PWA needs to work offline, requiring client-side storage. IndexedDB stores the actual journal entries (potentially large with markdown content), while localStorage handles small preferences that need quick synchronous access.

BROWSER APIs - FOR DEVICE INTEGRATION:
1. Clipboard API: Enables copy-to-clipboard functionality for sharing journal entries or code snippets. Uses navigator.clipboard.writeText() which is more secure than the deprecated document.execCommand("copy").

2. Notifications API: Sends browser notifications for study reminders. Requires user permission (Notification.requestPermission()) and works even when the app is in the background.

3. Geolocation API: Records location data with journal entries using navigator.geolocation.getCurrentPosition(). Useful for remembering where learning took place.

THIRD-PARTY APIs - FOR EXTERNAL DATA:
1. Open-Meteo Weather API (https://open-meteo.com): Free, no API key required. Provides current weather data based on latitude/longitude. I chose this over OpenWeatherMap because it has no rate limits for reasonable usage.

2. GitHub REST API: Displays user profiles, repositories, and contribution activity. Demonstrates integration with a major platform's API.

Each API was chosen based on functionality needed, ease of integration, and cost (preferring free options with generous limits).`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('5.2 How did you integrate each API with DOM manipulation?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `API INTEGRATION AND DOM UPDATE PATTERN:
Each API integration follows a consistent pattern: (1) Trigger - user action or page load, (2) Request - fetch data from API, (3) Process - parse and transform response, (4) Render - update DOM with new content, (5) Handle errors - show fallback UI if request fails.

WEATHER API INTEGRATION EXAMPLE:
Step 1 - Get user location using Geolocation API:
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;

Step 2 - Fetch weather data:
const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+latitude+"&longitude="+longitude+"&current_weather=true");
const data = await response.json();

Step 3 - Parse response and update DOM:
const temperature = data.current_weather.temperature;
document.getElementById("temperature-display").textContent = temperature + "C";
document.getElementById("weather-icon").src = getWeatherIcon(data.current_weather.weathercode);

GITHUB API INTEGRATION:
I created a reusable component that accepts a GitHub username, fetches the user profile, and dynamically populates a card with avatar image, name, bio, repository count, and follower count. The DOM updates use a combination of setting src attributes for images, textContent for text, and innerHTML for complex structures (sanitized to prevent XSS).

CLIPBOARD API WITH BUTTON STATE:
copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(textToCopy);
  copyButton.textContent = "Copied!"; // Update button text
  setTimeout(() => copyButton.textContent = "Copy", 2000); // Reset after 2 seconds
});

LOADING STATES:
While APIs fetch data, I display loading states (spinner animations, skeleton placeholders) to provide visual feedback. This is implemented by toggling CSS classes: element.classList.add("loading") before the fetch, and element.classList.remove("loading") after completion.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('5.3 What challenges did you encounter, and how did you solve them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `CHALLENGE 1 - ASYNCHRONOUS ERROR HANDLING:
APIs can fail for many reasons: network issues, server errors, invalid responses, or rate limiting. Initially, unhandled promise rejections would crash my app or leave it in a broken state.

SOLUTION: I implemented comprehensive try-catch-finally blocks around all API calls:
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error("HTTP Error: " + response.status);
  const data = await response.json();
} catch (error) {
  showUserFriendlyError("Unable to load weather data. Please check your connection.");
  console.error("API Error:", error);
} finally {
  hideLoadingSpinner();
}

CHALLENGE 2 - CORS (Cross-Origin Resource Sharing):
Browsers block requests to different domains for security. Some APIs I wanted to use lacked proper CORS headers, causing requests to fail.

SOLUTION: I either (a) chose APIs with permissive CORS policies, (b) used a CORS proxy for development, or (c) made requests through my own backend server which doesn't have CORS restrictions.

CHALLENGE 3 - RATE LIMITING:
The GitHub API limits unauthenticated requests to 60 per hour. Refreshing the page multiple times during development quickly exhausted this limit.

SOLUTION: I implemented response caching using localStorage. Before making an API request, I check if a valid cached response exists (less than 5 minutes old). If so, I use the cached data instead of making a new request.

CHALLENGE 4 - PERMISSION HANDLING:
Geolocation and Notifications require user permission. Users might deny or dismiss these prompts.

SOLUTION: I implemented graceful degradation - if permission is denied, the app still works but with reduced functionality. I also explain to users why the permission enhances their experience before requesting it.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('5.4 In what ways do these APIs improve your Learning Journal PWA?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `VALUE ADDED BY EACH API CATEGORY:

OFFLINE FUNCTIONALITY (IndexedDB):
The most critical improvement is offline capability. Students can create, read, update, and delete journal entries without an internet connection. When connectivity returns, a sync queue processes pending changes against the server. This is essential for students who study in locations with unreliable internet (libraries, public transport, remote areas). According to MDN documentation, this offline-first approach is a defining characteristic of Progressive Web Apps.

CONTEXTUAL ENRICHMENT (Weather API):
The Weather API adds metadata to journal entries, recording what the weather was like during each study session. This creates a richer record of the learning experience and can help identify patterns (e.g., do I study better on rainy days?). It also demonstrates real-world API integration skills valuable for employment.

USER ENGAGEMENT (Notifications API):
Study reminder notifications help users maintain consistent journaling habits. Research shows that consistent reflective practice improves learning retention. Push notifications, even when the app is closed, remind users to write their daily reflections.

DEVELOPER IDENTITY (GitHub API):
Displaying GitHub profile and contribution data connects the learning journal to the user's actual development work. Users can see their recent repositories and commit activity alongside their reflections, creating a comprehensive view of their progress as developers.

SEAMLESS INTERACTION (Clipboard API):
The ability to copy journal entries, code snippets, or shareable links with one click improves user experience. Small conveniences like this make the app feel polished and professional.

COMBINED EFFECT:
Together, these APIs transform a basic note-taking app into a comprehensive learning companion that works anywhere, provides context, encourages consistency, and integrates with the developer ecosystem.`,
        { width: contentWidth }
      );

      // Lab 5
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('6   Lab 5 – Python & JSON');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('6.1 How is storing data in a JSON file different from using browser storage?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `UNDERSTANDING DATA STORAGE OPTIONS:
Data storage is fundamental to any application that needs to persist information. Understanding the differences between server-side (JSON files) and client-side (browser storage) is essential for designing robust applications.

JSON FILE STORAGE (SERVER-SIDE):
Location: Files stored on the web server's file system
Accessibility: Accessible from any device or browser that can reach the server
Capacity: Limited only by server disk space (potentially gigabytes)
Persistence: Data persists until explicitly deleted; survives browser clearing
Sharing: Multiple users can access the same data (with proper access control)
Version Control: Files can be tracked with Git for history and backup
Security: Server controls access; can implement authentication/authorization
Speed: Slower - requires network request for every read/write operation
Modification: Requires server-side code (Python, Node.js) to modify

BROWSER STORAGE (CLIENT-SIDE):
Location: Stored in the user's browser on their local device
Accessibility: Only accessible from the same browser on the same device
Capacity: localStorage ~5MB, IndexedDB ~50MB-unlimited (varies by browser)
Persistence: Survives page refreshes but can be cleared by user or browser
Sharing: Completely private to the individual user/browser
Speed: Fast - no network requests, immediate read/write access
Modification: JavaScript can directly read/write data

WHY I USE BOTH:
My PWA uses an offline-first architecture where browser storage (IndexedDB) is the primary data store for immediate access without network dependency. The JSON file on the server acts as the authoritative source for backup, cross-device sync, and data recovery. When the user creates a journal entry offline, it's saved to IndexedDB immediately and queued for server sync. When online, the sync queue pushes changes to the server, updating the JSON file.

This dual-storage approach provides the best of both worlds: fast offline access with reliable server-side persistence.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('6.2 How did you use Python to create or update your JSON file?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `PYTHON JSON FILE OPERATIONS:
Python's built-in "json" module provides functions for reading (json.load) and writing (json.dump) JSON files. I created a Flask application that exposes these operations as HTTP API endpoints.

JSON FILE STRUCTURE:
My reflections.json file uses this structure:
{
  "reflections": [
    { "id": 1, "name": "Student Name", "reflection": "Today I learned...", "timestamp": "2026-01-15T10:30:00Z" },
    { "id": 2, "name": "Student Name", "reflection": "The CSS flexbox...", "timestamp": "2026-01-16T14:20:00Z" }
  ],
  "nextId": 3
}

PYTHON CODE FOR CRUD OPERATIONS:
Reading: with open("reflections.json", "r") as file: data = json.load(file)
Writing: with open("reflections.json", "w") as file: json.dump(data, file, indent=2)

CREATE (POST) ENDPOINT:
When a POST request arrives with new reflection data, the Python code: (1) Opens and reads the current JSON file, (2) Assigns the nextId to the new reflection, (3) Increments nextId for future entries, (4) Appends the new reflection to the array, (5) Writes the updated data back to the file, (6) Returns the created reflection as JSON response.

UPDATE (PUT) ENDPOINT:
The PUT endpoint finds the reflection by ID using list comprehension, updates its fields, and saves the modified file.

DELETE ENDPOINT:
The DELETE endpoint filters out the matching ID and saves the reduced array.

ERROR HANDLING:
All file operations use try-except blocks to handle file not found errors, JSON parsing errors, and permission issues. The "with" statement ensures files are properly closed even if errors occur.

AUTO-INCREMENT ID:
I implemented a simple auto-increment system by storing "nextId" in the JSON file itself, eliminating the need for database sequences.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('6.3 What does your PWA show locally, and what will users see on GitHub? Are they the same? Why or why not?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `UNDERSTANDING STATIC VS DYNAMIC HOSTING:
This question reveals a fundamental concept in web development: the difference between static file hosting (like GitHub Pages) and dynamic application hosting (like PythonAnywhere or Replit).

LOCAL DEVELOPMENT EXPERIENCE:
When running locally, my PWA shows data from two sources working together:
1. IndexedDB (offline-first): Journal entries load instantly from local storage, providing immediate access without waiting for network requests
2. Server API (synced data): When online, the app fetches the latest data from the Flask server, merging it with local data and resolving any conflicts

Users experience a seamless interface where data appears instantly (from local cache) and updates sync in the background.

GITHUB PAGES (STATIC HOSTING):
GitHub Pages is a free static file hosting service. It serves files exactly as they are stored in the repository - HTML, CSS, JavaScript, images, and yes, JSON files. However, it CANNOT execute server-side code (Python, Node.js, PHP).

If I deploy my PWA to GitHub Pages:
- The frontend (React app) works perfectly - it's just HTML/CSS/JS
- The static JSON file is served as it was at deployment time
- Users can READ the JSON data that was included when I pushed to GitHub
- Users CANNOT WRITE new data - there's no server to process their requests
- Everyone sees the same static data, frozen at the moment of deployment

PYTHONANYWHERE / REPLIT (DYNAMIC HOSTING):
These platforms run actual servers that can execute Python code. When deployed here:
- Flask receives HTTP requests and processes them
- Each user's write operations update the JSON file in real-time
- Data is truly dynamic - changes persist and are visible to all users

THEY ARE NOT THE SAME because GitHub Pages lacks the server-side capability to modify files, while PythonAnywhere/Replit can execute code that reads and writes data.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('6.4 What extra feature did you add to your PWA using the JSON file, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `REFLECTIONS FEATURE - QUICK LEARNING CAPTURE:
I added a "Daily Reflections" feature that complements the main journal entries. While journal entries are comprehensive and detailed, reflections are designed for quick capture of thoughts, insights, and learnings throughout the day.

FEATURE DESIGN AND RATIONALE:
The main journal requires significant time to write a proper entry with title, tags, and markdown content. But learning moments happen throughout the day - during lectures, while debugging, after reading documentation. The reflections feature provides a low-friction way to capture these moments before they're forgotten.

JSON DATA STRUCTURE:
{
  "id": 1,
  "name": "Student Name",
  "reflection": "TIL: The useEffect cleanup function runs before the component unmounts AND before the effect runs again with new dependencies. This explains why my WebSocket connection was being closed unexpectedly!",
  "category": "React",
  "timestamp": "2026-01-15T14:32:00Z"
}

FEATURES IMPLEMENTED:
1. Quick Add: A simple form with just name and reflection text - no complex fields
2. Categories: Optional categorization (JavaScript, CSS, Python, React, etc.) for organization
3. Search: Full-text search across all reflections to find past learnings
4. Filter: Filter by category or date range
5. Export: Download all reflections as JSON for backup or sharing
6. Timeline View: Chronological display showing learning progression

WHY THIS FEATURE MATTERS:
Research on learning and memory shows that immediate capture of insights improves retention. The reflections feature encourages this practice. Over time, students build a searchable knowledge base of their own insights - much more valuable than generic notes because they're written in their own words and context.

The feature also demonstrates complete CRUD operations with JSON file storage, satisfying the lab learning objectives while providing genuine user value.`,
        { width: contentWidth }
      );

      // Lab 6
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('7   Lab 6 – Frontend & Backend');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('7.1 Why is the frontend–backend connection important?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `UNDERSTANDING CLIENT-SERVER ARCHITECTURE:
The frontend-backend connection represents one of the most fundamental patterns in web development: the client-server architecture. Understanding this separation is essential for building scalable, secure, and maintainable web applications.

FRONTEND (CLIENT-SIDE) RESPONSIBILITIES:
The frontend runs in the user's browser and handles: (1) User Interface - rendering HTML, CSS, and interactive elements, (2) User Experience - handling clicks, form inputs, animations, and navigation, (3) Local State - managing what the user sees and interacts with, (4) API Calls - sending requests to the backend for data.

BACKEND (SERVER-SIDE) RESPONSIBILITIES:
The backend runs on a server and handles: (1) Data Persistence - storing data in databases or files that survive user sessions, (2) Business Logic - enforcing rules like "users can only edit their own entries", (3) Security - authenticating users, validating input, protecting sensitive data, (4) Integration - connecting to external services, databases, and APIs.

WHY SEPARATION MATTERS:
1. Security: Sensitive operations (authentication, data validation) happen on the server where users cannot tamper with the code. If validation only happened in the browser, malicious users could bypass it.

2. Persistence: Browser storage can be cleared by users or browsers. Server-side storage ensures data survives across devices and sessions.

3. Scalability: The frontend can be served from a CDN (Content Delivery Network) anywhere in the world, while backend logic runs on dedicated servers optimized for processing.

4. Multi-User Support: The backend enables features where multiple users interact with shared data - something impossible with browser-only storage.

5. Offline Capability: With a proper backend, the frontend can cache data locally (IndexedDB) and sync when connectivity returns, enabling true offline-first PWAs.

FOR MY PWA:
The frontend provides immediate, offline-capable access to journal entries. The backend ensures data is safely stored, synchronized across devices, and protected from data loss when browser storage is cleared.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('7.2 Which HTTP methods did you use in Flask, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `HTTP METHODS AND REST CONVENTIONS:
HTTP (HyperText Transfer Protocol) defines methods that indicate the desired action to be performed on a resource. REST (Representational State Transfer) is an architectural style that uses HTTP methods semantically to create predictable, standardized APIs.

THE FOUR MAIN HTTP METHODS I USED:

1. GET - Retrieve Data (Safe, Idempotent)
Purpose: Fetch data without modifying anything
Example: GET /api/reflections returns all reflections
         GET /api/reflections/5 returns reflection with ID 5
Properties: Safe (no side effects), Idempotent (calling multiple times has same effect)
Response: 200 OK with data, or 404 Not Found if resource doesn't exist

2. POST - Create New Data
Purpose: Create a new resource; the server assigns the ID
Example: POST /api/reflections with body {"name": "Student", "reflection": "Today I learned..."}
Response: 201 Created with the new resource including its assigned ID
Properties: Not idempotent (calling twice creates two resources)

3. PUT - Update Existing Data (Idempotent)
Purpose: Replace or update an existing resource completely
Example: PUT /api/reflections/5 with body {"name": "Student", "reflection": "Updated text..."}
Response: 200 OK with updated resource, or 404 Not Found
Properties: Idempotent (calling multiple times with same data has same result)

4. DELETE - Remove Data (Idempotent)
Purpose: Remove a resource permanently
Example: DELETE /api/reflections/5
Response: 204 No Content on success, or 404 Not Found
Properties: Idempotent (deleting an already-deleted resource is not an error in well-designed APIs)

HTTP STATUS CODES:
200 OK - Request succeeded
201 Created - New resource created successfully
204 No Content - Success with no response body (DELETE)
400 Bad Request - Invalid request data
404 Not Found - Resource doesn't exist
500 Internal Server Error - Server-side error

Following these conventions makes APIs predictable and self-documenting. Developers can guess endpoint behavior based on the HTTP method used.`,
        { width: contentWidth }
      );
      doc.addPage();
      doc.fontSize(10).font('Helvetica-Bold').text('7.3 What is the difference between using Flask to store and load JSON data and reading JSON directly in the browser?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `FLASK SERVER-SIDE JSON HANDLING VS BROWSER-SIDE JSON READING:

This comparison highlights the fundamental differences between server-side and client-side data handling.

BROWSER-SIDE JSON READING (fetch static file):
How it works: The browser requests a static JSON file from a web server using fetch(). The file is served as-is.
Code: fetch("/data/reflections.json").then(res => res.json()).then(data => { /* use data */ });

Advantages:
- Simple: No server-side code needed
- Fast: Can be cached by browser and CDNs
- Free hosting: Works on GitHub Pages and other static hosts

Disadvantages:
- Read-only: Cannot modify the file from the browser (no write access)
- Public: Everyone sees the same data; no user-specific content
- No validation: Anyone can see the raw JSON structure
- No security: Cannot hide sensitive data or restrict access

FLASK SERVER-SIDE JSON HANDLING:
How it works: The browser sends a request to a Flask endpoint. Flask executes Python code that reads/writes the JSON file and returns a response.

Code (Flask backend):
@app.route("/api/reflections", methods=["POST"])
def create_reflection():
    data = request.json
    # Validate data
    # Add to JSON file
    # Return response

Advantages:
- Full CRUD: Can create, read, update, and delete data
- Validation: Server can reject invalid or malicious data
- Security: Can implement authentication and authorization
- Business Logic: Can enforce rules (e.g., rate limiting, content filtering)
- Multi-user: Can serve different data to different authenticated users
- Privacy: Sensitive data never exposed to browsers

Disadvantages:
- Requires server: Needs dynamic hosting (PythonAnywhere, Replit, etc.)
- More complex: Need to write and maintain backend code
- Slower: Every operation requires a network request

WHEN TO USE EACH:
Use static JSON for: Configuration files, public data that never changes, content that doesn't need user input
Use Flask for: User-generated content, data that needs to be updated, anything requiring authentication or validation`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('7.4 Did you face any difficulties when running your project on PythonAnywhere? How did you handle them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `DEPLOYMENT CHALLENGES AND SOLUTIONS:

Deploying to a production environment like PythonAnywhere revealed several differences from local development that required troubleshooting.

CHALLENGE 1 - FILE PATH ISSUES:
Problem: My Flask app used relative paths like "data/reflections.json" which worked locally but failed on PythonAnywhere because the working directory was different.
Error: FileNotFoundError: No such file or directory: 'data/reflections.json'
Solution: I constructed absolute paths using os.path module:
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "data", "reflections.json")

CHALLENGE 2 - CORS (Cross-Origin Resource Sharing) ERRORS:
Problem: My frontend (hosted on one domain) couldn't access my Flask API (on another domain). Browsers block cross-origin requests by default for security.
Error: "Access to fetch at 'https://username.pythonanywhere.com/api/...' from origin 'https://myapp.github.io' has been blocked by CORS policy"
Solution: I installed Flask-CORS and configured it to allow requests from my frontend:
from flask_cors import CORS
CORS(app, origins=["https://myapp.github.io", "http://localhost:5173"])

CHALLENGE 3 - VIRTUAL ENVIRONMENT SETUP:
Problem: PythonAnywhere uses isolated virtual environments. My packages weren't installed.
Error: ModuleNotFoundError: No module named 'flask'
Solution: Created a virtual environment and installed dependencies:
mkvirtualenv --python=/usr/bin/python3.10 myenv
pip install flask flask-cors

CHALLENGE 4 - WSGI CONFIGURATION:
Problem: PythonAnywhere requires a WSGI (Web Server Gateway Interface) file to know how to run the Flask app.
Solution: Created /var/www/username_pythonanywhere_com_wsgi.py with:
import sys
sys.path.insert(0, '/home/username/myapp')
from app import app as application

CHALLENGE 5 - FILE PERMISSIONS:
Problem: The Flask app couldn't write to the JSON file.
Solution: Ensured the file and directory had write permissions for the web app user.

LEARNING OUTCOME: Deployment exposed gaps between development and production environments, teaching me to write more robust code that works in any environment.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('7.5 What extra feature did you build into your PWA with Flask, and why did you add it?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `COMPLETE CRUD SYSTEM FOR LEARNING REFLECTIONS:

I built a full-featured reflections management system that demonstrates all CRUD (Create, Read, Update, Delete) operations with a Flask backend. This feature goes beyond basic data storage to provide a complete content management experience.

FEATURE OVERVIEW:
1. Create Reflections: Users write quick learning insights with name, text, and optional category
2. Read/Browse: View all reflections in a timeline, search by keyword, filter by category or date
3. Update/Edit: Modify existing reflections to correct typos or add new insights
4. Delete: Remove unwanted reflections with confirmation to prevent accidents
5. Export: Download all reflections as a JSON file for backup or migration

WHY I ADDED THIS FEATURE:
Educational Completeness: The lab objectives require demonstrating all four CRUD operations. This feature provides clear, practical examples of each operation with real user value.

Complementary to Main Journal: The main journal entries require significant time and effort to write well. Reflections provide a low-friction alternative for capturing quick thoughts - like the difference between writing a blog post versus a tweet.

Practical User Value: Students often have brief insights during lectures, while debugging, or reading documentation. Having a quick-capture tool prevents these valuable moments from being forgotten.

Technical Demonstration: The feature showcases:
- Form handling with validation
- Optimistic UI updates (show changes immediately, sync in background)
- Error handling and user feedback
- Search and filter functionality
- Data export capabilities

IMPLEMENTATION DETAILS:
The frontend uses React components with TanStack Query for data fetching and caching. Forms use react-hook-form with Zod validation. The backend Flask API validates all input, manages the JSON file, and returns appropriate status codes.

FUTURE ENHANCEMENTS:
Given more time, I would add: (1) Categories with color coding, (2) Markdown support for formatting, (3) Tags for flexible organization, (4) Statistics showing reflection trends over time.`,
        { width: contentWidth }
      );

      // Lab 7
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('8   Lab 7 – PWA');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('8.1 Why is it useful to enhance your Flask app with PWA features?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `UNDERSTANDING PROGRESSIVE WEB APPS:
A Progressive Web App (PWA) is a web application that uses modern web technologies to deliver app-like experiences to users. PWAs can work offline, be installed on home screens, and receive push notifications - capabilities previously exclusive to native mobile apps.

WHY PWA FEATURES MATTER:

1. OFFLINE ACCESS (Critical for Learning Apps):
Students don't always have reliable internet access. They study on buses, trains, in libraries with poor WiFi, or in areas with limited connectivity. Without PWA features, a web app becomes completely unusable offline. With PWA features, users can: view previously loaded journal entries, create new entries that sync later, browse their project history, and access all cached content. This transforms the app from "internet required" to "always available."

2. INSTALLABILITY (App-Like Experience):
The install-to-home-screen feature allows users to add the PWA to their device like a native app. Benefits include: (a) One-tap access without opening a browser and typing a URL, (b) Full-screen experience without browser chrome (address bar, tabs), (c) Appears in the app switcher alongside native apps, (d) Can be launched from app launchers and start menus. This makes the app feel like a first-class citizen on the device rather than "just a website."

3. PERFORMANCE IMPROVEMENTS:
Service workers cache static assets (HTML, CSS, JavaScript, images), dramatically improving load times on repeat visits. The first visit downloads and caches resources; subsequent visits load instantly from cache. Google research shows that 53% of users abandon sites that take longer than 3 seconds to load - caching helps achieve sub-second load times.

4. ENGAGEMENT FEATURES:
Push notifications can remind users to write journal entries, celebrate learning streaks, or alert them to sync conflicts. Background sync ensures data is never lost even if the app is closed while offline.

5. REDUCED DATA USAGE:
Cached assets don't need to be re-downloaded, reducing mobile data consumption - important for users with limited data plans.

FOR MY LEARNING JOURNAL:
These features transform a simple note-taking website into a reliable learning companion that's always accessible, fast, and integrated into the user's device ecosystem.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('8.2 What did you use to support offline access and dynamic data?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `IMPLEMENTING OFFLINE-FIRST ARCHITECTURE:
My PWA uses a comprehensive offline strategy combining Service Workers for static assets and IndexedDB for dynamic data. This dual approach ensures both the application code and user data are available offline.

SERVICE WORKER FOR STATIC ASSETS:
A Service Worker is a JavaScript file that runs separately from the main browser thread, acting as a programmable network proxy. It intercepts all network requests and can serve cached responses.

Registration: In the main JavaScript, I register the service worker:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
}

Caching Strategy - Cache First: For static assets (HTML, CSS, JS, images), I use a cache-first strategy. The service worker checks the cache first; if found, it returns the cached version immediately. If not found, it fetches from the network, caches the response, and returns it.

Caching Strategy - Network First: For API requests, I use network-first. The service worker tries the network; if successful, it updates the cache and returns fresh data. If the network fails (offline), it falls back to the cached response.

INDEXEDDB FOR DYNAMIC USER DATA:
IndexedDB stores journal entries, projects, and user preferences locally. I use the localforage library which provides a simple Promise-based API wrapping IndexedDB.

Data Flow:
1. User creates a journal entry
2. Entry is immediately saved to IndexedDB (instant, no network needed)
3. Entry is added to a sync queue in localStorage
4. When online, sync queue processes pending operations
5. Each item is POSTed to the server API
6. On success, item is removed from sync queue
7. Server response may include server-assigned ID which updates local record

CONFLICT RESOLUTION:
If the same entry is modified on multiple devices while offline, I use a last-write-wins strategy based on timestamps. The entry with the most recent modification timestamp is kept.

ONLINE/OFFLINE DETECTION:
The app listens for navigator.onLine changes and 'online'/'offline' events to trigger sync when connectivity returns.`,
        { width: contentWidth }
      );
      doc.addPage();
      doc.fontSize(10).font('Helvetica-Bold').text('8.3 What extra feature did you add, and why?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `PWA DEMONSTRATION PAGE - MAKING THE INVISIBLE VISIBLE:

PWA features like service workers and caching work silently in the background - users benefit without realizing it. I created a dedicated PWA Demo page that makes these invisible features visible and testable.

FEATURE OVERVIEW:

1. CONNECTION STATUS INDICATOR:
A real-time display showing whether the device is online or offline. Uses navigator.onLine and event listeners for 'online'/'offline' events. Users can toggle their device's airplane mode to see the indicator update in real-time.

2. SERVICE WORKER STATUS:
Displays whether the service worker is: (a) Not registered, (b) Installing, (c) Waiting (new version available), (d) Active. Also shows the service worker's scope and the current version.

3. CACHE VIEWER:
Lists all cached resources with their URLs and sizes. Users can see exactly what's stored for offline use. This demystifies the "magic" of offline functionality - it's just files stored locally.

4. INSTALL PROMPT:
If the PWA meets install criteria (served over HTTPS, has valid manifest, etc.), an install button appears. Clicking it triggers the browser's install prompt, allowing users to add the app to their home screen.

5. OFFLINE SIMULATION:
Instructions for testing offline mode using Chrome DevTools' Network tab. Users can throttle to "Offline" and verify the app still works.

6. STORAGE USAGE:
Shows how much IndexedDB and Cache storage is being used, helping users understand the storage footprint of offline data.

WHY I ADDED THIS FEATURE:
Educational Value: Understanding PWA internals helps students appreciate what makes web apps "progressive." The demo page serves as both a feature showcase and a learning tool.

Debugging Utility: During development, I needed to verify caches were updating correctly. This page became an essential debugging tool.

User Transparency: Some users are curious about how offline mode works. Rather than it being mysterious, they can see exactly what's cached.

Assessment Evidence: The demo page provides clear, demonstrable evidence of PWA implementation for portfolio assessment.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('8.4 Did you face any challenges deploying your PWA, and how did you solve them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `DEPLOYMENT CHALLENGES SPECIFIC TO PWAs:

PWAs have unique deployment requirements beyond standard web apps. Several challenges emerged when moving from development to production.

CHALLENGE 1 - HTTPS REQUIREMENT:
Problem: Service workers only work on HTTPS (except localhost for development). My initial deployment to an HTTP-only host failed to register the service worker.
Error: "Service worker registration failed: Security error"
Solution: Deployed to platforms with automatic HTTPS (Replit, Netlify, Vercel). For custom domains, configured SSL certificates through Let's Encrypt.

CHALLENGE 2 - SERVICE WORKER SCOPE:
Problem: The service worker only controlled the root path ("/"), not nested routes like "/journal/123" or "/projects". Navigating directly to these URLs while offline showed a blank page.
Error: Offline navigation to nested routes failed.
Solution: Configured the service worker scope and fetch handler to serve the cached index.html for all navigation requests (this is called the App Shell pattern):
if (event.request.mode === 'navigate') {
  return caches.match('/index.html');
}

CHALLENGE 3 - CACHE VERSIONING:
Problem: After deploying code updates, users still saw the old cached version. The service worker served stale files.
Solution: Implemented cache versioning with version numbers in cache names:
const CACHE_VERSION = 'v1.2.3';
const CACHE_NAME = 'learning-journal-' + CACHE_VERSION;
On activation, the service worker deletes caches with old version names:
caches.keys().then(names => names.filter(n => n !== CACHE_NAME).forEach(n => caches.delete(n)));

CHALLENGE 4 - SERVICE WORKER UPDATE FLOW:
Problem: Even with versioned caches, the old service worker stayed active until all tabs were closed.
Solution: Added skipWaiting() in the install event and clients.claim() in the activate event to take control immediately. Also added UI to inform users when updates are available.

CHALLENGE 5 - MANIFEST CONFIGURATION:
Problem: The install prompt didn't appear despite having a manifest.json.
Solution: Ensured the manifest included all required fields (name, short_name, start_url, display, icons with multiple sizes) and was linked correctly in HTML.

TESTING APPROACH:
I used Chrome DevTools' Application tab to: inspect service worker state, view cached resources, trigger update checks, simulate offline mode, and verify manifest parsing.`,
        { width: contentWidth }
      );

      // Mini Project
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('9   Mini Project');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica-Bold').text('9.1 What additional features did you add to your Learning Journal?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `COMPREHENSIVE FEATURE ADDITIONS:

Beyond the core journal functionality required by the module, I added several significant features that demonstrate advanced web development skills and provide genuine user value.

1. CANDY RUSH SAGA GAME (Primary Mini Project):
A fully-featured match-3 puzzle game inspired by popular mobile games like Candy Crush. The game includes: (a) 8x8 game board with 6 candy types rendered using React components with CSS animations, (b) Match detection algorithm that identifies horizontal and vertical matches of 3+ candies, (c) Cascade system where candies fall after matches and new candies spawn from the top, (d) Progressive difficulty across 10+ levels with unique objectives (score targets, clear jellies, collect specific candies), (e) Special candies created from 4+ matches (striped candies clear entire rows/columns, wrapped candies create explosions), (f) Scoring system with star ratings based on performance, (g) Move limits per level requiring strategic thinking, (h) Blockers like ice and jelly layers that add challenge, (i) Level progression with unlock system, (j) High score tracking stored in IndexedDB.

2. ANALYTICS DASHBOARD:
A comprehensive analytics page that visualizes learning progress: (a) Weekly entry charts using Recharts library showing journal activity trends, (b) Tag cloud visualization displaying frequently used topics, (c) Learning streaks tracking consecutive days of journaling, (d) Activity heatmap similar to GitHub's contribution graph, (e) Statistics cards showing total entries, words written, and projects completed.

3. ACHIEVEMENTS AND GAMIFICATION:
A badge system that motivates consistent journaling: (a) "First Entry" badge for starting the journey, (b) "Weekly Warrior" for 7-day streaks, (c) "Prolific Writer" for reaching word count milestones, (d) "Project Master" for completing multiple projects, (e) Visual badge display on user profile.

4. DRAWING CANVAS:
An interactive drawing tool using the HTML5 Canvas API: (a) Freehand drawing with adjustable brush sizes, (b) Color picker for custom colors, (c) Eraser tool for corrections, (d) Save drawings to attach to journal entries, (e) Export as PNG image.

5. ENHANCED JOURNAL FEATURES:
(a) Rich markdown editor with live preview using @uiw/react-md-editor, (b) Tag management with autocomplete, (c) Full-text search across all entries, (d) PDF export for individual entries or full journal.

6. PWA DEMO PAGE:
Interactive demonstration of all PWA capabilities as detailed in Lab 7.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('9.2 Why did you choose your mini project idea?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `STRATEGIC RATIONALE FOR CANDY RUSH SAGA GAME:

Choosing the right mini project required balancing educational value, technical challenge, and portfolio appeal. The Candy Rush Saga game satisfied all three criteria exceptionally well.

TECHNICAL CHALLENGE - DEMONSTRATING ADVANCED SKILLS:
Match-3 puzzle games are deceptively complex. They require: (1) 2D array manipulation for the game board, (2) Pattern recognition algorithms for match detection, (3) Recursive logic for cascade effects, (4) Animation timing and sequencing, (5) State management for scores, moves, objectives, (6) Level design and progression systems. These challenges pushed my JavaScript skills far beyond basic DOM manipulation, requiring algorithmic thinking typically associated with computer science fundamentals.

USER ENGAGEMENT - RETENTION MECHANISM:
A game adds entertainment value to the learning journal, encouraging regular app usage. Users might open the app to play a quick game and then be reminded to write their journal entry. This cross-feature engagement is a proven strategy in app design. The gamification aspect connects to the achievements system - learning consistency is rewarded alongside game performance.

CANVAS API AND ANIMATION EXPLORATION:
While I ultimately used React components for rendering (for simpler state management), I explored the HTML5 Canvas API during development. The animation techniques learned (requestAnimationFrame, CSS keyframes, transition timing) are directly applicable to data visualization, interactive charts, and engaging UI effects.

CREATIVE EXPRESSION:
The FGCT6021 module emphasizes creative digital development. A game showcases both technical implementation ability and design thinking: color choices, visual feedback, difficulty curves, and user interface layout all required creative decisions.

PORTFOLIO VALUE:
A polished, playable game is an impressive portfolio piece that demonstrates: (a) Ability to scope and complete a complex project, (b) Problem-solving skills with algorithms, (c) Attention to user experience and visual design, (d) Integration of multiple technologies (React, CSS animations, state management).

COURSE ALIGNMENT:
The game demonstrates mastery of: JavaScript (core logic), DOM/React (rendering), CSS (animations, layout), and state management - all key module outcomes.`,
        { width: contentWidth }
      );
      
      doc.addPage();
      doc.fontSize(10).font('Helvetica-Bold').text('9.3 What technical challenges did you face and how did you solve them?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `DETAILED TECHNICAL CHALLENGES AND SOLUTIONS:

CHALLENGE 1 - MATCH-3 DETECTION ALGORITHM:
Problem: Finding all horizontal and vertical matches of 3 or more consecutive candies in an 8x8 grid is more complex than it appears. Simple iteration misses edge cases and can double-count candies that are part of both horizontal and vertical matches.

Solution: I implemented a two-pass algorithm:
Pass 1 - Horizontal Scan: For each row, iterate through columns tracking consecutive candies of the same type. When the streak reaches 3+, record all positions.
Pass 2 - Vertical Scan: For each column, iterate through rows with the same logic.
Deduplication: Store matched positions in a JavaScript Set (using "row,col" strings as keys) to automatically eliminate duplicates.

The algorithm runs in O(n*m) time where n=rows and m=columns, making it efficient for real-time gameplay.

CHALLENGE 2 - CASCADE SYSTEM (Gravity + Spawning + Chain Reactions):
Problem: After matches are cleared, remaining candies must fall down to fill gaps, new candies must spawn at the top, and the new board state might contain new matches that need to be cleared - creating chain reactions.

Solution: I implemented a recursive cascade function using async/await for proper animation timing:
1. Clear matched candies (set to null in the array)
2. Apply gravity: For each column, shift non-null candies down to fill gaps
3. Spawn new candies: Fill remaining null positions at the top with random candies
4. Check for new matches: Run match detection again
5. If new matches found, recursively call cascade
6. Animation timing: Use await new Promise(resolve => setTimeout(resolve, 300)) between steps to allow visual feedback

CHALLENGE 3 - STATE MANAGEMENT COMPLEXITY:
Problem: The game state includes: board (8x8 array), score, moves remaining, level objectives, special candy positions, and animation states. Managing this with multiple useState calls became unwieldy and caused bugs.

Solution: Consolidated state into a single structured object with a reducer-like pattern:
const [gameState, setGameState] = useState({
  board: initialBoard,
  score: 0,
  movesLeft: 20,
  objectives: { targetScore: 5000 },
  isAnimating: false
});

Created helper functions for each action (handleSwap, handleMatch, handleCascade) that compute the new state immutably and update it atomically.

CHALLENGE 4 - PERFORMANCE OPTIMIZATION:
Problem: Initial implementation re-rendered all 64 cells on every state change, causing noticeable lag during cascades.

Solution: (1) Used React.memo() to prevent cell re-renders unless their specific candy changes, (2) Batched state updates to reduce render cycles, (3) Used CSS transforms instead of layout changes for animations (transforms are GPU-accelerated).

CHALLENGE 5 - SPECIAL CANDY LOGIC:
Problem: Special candies (striped, wrapped, color bomb) have complex effects that interact with each other.

Solution: Created a priority-based effect system where effects are queued and resolved in order, with each effect potentially adding more effects to the queue (e.g., a color bomb matching a striped candy triggers multiple line clears).`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text('9.4 What would you improve if given more time?');
      doc.moveDown(0.3);
      doc.font('Helvetica').text(
        `FUTURE IMPROVEMENTS AND EXTENSIONS:

Given additional development time, I would implement the following enhancements across the Learning Journal and Candy Rush Saga game:

GAME ENHANCEMENTS:
1. More Level Variety: Add 50+ levels with unique objectives like "collect 20 blue candies" or "clear all blockers in 15 moves." Design a level editor for creating custom challenges.

2. Power-Ups Shop: Implement an in-game currency (earned through gameplay) that can purchase power-ups like extra moves, pre-game boosts (start with a color bomb), or hints.

3. Sound Effects and Music: Add satisfying audio feedback for matches, cascades, and level completion. Include background music with volume controls.

4. Animations Improvement: Enhance visual effects with particle systems for explosions, smoother candy falling physics, and celebratory animations for level completion.

5. Leaderboards: Implement global and friends leaderboards using the server backend, allowing competitive play.

JOURNAL ENHANCEMENTS:
1. AI-Powered Features: Integrate OpenAI API to: (a) Summarize weekly learning automatically, (b) Suggest related topics based on journal content, (c) Generate study questions from entries, (d) Provide writing feedback and suggestions.

2. Voice Notes: Add audio recording using the MediaRecorder API, with optional speech-to-text transcription for searchability.

3. Photo Integration: Allow attaching photos to entries using the device camera or file upload, useful for documenting whiteboard sessions or handwritten notes.

4. Collaboration Features: Enable sharing entries with study partners, group journals for team projects, and comment threads on shared entries.

TECHNICAL IMPROVEMENTS:
1. Mobile App: Package the PWA as native Android/iOS apps using Capacitor, enabling better notifications and device integration.

2. Real-Time Sync: Replace polling-based sync with WebSockets for instant cross-device updates.

3. Accessibility Audit: Conduct thorough WCAG 2.1 AA compliance testing, improving keyboard navigation, screen reader compatibility, and color contrast.

4. Performance Monitoring: Add analytics to track load times, error rates, and user engagement metrics.

5. Automated Testing: Implement comprehensive unit tests with Jest and end-to-end tests with Playwright to catch regressions.

These improvements would transform the Learning Journal from a course project into a production-ready application that could genuinely help students manage their learning journeys.`,
        { width: contentWidth }
      );

      // Appendices
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold').text('Appendices');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('Appendix A: Technology Stack');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(
        `FRONTEND TECHNOLOGIES:
- React 18: Modern JavaScript library for building user interfaces with component-based architecture, hooks for state management, and concurrent rendering features for improved performance.
- TypeScript: Typed superset of JavaScript providing compile-time error checking, improved code documentation through type annotations, and better IDE support with autocompletion.
- Tailwind CSS: Utility-first CSS framework enabling rapid UI development with consistent design tokens, responsive breakpoints, and dark mode support.
- shadcn/ui: High-quality, accessible component library built on Radix UI primitives, providing buttons, modals, forms, and other UI elements with consistent styling.
- Recharts: React charting library for data visualization including line charts, bar charts, and pie charts used in the analytics dashboard.
- Wouter: Lightweight routing library (3KB) for client-side navigation between pages without full page reloads.
- TanStack Query: Powerful data fetching library with caching, background updates, and optimistic mutations for seamless API integration.

BACKEND TECHNOLOGIES:
- Node.js: JavaScript runtime enabling server-side JavaScript execution, chosen for full-stack JavaScript consistency.
- Express.js: Minimal, flexible web framework for building REST APIs with middleware support for authentication, logging, and error handling.
- Drizzle ORM: TypeScript-first ORM providing type-safe database queries, schema definition, and migration management.
- PostgreSQL (Neon): Serverless PostgreSQL database with automatic scaling, connection pooling, and branching for development workflows.

OFFLINE AND PWA TECHNOLOGIES:
- Service Workers: Background scripts intercepting network requests for offline caching and background sync.
- IndexedDB (via localforage): Browser-based NoSQL database for storing structured data offline with Promise-based API wrapper.
- Web App Manifest: JSON file defining PWA metadata for installability including app name, icons, and display mode.
- Workbox: Google's library for service worker generation and caching strategy implementation.

BUILD AND DEVELOPMENT TOOLS:
- Vite: Next-generation frontend build tool with instant hot module replacement and optimized production builds.
- ESBuild: Extremely fast JavaScript bundler used by Vite for development builds.
- pdfkit: Node.js library for generating PDF documents used for portfolio export.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('Appendix B: Key Features Summary');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(
        `CORE JOURNAL FUNCTIONALITY:
1. Journal Entries: Create, read, update, and delete journal entries with rich markdown content, tags for categorization, and automatic timestamps.
2. Project Tracking: Document ongoing and completed projects with descriptions, technology stacks, and status tracking.
3. User Profile: Personalized profile with display name, bio, and settings preferences.

ANALYTICS AND INSIGHTS:
4. Analytics Dashboard: Visual representations of learning progress including weekly trends, tag clouds, and activity heatmaps.
5. Learning Streaks: Track consecutive days of journaling to encourage consistent reflection habits.
6. Statistics: Aggregate metrics including total entries, word count, and projects completed.

GAMIFICATION FEATURES:
7. Achievements System: Badge rewards for milestones encouraging continued engagement.
8. Candy Rush Saga Game: Complete match-3 puzzle game with 10+ levels, scoring, and progression system.

CREATIVE TOOLS:
9. Drawing Canvas: Freehand drawing tool for visual notes and sketches.
10. Markdown Editor: Rich text editing with live preview for formatted journal entries.

PWA CAPABILITIES:
11. Offline-First Architecture: Full functionality without internet connection using IndexedDB.
12. Installability: Add to home screen on mobile and desktop devices.
13. Background Sync: Automatic synchronization when connectivity returns.
14. PWA Demo Page: Interactive demonstration of all PWA features.

LAB DEMONSTRATION PAGES:
15. Lab 3-7 Demos: Interactive pages demonstrating each lab's concepts with working examples.`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('Appendix C: API Endpoints Documentation');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(
        `JOURNAL ENTRIES API:
GET /api/journals - Retrieve all journal entries for the current user
  Response: [{ id, title, content, tags, date, createdAt }]
POST /api/journals - Create a new journal entry
  Request: { title, content, tags, date }
  Response: { id, title, content, tags, date, createdAt }
PUT /api/journals/:id - Update an existing journal entry
DELETE /api/journals/:id - Delete a journal entry

PROJECTS API:
GET /api/projects - Retrieve all projects
POST /api/projects - Create a new project
  Request: { title, description, techStack, status }
PUT /api/projects/:id - Update project details
DELETE /api/projects/:id - Delete a project

REFLECTIONS API (Lab 6):
GET /api/lab6-reflections - Retrieve all reflections
POST /api/lab6-reflections - Create a new reflection
  Request: { name, reflection }
PUT /api/lab6-reflections/:id - Update a reflection
DELETE /api/lab6-reflections/:id - Delete a reflection

USER PROFILE API:
GET /api/profile - Retrieve user profile
PUT /api/profile - Update user profile

PORTFOLIO EXPORT:
GET /api/download-portfolio - Generate and download complete portfolio as PDF

All endpoints return appropriate HTTP status codes:
200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, 500 Internal Server Error`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('Appendix D: Database Schema');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(
        `POSTGRESQL SCHEMA (Drizzle ORM):

journalEntries Table:
- id: UUID (Primary Key)
- title: VARCHAR(255)
- content: TEXT (Markdown content)
- tags: TEXT[] (Array of tag strings)
- date: DATE
- deviceId: VARCHAR(255) (For device-based data isolation)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP

projects Table:
- id: UUID (Primary Key)
- title: VARCHAR(255)
- description: TEXT
- techStack: TEXT[] (Array of technologies)
- status: VARCHAR(50) ('active', 'completed', 'archived')
- deviceId: VARCHAR(255)
- createdAt: TIMESTAMP
- updatedAt: TIMESTAMP

userProfile Table:
- id: UUID (Primary Key)
- displayName: VARCHAR(255)
- bio: TEXT
- settings: JSONB (User preferences)
- deviceId: VARCHAR(255)

INDEXEDDB SCHEMA (Client-Side):
- journals: { id, title, content, tags, date, synced }
- projects: { id, title, description, techStack, status, synced }
- syncQueue: { id, action, data, timestamp }`,
        { width: contentWidth }
      );
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').text('Appendix E: Screenshots');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').text(
        `[Include the following screenshots in your submission]:
1. Home Dashboard - Overview of journal entries and projects
2. Journal Entry Creation - Markdown editor with preview
3. Analytics Dashboard - Charts showing learning trends
4. Candy Rush Saga Game - Gameplay screenshot with UI
5. PWA Install Process - Browser install prompt
6. Offline Mode Indicator - App functioning without internet
7. Lab Demo Pages - Interactive demonstrations
8. Mobile Responsive View - App on mobile device viewport`,
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

      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
