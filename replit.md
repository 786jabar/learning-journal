# Learning Journal PWA

## Overview
A modern, offline-first Progressive Web App for tracking learning journeys, documenting journal entries with Markdown support, and managing learning projects. Built with React 18, TypeScript, Vite, and a comprehensive PWA setup.

**Status:** In Development  
**Last Updated:** November 7, 2025

## Project Goals
- Provide an offline-first journaling experience with IndexedDB persistence
- Enable rich Markdown editing for journal entries  
- Track learning projects with tech stack details
- Visualize learning progress with analytics charts
- Deliver a stunning, responsive UI with dark/light theme support
- Function as an installable PWA on any device

## Architecture

### Tech Stack
**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Wouter for routing
- TanStack Query (React Query) for data caching
- Tailwind CSS + ShadCN/UI components
- Framer Motion for animations
- Recharts for data visualization
- @uiw/react-md-editor for Markdown editing
- localforage for IndexedDB operations

**Backend:**
- Express.js with minimal API
- In-memory storage (MemStorage) for development
- Will use PostgreSQL for production persistence

**PWA Features:**
- vite-plugin-pwa for service worker
- workbox-window for caching strategies
- Offline-first architecture
- Auto-sync when online

### Data Models

**Journal Entry:**
- id (string, UUID)
- title (string, required)
- content (string, Markdown)
- tags (string array)
- date (timestamp)
- createdAt, updatedAt

**Project:**
- id (string, UUID)
- name (string, required)
- description (string)
- techStack (string array)
- createdAt, updatedAt

## Project Structure

```
client/
├── public/
│   ├── favicon.png
│   └── manifest.webmanifest
├── src/
│   ├── main.tsx (Entry point with PWA registration)
│   ├── App.tsx (Main app with routing)
│   ├── index.css (Tailwind + custom styles)
│   ├── components/
│   │   ├── Navbar.tsx (Navigation with theme toggle & offline status)
│   │   ├── Footer.tsx
│   │   ├── JournalCard.tsx (Journal entry card component)
│   │   ├── ProjectCard.tsx (Project card component)
│   │   └── ui/ (ShadCN components)
│   ├── pages/
│   │   ├── HomePage.tsx (Dashboard with analytics charts)
│   │   ├── JournalPage.tsx (CRUD for journal entries)
│   │   ├── ProjectsPage.tsx (CRUD for projects)
│   │   ├── AboutPage.tsx (App information)
│   │   └── not-found.tsx (404 page)
│   ├── hooks/
│   │   └── useOfflineStatus.ts (Online/offline detection)
│   ├── lib/
│   │   ├── db.ts (IndexedDB operations via localforage)
│   │   ├── theme-provider.tsx (Dark/light theme management)
│   │   └── queryClient.ts (React Query setup)
│   └── assets/
server/
├── routes.ts (API endpoints)
├── storage.ts (Storage interface & MemStorage)
└── index.ts
shared/
└── schema.ts (Shared TypeScript types & Zod schemas)
```

## Features

### Implemented
✅ Complete data schemas for journals and projects  
✅ Theme provider with dark/light mode  
✅ Offline status detection and indicator  
✅ IndexedDB storage layer with localforage  
✅ Navbar with navigation and theme toggle  
✅ Footer component  
✅ Journal card and project card components  
✅ HomePage with analytics dashboard (charts, stats, recent entries)  
✅ JournalPage with CRUD, search, tag filtering, Markdown editor  
✅ ProjectsPage with CRUD operations  
✅ AboutPage with feature descriptions  
✅ 404 Not Found page  
✅ SEO meta tags and PWA manifest  
✅ Responsive design across all breakpoints  

### In Progress
🔄 Backend API implementation  
🔄 Service worker configuration  
🔄 Sync queue management for offline operations  

### Planned
📋 Complete integration testing  
📋 PWA install prompt  
📋 Advanced analytics features  

## Design Guidelines
The app follows design guidelines in `design_guidelines.md`:
- Clean, productivity-focused interface inspired by Notion and Linear
- Inter font for readability, JetBrains Mono for code
- Consistent spacing using Tailwind units (2, 4, 6, 8, 12, 16)
- Material Design 3 component patterns
- Subtle animations with Framer Motion
- Accessible color contrast in both themes
- Mobile-first responsive approach

## Development Notes

### Color System
- Uses HSL color variables defined in index.css
- Automatic dark mode adaptation
- Chart colors: chart-1 through chart-5 for visualizations
- Status colors for offline/online indicators

### Component Patterns
- All interactive elements have data-testid attributes for testing
- Cards use hover-elevate class for subtle hover effects
- Forms use react-hook-form with Zod validation
- Loading states use skeleton components
- Empty states have helpful CTAs

### Offline-First Strategy
1. All data stored in IndexedDB via localforage
2. Service worker caches static assets
3. Sync queue tracks offline operations
4. Auto-sync triggers when connection restored
5. Visual feedback via status badge in Navbar

## Recent Changes
- **Nov 7, 2025:** Initial project setup with complete frontend implementation
  - Created all data schemas and TypeScript interfaces
  - Built all React components and pages
  - Implemented theme system with persistence
  - Added Markdown editor integration
  - Created analytics dashboard with Recharts
  - Configured SEO and PWA manifest

## User Preferences
- Theme preference stored in localStorage
- Offline-first data storage in IndexedDB
- Responsive design for all screen sizes
- Keyboard accessible navigation

## Next Steps
1. Complete backend API implementation with storage layer
2. Configure vite-plugin-pwa for service worker
3. Implement sync queue for offline operations
4. Connect frontend to backend APIs
5. Add comprehensive error handling
6. Test all features end-to-end
