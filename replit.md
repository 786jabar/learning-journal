# Learning Journal PWA

## Overview

A modern, offline-first Progressive Web App for tracking learning journeys. Users can create journal entries with markdown support, manage projects with tech stacks, and visualize their progress through analytics dashboards. The application features a beautiful glassmorphism UI design and works seamlessly offline using IndexedDB for local storage with backend synchronization capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching
- Tailwind CSS with custom design system for styling
- shadcn/ui component library with glassmorphism theme
- Vite as the build tool and development server

**State Management:**
- TanStack Query handles all server state with automatic caching and synchronization
- Custom hooks (`useJournals`, `useProjects`) abstract data operations
- React Hook Form with Zod schemas for form validation
- Local component state for UI interactions

**Offline-First Strategy:**
- IndexedDB (via localforage) serves as the primary data source
- All reads fetch from local storage first, then sync with server when online
- Sync queue pattern queues mutations when offline and replays them when connectivity returns
- Custom hooks (`useOfflineStatus`, `useSyncQueue`) manage online/offline state

**Data Flow Pattern:**
1. User action triggers mutation via custom hook
2. Data saved immediately to IndexedDB for instant UI updates
3. If online: API request sent to backend simultaneously
4. If offline: Operation queued in sync queue for later execution
5. When back online: Sync queue automatically processes pending operations

### Backend Architecture

**Technology Stack:**
- Express.js server with TypeScript
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL for production database
- Device-based authentication (no user accounts required)

**API Design:**
- RESTful endpoints following standard HTTP methods
- Device ID header (`X-Device-ID`) for data isolation without authentication
- Each device gets a unique UUID stored in localStorage
- All routes are public - authentication removed to simplify access

**Data Isolation:**
- Device-specific IDs replace user authentication
- Server filters all queries by device ID from request headers
- Each device maintains its own isolated dataset
- Enables public access while preventing cross-device data contamination

**Database Schema:**
- `journal_entries`: Stores learning reflections with markdown content, tags, and timestamps
- `projects`: Manages project records with tech stack arrays
- `user_profile`: Optional profile information per device
- Foreign keys on `userId` (actually device ID) cascade deletes

### Data Storage Solutions

**Client-Side Storage (Primary):**
- IndexedDB via localforage library for structured data persistence
- Separate stores for journals, projects, and sync queue
- Supports offline-first architecture with instant reads
- Data survives browser restarts and updates

**Server-Side Storage (Sync Target):**
- PostgreSQL database via Neon serverless platform
- Drizzle ORM provides type-safe queries matching schema definitions
- Automatic schema migrations via drizzle-kit
- Connection pooling handled by Neon's HTTP interface

**Data Synchronization:**
- Optimistic UI updates write to IndexedDB first
- Background sync attempts server update when online
- Conflict resolution uses "last write wins" strategy
- Failed operations queue for retry with exponential backoff

### External Dependencies

**Database:**
- Neon Serverless PostgreSQL - Cloud-hosted database with HTTP access
- Connection string provided via `DATABASE_URL` environment variable
- Drizzle ORM handles migrations and type-safe queries

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui built on top of Radix with Tailwind styling
- Custom theme system with CSS variables for dark/light modes
- Recharts for data visualization (bar charts, pie charts, heatmaps)

**Development Tools:**
- Vite for fast development and optimized production builds
- TypeScript for type safety across client and server
- ESBuild for server-side bundling
- Replit-specific plugins for development environment integration

**Third-Party Services:**
- None currently - app is fully self-contained
- Future consideration: Clerk authentication (infrastructure present but disabled)

**Key Libraries:**
- `date-fns`: Date manipulation and formatting
- `nanoid`: Unique ID generation for entities and devices
- `zod`: Runtime schema validation
- `react-hook-form`: Form state management
- `@uiw/react-md-editor`: Markdown editing with preview
- `jspdf`: PDF export functionality