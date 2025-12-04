# Learning Journal PWA

## Overview

The Learning Journal is a Progressive Web App (PWA) designed for tracking learning progress through journal entries and project management. It features offline-first functionality, markdown support, analytics visualization, and a modern glassmorphism UI. The application serves as a comprehensive learning portfolio platform with data persistence across devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React + TypeScript SPA**
- Single-page application built with React 18 and TypeScript
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (no React Router dependency)
- Component-based architecture using shadcn/ui component library
- Tailwind CSS for styling with custom glassmorphism design system

**State Management**
- TanStack Query (React Query) for server state and caching
- Local React hooks for component-level state
- No global state management library (Redux/Zustand) - relying on React Query's cache

**Offline-First Strategy**
- IndexedDB via localforage for primary client-side storage
- Sync queue mechanism for offline operation queueing
- Data fetches prioritize local IndexedDB first, then sync with backend when online
- Device-specific data isolation using unique device IDs stored in localStorage

**UI Component System**
- Radix UI primitives for accessible headless components
- Custom theme system supporting light/dark modes
- Glassmorphism design pattern with backdrop blur effects
- Responsive layouts with mobile-first approach

### Backend Architecture

**Express.js REST API**
- Node.js/Express server with TypeScript
- RESTful API endpoints for CRUD operations
- No authentication system - public access with device-based data isolation
- Device ID passed via `X-Device-ID` header for data segmentation

**Data Flow Pattern**
- Client sends device ID with every request
- Server filters all queries by device ID (user isolation)
- No session management or cookies required
- Designed for Replit deployment environment

### Data Storage Solutions

**Database: PostgreSQL via Neon**
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript types generated from Drizzle schemas
- Tables: users, journal_entries, projects, user_profile, sessions
- All user data tables include userId foreign key for data isolation
- Timestamps tracked via createdAt/updatedAt fields

**Client Storage: IndexedDB**
- LocalForage wrapper for simplified IndexedDB operations
- Three stores: journals, projects, syncQueue
- Primary data source for the frontend (backend is secondary sync target)
- Enables full offline functionality

**Sync Architecture**
- Operations queue in IndexedDB when offline
- Background sync attempts when connectivity restored
- Merge strategy: IndexedDB serves as source of truth, backend as backup
- Client-generated IDs (nanoid) to prevent conflicts

### External Dependencies

**Third-Party Services**
- Neon PostgreSQL (Serverless Postgres database)
- Vercel (Deployment platform, configured but not primary)
- Replit (Primary deployment environment)

**Key NPM Packages**
- @tanstack/react-query: Server state management
- drizzle-orm: Type-safe ORM
- @neondatabase/serverless: Neon database driver
- @radix-ui/*: Headless UI components
- wouter: Lightweight routing
- localforage: IndexedDB abstraction
- @uiw/react-md-editor: Markdown editor component
- date-fns: Date manipulation
- recharts: Data visualization charts
- nanoid: Unique ID generation
- jsPDF: PDF export functionality

**Development Tools**
- Vite: Build tool and dev server
- TypeScript: Type safety
- Tailwind CSS: Utility-first styling
- ESBuild: Server-side bundling for production

### Design Patterns

**Offline-First Pattern**
- All data writes go to IndexedDB immediately
- Background sync queues operations for server when offline
- UI never blocks on network requests
- Optimistic updates for better UX

**Device-Based Multi-Tenancy**
- No user authentication system
- Each browser/device gets unique ID
- Device ID used for data filtering on backend
- Allows public access while maintaining data privacy

**Component Composition**
- Reusable UI components (cards, dialogs, forms)
- Hook-based data fetching patterns
- Separation of concerns: hooks for data, components for UI

**Type Safety Strategy**
- Shared schema definitions between client and server
- Drizzle generates TypeScript types from database schema
- Zod schemas for runtime validation
- End-to-end type safety from database to UI