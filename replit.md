# Learning Journal PWA

## Overview

A Progressive Web App (PWA) for tracking learning journeys through journal entries and project documentation. The application features offline-first architecture, enabling users to document their learning progress with markdown support, tag-based organization, and visual analytics. Built as a modern web application with glassmorphism design, the app works seamlessly both online and offline, syncing data when connectivity is restored.

The application serves dual purposes: (1) a functional learning journal for students and self-learners, and (2) a demonstration platform for various web development concepts including DOM manipulation, browser APIs, backend integration with Python/Flask, and progressive web app capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, providing fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing (alternative to React Router)
- Path aliases configured via TypeScript (`@/`, `@shared/`, `@assets/`) for clean imports

**UI & Styling**
- Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- Tailwind CSS with custom configuration for design tokens and theming
- Dark/light theme support with system preference detection
- Glassmorphism design pattern with custom CSS variables for elevated UI elements
- Custom color system using HSL values for flexible theming

**State Management**
- TanStack Query (React Query) for server state management and caching
- LocalForage (IndexedDB wrapper) for client-side data persistence
- Custom hooks pattern for business logic encapsulation
- Optimistic updates with automatic rollback on errors

**Offline-First Strategy**
- IndexedDB as primary data store using LocalForage
- Sync queue mechanism to track offline changes
- Automatic background sync when connection restored
- Device-specific IDs for data isolation (no authentication required)

**Data Flow**
1. User interactions update IndexedDB immediately (optimistic UI)
2. Operations queued for sync when offline
3. Background process syncs with backend when online
4. Server data merged back into IndexedDB on fetch

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for RESTful API endpoints
- Separation of concerns: routing, storage layer, authentication middleware

**Database & ORM**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database queries and migrations
- Schema definitions shared between frontend and backend via `shared/schema.ts`

**Data Isolation Strategy**
- No traditional authentication system
- Device-based isolation using unique device IDs (`X-Device-ID` header)
- Each device/browser gets its own data partition
- Fallback to guest ID for backward compatibility

**API Structure**
- RESTful endpoints following standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent error handling with HTTP status codes
- JSON request/response format
- Device ID extracted from headers for all operations

**Session Management**
- Session table exists for future authentication (currently unused)
- Connect-pg-simple for PostgreSQL-backed sessions
- Prepared for Clerk authentication integration (infrastructure present, not active)

### Database Schema

**Core Tables**

1. **users** - User accounts (prepared for future use)
   - id, email, firstName, lastName, profileImageUrl, timestamps

2. **journal_entries** - Learning journal entries
   - id (client-generated), userId (device ID), title, content, tags (array), date, timestamps
   - Client provides IDs for offline-first sync

3. **projects** - Learning projects documentation
   - id (client-generated), userId (device ID), name, description, techStack (array), timestamps

4. **user_profile** - Extended user information
   - userId, name, studentId, university, program, email, courseDirector, bio, profilePicture

**Key Design Decisions**
- Client-generated IDs using nanoid for offline capability
- Device ID as userId for data isolation without authentication
- Array fields (tags, techStack) for flexible categorization
- Timestamps managed by both client and server for sync conflict resolution

### External Dependencies

**Database Service**
- Neon Serverless PostgreSQL - Cloud-hosted PostgreSQL with HTTP interface
- Environment variable: `DATABASE_URL`

**Future Authentication (Infrastructure Ready)**
- Clerk - Authentication service (middleware configured but not active)
- Environment variables: `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- Frontend and backend integration present but commented out

**Third-Party APIs (Demonstration Features)**
- Open-Meteo Weather API - Free weather data (no API key required)
- Quotable API - Random quotes
- GitHub API - User profile lookup
- TikTok RapidAPI - User stats (requires API key in demo)

**Build & Deployment**
- Vercel - Hosting platform (configuration in vercel.json)
- ESBuild - Server-side bundling for production
- TypeScript compiler for type checking

**Development Tools**
- Replit-specific plugins for development environment (cartographer, dev banner, runtime error modal)
- Conditional loading based on REPL_ID environment variable

**Frontend Libraries**
- @tanstack/react-query - Data fetching and caching
- localforage - IndexedDB wrapper for offline storage
- date-fns - Date manipulation and formatting
- recharts - Data visualization and charts
- jspdf - PDF generation for exports
- react-hook-form + zod - Form validation
- @uiw/react-md-editor - Markdown editor component

**Additional Notes**
- Lab demonstrations (Lab 3-6) showcase progressive enhancement of features
- Python backend integration demonstrated in Lab 5 (file-based JSON storage)
- Flask integration demonstrated in Lab 6 (REST API)
- PWA capabilities include offline mode, installability, and background sync