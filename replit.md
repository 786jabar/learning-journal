# Learning Journal PWA

## Overview

A full-stack Progressive Web App (PWA) for tracking learning journeys through journal entries and projects. Built with React, TypeScript, Express, and PostgreSQL, featuring offline-first architecture, real-time sync, and comprehensive analytics.

**Core Purpose:** Enable students and learners to document their educational progress, manage projects, and visualize learning patterns through an installable, offline-capable web application.

**Key Features:**
- Journal entries with markdown support and tagging
- Project management with tech stack tracking
- Visual analytics (streak tracking, heatmaps, charts)
- Full offline functionality with background sync
- Data export (JSON, Markdown, PDF)
- Multi-device support with device-based data isolation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite for fast development and optimized production builds
- Wouter for lightweight client-side routing (no React Router overhead)
- TanStack Query (React Query) for server state management and caching

**UI Design System:**
- Shadcn/ui components with Radix UI primitives for accessibility
- Tailwind CSS for utility-first styling with custom design tokens
- Glass morphism + gradient aesthetic (purple/pink theme)
- Responsive design with mobile-first approach

**State Management Strategy:**
- Server state: TanStack Query with aggressive caching
- Client state: React hooks (useState, useContext) for UI state
- Offline state: IndexedDB via localforage as primary data source
- Sync queue: Separate IndexedDB store for tracking pending operations

**Offline-First Architecture:**
- All data operations prioritize IndexedDB (local-first)
- API calls treated as sync operations, not primary data source
- Service worker caches static assets and API responses
- Background sync queue retries failed operations when online
- Optimistic UI updates for instant feedback

**Key Design Decisions:**
- **Why offline-first?** Mobile learners need uninterrupted access regardless of connectivity. Data saves locally first, syncs later.
- **Why device-based isolation?** Removed authentication complexity while maintaining data privacy. Each browser gets unique device ID.
- **Why TanStack Query?** Automatic request deduplication, background refetching, and built-in loading/error states reduce boilerplate.

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for RESTful API
- Drizzle ORM for type-safe database queries
- Neon serverless PostgreSQL for scalable data storage

**API Design:**
- RESTful endpoints following resource-based naming
- Device ID header (`X-Device-ID`) for request isolation
- JSON request/response format with consistent error handling
- CORS enabled for cross-origin requests

**Data Models:**
```
Users (device-based IDs)
├── Journal Entries (title, content, tags, date)
├── Projects (name, description, tech stack)
└── User Profile (student info, bio, avatar)
```

**Database Strategy:**
- PostgreSQL with Drizzle schema definitions
- Automatic timestamps (createdAt, updatedAt) via DB defaults
- Cascade deletes for related data integrity
- Array columns for tags and tech stacks (native PostgreSQL)

**Authentication Approach:**
- Removed Clerk authentication for public access
- Device-specific UUIDs generated on first visit
- Data isolation via userId foreign keys pointing to device IDs
- LocalStorage persists device ID across sessions

**Why this approach?**
- **Removed auth barrier:** Students can start journaling immediately without signup friction
- **Privacy maintained:** Each device's data stays isolated via unique IDs
- **Simpler deployment:** No API keys or OAuth configuration needed

### Data Storage Solutions

**Primary Storage: IndexedDB (via localforage)**
- Stores complete journal/project datasets locally
- Acts as source of truth for UI rendering
- Enables instant data access without network requests
- Three separate stores: journals, projects, syncQueue

**Sync Queue Mechanism:**
```
Operation Types:
- CREATE_JOURNAL / UPDATE_JOURNAL / DELETE_JOURNAL
- CREATE_PROJECT / UPDATE_PROJECT / DELETE_PROJECT

Flow:
1. User action → Save to IndexedDB immediately
2. Add operation to sync queue
3. If online → Send to server API + remove from queue
4. If offline → Queue persists until connectivity restored
5. Background sync retries queue on reconnection
```

**Why IndexedDB over LocalStorage?**
- No 5MB storage limit (can store thousands of entries)
- Structured data with indexes for efficient querying
- Asynchronous API prevents UI blocking
- Better support for complex objects (dates, arrays)

**Server Database: PostgreSQL**
- Centralized backup of all device data
- Enables future features (cross-device sync, data recovery)
- Supports complex queries for analytics
- Reliable persistence for production deployments

### External Dependencies

**Authentication (Removed but Code Remains):**
- Clerk SDK (`@clerk/clerk-react`, `@clerk/express`) - Commented out but not deleted
- Originally provided OAuth with Google, GitHub, Twitter, Apple
- Removed to simplify lab project, can be re-enabled

**Database & ORM:**
- `@neondatabase/serverless` - Serverless PostgreSQL client
- `drizzle-orm` - TypeScript ORM with zero-runtime overhead
- `drizzle-kit` - Migration tool for schema management

**UI Component Libraries:**
- `@radix-ui/*` - 20+ accessible component primitives
- `class-variance-authority` - Type-safe variant styling
- `tailwind-merge` - Intelligent Tailwind class merging
- `@uiw/react-md-editor` - Markdown editor with preview

**Data Visualization:**
- `recharts` - React chart library for analytics
- `date-fns` - Date manipulation for calendar features

**Offline Capabilities:**
- `localforage` - IndexedDB wrapper with localStorage fallback
- Service Worker (auto-generated by Vite PWA plugin)
- Cache Storage API for static asset caching

**Form Management:**
- `react-hook-form` - Performant form validation
- `zod` - TypeScript-first schema validation
- `@hookform/resolvers` - Zod integration for forms

**Utilities:**
- `nanoid` - Compact unique ID generation
- `jspdf` - Client-side PDF generation for exports

**Development Tools:**
- `vite` - Lightning-fast dev server and bundler
- `tsx` - TypeScript execution for server
- `esbuild` - Fast JavaScript bundler for production

**Deployment Platforms:**
- Vercel/Render - Frontend + API hosting
- Neon/Supabase - PostgreSQL database hosting
- PythonAnywhere - Alternative Flask backend (Lab 6)

**Third-Party APIs (Lab 4 Demos):**
- Open-Meteo API - Free weather data (no key required)
- Quotable API - Random inspirational quotes
- GitHub API - Public profile data
- Browser APIs: Geolocation, Notifications, Clipboard

**Why these specific choices?**
- **Neon over traditional PostgreSQL:** Serverless scales to zero, no idle costs
- **Drizzle over Prisma:** Lighter weight, closer to SQL, better TypeScript inference
- **Recharts over Chart.js:** React-native integration, responsive by default
- **localforage over raw IndexedDB:** Promise-based API, automatic fallbacks