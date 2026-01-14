import { storage } from "./server/storage";

async function seed() {
  const guestId = "guest-fallback";

  console.log("Seeding database with initial entries...");

  try {
    // Seed Journals
    const journals = [
      {
        title: "Welcome to my Learning Journal",
        content: "This is my first journal entry where I document my journey into web development and PWA. I have successfully implemented offline support and a beautiful glassmorphism design!",
        tags: ["learning", "pwa", "webdev"],
        date: new Date()
      },
      {
        title: "Lab 3 Reflection: DOM Manipulation",
        content: "In Lab 3, I explored how to manipulate the DOM using vanilla JavaScript. It was a great exercise in understanding the core of web development before moving to frameworks like React.",
        tags: ["lab3", "javascript", "dom"],
        date: new Date()
      },
      {
        title: "Implementing PWA Features",
        content: "Today I integrated service workers and manifest files to make the app work offline. The biggest challenge was ensuring the cache strategy works correctly for navigation.",
        tags: ["pwa", "offline", "service-worker"],
        date: new Date()
      }
    ];

    for (const journal of journals) {
      await storage.createJournal(journal, guestId);
    }

    // Seed Projects
    const projects = [
      {
        name: "Learning Journal PWA",
        description: "A full-stack offline-first application for tracking educational progress, featuring glassmorphism UI and PostgreSQL backend.",
        techStack: ["React", "TypeScript", "Drizzle", "PostgreSQL", "Tailwind CSS"]
      },
      {
        name: "Browser API Showcase",
        description: "A demonstration of various browser APIs including Geolocation, Notifications, and Storage APIs implemented during Lab 4.",
        techStack: ["JavaScript", "Web APIs", "HTML5"]
      }
    ];

    for (const project of projects) {
      await storage.createProject(project, guestId);
    }

    console.log("Successfully seeded database!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
