# Learning Journal PWA

## Overview

A Progressive Web App (PWA) for tracking learning journeys through journal entries and projects. Built as an educational project for FGCT6021 Mobile Application Development, featuring offline-first architecture, service worker caching, and a responsive glassmorphism design with dark/light theme support. The app includes lab demonstrations (Labs 3-7) and a mini project implementing learning streaks and achievements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom path aliases (@/ for client/src, @shared/ for shared)
- **Routing**: Wouter (lightweight React router)
- **Styling**: TailwindCSS with glassmorphism design patterns, shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Offline Storage**: LocalForage wrapping IndexedDB for client-side persistence

### Backend Architecture
- **Runtime**: Express.js with TypeScript
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with schema defined in shared/schema.ts
- **API Pattern**: RESTful endpoints under /api prefix
- **Authentication**: Clerk integration available but currently disabled - app uses device-based data isolation via X-Device-ID header

### Offline-First Design
- Service worker (public/sw.js) caches static assets and handles background sync
- IndexedDB serves as primary data store, syncing to PostgreSQL when online
- Sync queue mechanism stores operations when offline and replays when connectivity returns
- useOfflineStatus hook tracks online/offline state and sync progress

### Data Flow
1. User actions save to IndexedDB immediately
2. If online, changes sync to PostgreSQL backend
3. If offline, operations queue for later sync
4. On reconnection, useSyncQueue hook processes pending operations

### Key Design Patterns
- Device ID generation for public access with data isolation (no auth required)
- Shared schema between frontend and backend via @shared/schema.ts
- Form validation using Zod schemas derived from Drizzle table definitions
- Export functionality supporting JSON, Markdown, and PDF formats

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database (requires DATABASE_URL environment variable)
- **Drizzle ORM**: Database schema management and migrations (drizzle-kit for push operations)

### Authentication (Optional/Disabled)
- **Clerk**: Authentication service with React and Express SDKs (requires CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY)
- Currently bypassed - app uses device-based identification instead

### Frontend Libraries
- **TanStack Query**: Server state management and caching
- **LocalForage**: IndexedDB wrapper for offline storage
- **Recharts**: Data visualization for analytics
- **date-fns**: Date manipulation utilities
- **jsPDF**: PDF export generation
- **@uiw/react-md-editor**: Markdown editing for journal entries

### Third-Party APIs (Lab Demonstrations)
- **Open-Meteo**: Weather API (no key required)
- **GitHub API**: User profile data fetching
- Various browser APIs: Geolocation, Notifications, Clipboard