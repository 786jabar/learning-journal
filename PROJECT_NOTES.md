# Learning Journal PWA - Development Notes

## Project Overview

This is my Learning Journal Progressive Web App for FGCT6021 Mobile Application Development. It's an offline-first PWA for tracking my learning journey through journal entries and projects.

## Key Features

- Offline-first architecture using IndexedDB
- Service worker for caching and background sync
- Responsive glassmorphism design with dark/light themes
- Lab demonstrations (Labs 3-7)
- Mini Project: Learning Streak & Achievement System

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite build tool
- TailwindCSS for styling
- Shadcn/ui component library
- TanStack Query for data fetching
- LocalForage for IndexedDB storage

### Backend
- Express.js with TypeScript
- PostgreSQL database (Neon serverless)
- Drizzle ORM

## Project Structure

```
client/src/
  pages/         - Route pages (LandingPage, JournalsPage, etc.)
  components/    - Reusable UI components
  hooks/         - Custom React hooks
  lib/           - Utility functions

server/
  routes.ts      - API endpoints
  storage.ts     - Database operations

shared/
  schema.ts      - Database schema (Drizzle)

public/
  sw.js          - Service worker
  manifest.json  - PWA manifest
```

## Running the Project

```bash
npm install
npm run dev
```

## Database Commands

```bash
npm run db:push    # Push schema changes
npm run db:studio  # Open Drizzle Studio
```

## Lab Demonstrations

- Lab 3: DOM Manipulation with vanilla JavaScript
- Lab 4: Browser APIs (Storage, Clipboard, Geolocation, Notifications)
- Lab 5: Python backend integration
- Lab 6: Flask REST API
- Lab 7: PWA Technologies

## Mini Project

Learning Streak & Achievement System - A gamification feature that tracks daily learning streaks and unlocks achievements based on journal entries and projects created.
