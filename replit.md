# Learning Journal PWA

## Overview

A Progressive Web App (PWA) for tracking learning journeys. Users can create journal entries, manage projects, play memory games, and draw on canvas. The application is designed as an offline-first PWA with device-based data isolation - each browser/device gets its own unique ID for data separation without requiring authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration
- **Offline Storage**: IndexedDB via localforage for client-side persistence

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Design**: RESTful JSON APIs under `/api/*` routes
- **Database ORM**: Drizzle ORM with PostgreSQL (Neon serverless)
- **Authentication**: Clerk integration available but currently disabled - app uses device-based identification instead

### Offline-First Design
- Service Worker (`public/sw.js`) handles caching and offline functionality
- IndexedDB stores journals and projects locally
- Sync queue system queues operations when offline, syncs when back online
- Device ID generated and stored in localStorage for data isolation

### Data Flow
1. UI queries local IndexedDB first (immediate response)
2. If online, fetches from server and merges into IndexedDB
3. Mutations save to IndexedDB immediately, queue API calls for sync
4. Device ID header (`X-Device-ID`) sent with all API requests for data isolation

### Key Design Patterns
- **Offline-first**: Local storage is the source of truth, server syncs in background
- **Device-based isolation**: No login required, each browser gets unique data space
- **Component composition**: Reusable UI components with consistent styling
- **Type safety**: Shared schema types between frontend and backend via `@shared/*` path alias

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless Postgres via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database queries and migrations
- Connection string via `DATABASE_URL` environment variable

### Authentication (Available but disabled)
- **Clerk**: Full authentication system integrated but currently bypassed
- Device-based identification used instead for public access

### Third-Party APIs (Lab demonstrations)
- **Open-Meteo**: Weather data (no API key required)
- **GitHub API**: Via `@octokit/rest` for repository operations
- **Replit GitHub Connector**: For authenticated GitHub access in Replit environment

### Frontend Libraries
- **TanStack Query**: Server state management and caching
- **Radix UI**: Accessible UI primitives
- **date-fns**: Date manipulation
- **recharts**: Data visualization charts
- **jsPDF**: PDF generation for exports
- **@uiw/react-md-editor**: Markdown editing

### PWA Features
- Web Manifest (`manifest.webmanifest`)
- Service Worker for offline caching
- Push notification support
- Installable on mobile and desktop