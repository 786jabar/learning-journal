# Learning Journal PWA

## Overview

A modern, offline-first Progressive Web App (PWA) for tracking learning journeys through journal entries and projects. The application features a React-based frontend with TypeScript, an Express backend, and PostgreSQL database via Drizzle ORM. Built with a focus on offline capabilities using IndexedDB for local storage and automatic background synchronization when online.

The app includes multiple lab demonstrations (Lab 3-6) showcasing various web development concepts including DOM manipulation, browser APIs, Python backend integration, and Flask REST APIs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR
- Wouter for lightweight client-side routing
- TailwindCSS with custom design system featuring glassmorphism effects

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management and caching
- LocalForage (IndexedDB wrapper) for offline-first local data persistence
- Custom hooks pattern for data operations (useJournals, useProjects, useProfile)

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Custom theme system with dark/light mode support via context
- Responsive design with mobile-first breakpoints
- Glassmorphism design pattern with backdrop blur and translucent surfaces

**Offline-First Strategy**
- IndexedDB as primary data source for journals and projects
- Sync queue system to track pending operations when offline
- Automatic background sync when connection restored
- Device-based data isolation using unique device IDs stored in localStorage

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for RESTful API endpoints
- Middleware: JSON body parser, CORS handling, request logging
- Development: Vite middleware integration for HMR in dev mode
- Production: Static file serving for SPA deployment

**Authentication & Authorization**
- Clerk for authentication (configured but optional in current implementation)
- Device ID-based data isolation for public access without accounts
- X-Device-ID header used to segregate data per browser/device
- Fallback "guest" mode for backward compatibility

**API Design**
- RESTful endpoints for CRUD operations on journals, projects, and profiles
- Standardized error handling with HTTP status codes
- Client-provided IDs and timestamps accepted for offline sync support
- Validation using Zod schemas shared between client and server

### Data Storage Solutions

**Database**
- PostgreSQL via Neon serverless (connection pooling via HTTP)
- Drizzle ORM for type-safe database queries and migrations
- Schema defined in shared directory for client/server consistency

**Schema Structure**
- `users`: Authentication and profile data (Clerk integration ready)
- `journal_entries`: Learning journal posts with markdown content, tags, and dates
- `projects`: Portfolio projects with tech stack arrays
- `user_profile`: Extended user metadata (name, student ID, university info)
- `sessions`: Session storage for future authentication needs

**Dual Storage Pattern**
- Server: PostgreSQL for authoritative data
- Client: IndexedDB (via LocalForage) for offline-first access
- Sync: Background reconciliation between local and server on connectivity changes

### Authentication and Authorization

**Current Implementation**
- Public access mode - no authentication required
- Device ID isolation ensures data privacy per browser
- Each device gets unique nanoid-based identifier in localStorage

**Clerk Integration (Available)**
- Frontend: @clerk/clerk-react for UI components
- Backend: @clerk/express middleware for protected routes
- Configuration present but not enforced (commented isAuthenticated middleware)
- Easy migration path: uncomment middleware and add sign-in UI

### External Dependencies

**Third-Party Services**
- Clerk: Authentication platform (configured, not active)
- Neon: Serverless PostgreSQL hosting
- Vercel: Deployment platform (config present)

**Browser APIs Demonstrated (Lab 4)**
- Storage APIs: localStorage, sessionStorage, IndexedDB
- Clipboard API: Copy/paste with formatted content support
- Notifications API: Browser notifications with permission handling
- Geolocation API: User location tracking
- Weather API: OpenMeteo integration for location-based data
- Quotes API: Third-party content fetching

**UI Libraries**
- Radix UI: Headless component primitives (40+ components)
- Recharts: Data visualization for analytics dashboard
- MDEditor: Markdown editing with preview
- jsPDF: Client-side PDF generation for exports
- date-fns: Date manipulation and formatting

**Development Tools**
- Drizzle Kit: Database migrations and schema management
- ESBuild: Production server bundling
- TSX: TypeScript execution for development
- Replit plugins: Development environment integration

**Lab Demonstrations**
- Lab 3: Vanilla JavaScript DOM manipulation
- Lab 4: Browser Storage & Third-Party APIs
- Lab 5: Python backend with JSON file persistence
- Lab 6: Flask REST API integration (separate from main Express backend)