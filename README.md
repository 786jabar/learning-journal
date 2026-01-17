# Learning Journal PWA

## Overview

A full-stack Progressive Web App (PWA) for tracking learning journeys. Built with React frontend, Express backend, PostgreSQL database via Drizzle ORM, and offline-first architecture using IndexedDB. Features journal entries, project tracking, analytics dashboards, and lab demonstration pages for academic coursework.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **Build Tool**: Vite with hot module replacement
- **Offline Storage**: IndexedDB via localforage for offline-first data persistence

### Backend Architecture
- **Runtime**: Node.js with Express
- **API Design**: RESTful JSON API with `/api/*` route prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL (@neondatabase/serverless)
- **Authentication**: Clerk for user authentication (currently configured but public access enabled via device-based IDs)

### Data Flow Pattern
1. Frontend stores data in IndexedDB first (offline-first)
2. Sync queue tracks pending operations when offline
3. When online, sync queue pushes changes to backend API
4. Backend persists to PostgreSQL and returns confirmation
5. Frontend merges server state with local state

### Key Design Decisions

**Offline-First Architecture**
- Problem: Users need access to data without internet connectivity
- Solution: IndexedDB as primary data store, PostgreSQL as sync target
- All CRUD operations work offline; sync happens when connection restores

**Device-Based Data Isolation**
- Problem: Public access needed without full authentication complexity
- Solution: Each browser gets a unique device ID stored in localStorage
- Data isolation maintained via device ID passed in `X-Device-ID` header

**Shared Schema Pattern**
- Problem: Type safety between frontend and backend
- Solution: Shared TypeScript types in `/shared/schema.ts` using Drizzle and Zod
- Insert schemas generated via `drizzle-zod` for validation

### Database Schema
Located in `shared/schema.ts`:
- `users` - Authentication user records
- `sessions` - Session storage for auth
- `journalEntries` - Learning journal entries with tags, content, dates
- `projects` - Project tracking with tech stack arrays
- `userProfile` - User profile information

### File Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities (db, export, auth)
│   │   └── pages/        # Route page components
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations
│   └── db.ts         # Drizzle connection
├── shared/           # Shared types/schemas
│   └── schema.ts     # Drizzle schema + Zod validation
├── public/           # Static assets, service worker
└── migrations/       # Drizzle database migrations
```

## External Dependencies

### Database
- **PostgreSQL** via Neon serverless (`@neondatabase/serverless`)
- Connection URL required in `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations (`drizzle-kit push`)

### Authentication
- **Clerk** (`@clerk/express`, `@clerk/clerk-react`)
- Requires `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` environment variables
- Currently bypassed for public access using device IDs

### Third-Party APIs (Lab Demos)
- Open-Meteo Weather API (no key required)
- GitHub API for user profiles
- Browser APIs: Clipboard, Notifications, Geolocation

### Key NPM Packages
- `localforage` - IndexedDB wrapper for offline storage
- `date-fns` - Date manipulation
- `recharts` - Analytics charts
- `jspdf` - PDF export functionality
- `@uiw/react-md-editor` - Markdown editor for journal entries
- `nanoid` - Unique ID generation for offline-created records