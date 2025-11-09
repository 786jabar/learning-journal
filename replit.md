# Learning Journal PWA

## Overview

Learning Journal is a Progressive Web App (PWA) built with React, TypeScript, and Vite that allows users to track their learning journey through journal entries and project management. The application features offline-first functionality, real-time data synchronization, and a modern glassmorphism design aesthetic. Users can create and manage journal entries with markdown support, organize projects with tech stacks, visualize their progress with analytics charts, and export their data in multiple formats.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript, bundled via Vite for fast development and optimized production builds.

**Routing**: Wouter provides lightweight client-side routing with authentication-aware route protection. Unauthenticated users see only the landing page; authenticated users access the full application.

**State Management**: TanStack Query (React Query) manages server state with intelligent caching, automatic refetching, and optimistic updates. Local state uses React hooks.

**Offline-First Design**: IndexedDB (via localforage) serves as the primary data store. All CRUD operations write to IndexedDB immediately, then sync to the backend when online. A sync queue tracks pending operations for automatic background synchronization.

**UI Components**: Radix UI primitives provide accessible, unstyled components. ShadCN UI adds styled variants with Tailwind CSS for a glassmorphism design system featuring frosted glass cards, gradient accents, and smooth animations.

**Design System**: Hybrid approach combining Material Design 3 structure, glassmorphic floating elements, minimalist spacing, and bold gradient treatments. Custom CSS variables enable consistent theming with light/dark mode support.

### Backend Architecture

**Server Framework**: Express.js handles API routes, authentication middleware, and static file serving in production.

**Database ORM**: Drizzle ORM provides type-safe database operations with PostgreSQL (Neon serverless driver for HTTP-based connections without WebSocket requirements).

**API Design**: RESTful endpoints under `/api/*` for journals, projects, user profiles, and authentication. All protected routes require valid authentication tokens.

**Development Mode**: Vite dev server runs alongside Express with HMR support. Production mode serves compiled static assets from Express.

### Authentication & Authorization

**Provider**: Clerk handles all authentication flows (sign-up, sign-in, session management) with support for multiple OAuth providers (Google, GitHub, X/Twitter, Apple).

**Session Management**: Clerk manages sessions via HTTP-only cookies. Express middleware validates requests and extracts user identity.

**User Sync**: Upon authentication, Clerk user data syncs to the local PostgreSQL database, creating user records that link to journal entries and projects.

**Route Protection**: Frontend checks authentication status before rendering protected pages. Backend middleware validates all API requests except public endpoints.

### Data Storage & Synchronization

**Primary Storage**: IndexedDB stores journals, projects, and sync queue entries locally. This enables full offline functionality.

**Database Schema**: PostgreSQL tables for users, journal entries, projects, and user profiles. Foreign keys maintain referential integrity with cascade delete rules.

**Sync Strategy**: When online, data fetches from the server and merges into IndexedDB. When creating/updating/deleting, operations write to IndexedDB immediately and queue for server sync. Background sync processes the queue when connectivity returns.

**Conflict Resolution**: Last-write-wins strategy. Server data overwrites local data during sync operations.

### Progressive Web App Features

**Service Worker**: Vite PWA plugin generates service workers for offline caching and background sync capabilities.

**Installability**: Web manifest defines app metadata, icons, and display preferences for installation on mobile/desktop.

**Offline Support**: Application shell, assets, and IndexedDB data enable full functionality without network connectivity.

**Network Awareness**: UI indicators show online/offline status and sync progress. Optimistic updates provide immediate feedback.

## External Dependencies

### Authentication Service
- **Clerk** (`@clerk/clerk-react`, `@clerk/express`): SaaS authentication platform managing user identity, sessions, and OAuth integrations

### Database & ORM
- **PostgreSQL**: Relational database (deployed via Neon, Supabase, or Railway)
- **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`): Type-safe database toolkit with migrations
- **Neon Serverless** (`@neondatabase/serverless`): HTTP-based PostgreSQL client for serverless environments

### UI Framework & Components
- **Radix UI** (`@radix-ui/react-*`): Comprehensive set of accessible, unstyled component primitives (dialogs, dropdowns, tooltips, forms, etc.)
- **ShadCN UI**: Pre-styled component library built on Radix UI and Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework with custom theme configuration
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets (for brand logos on landing page)

### Forms & Validation
- **React Hook Form** (`react-hook-form`): Form state management with minimal re-renders
- **Zod** (`zod`, `@hookform/resolvers`): Schema validation integrated with forms and API

### Data Visualization
- **Recharts**: React charting library for bar charts and pie charts on the home page

### Markdown Support
- **MDEditor** (`@uiw/react-md-editor`): WYSIWYG markdown editor with preview for journal entries

### Offline & Storage
- **Localforage**: IndexedDB wrapper with fallback to localStorage/WebSQL
- **Vite PWA Plugin** (`vite-plugin-pwa`): Service worker generation and PWA manifest handling

### Development Tools
- **Vite**: Build tool and dev server with HMR
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript/TypeScript bundler for production backend
- **React Query DevTools**: Query debugging during development

### Utilities
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation for client-side entries
- **class-variance-authority**: Component variant management
- **clsx** / **tailwind-merge**: Conditional className utilities
- **jsPDF**: PDF generation for data exports

### Deployment Platforms (Optional)
- **Vercel**: Frontend hosting with serverless functions
- **Neon**: PostgreSQL database hosting
- **Supabase**: Alternative PostgreSQL with built-in APIs
- **Railway**: Full-stack deployment with database provisioning