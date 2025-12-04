# Learning Journal PWA - Replit Documentation

## Overview

The Learning Journal is a Progressive Web App (PWA) designed to help students and learners track their educational journey through journal entries, project documentation, and analytics visualization. Built with React, TypeScript, and a Node.js/Express backend, the application features offline-first functionality, beautiful glassmorphism UI design, and comprehensive data management capabilities.

The application serves as a comprehensive learning tool that demonstrates modern web development practices including:
- Full-stack TypeScript development
- RESTful API design
- Offline-first architecture with IndexedDB
- Progressive Web App features (service workers, caching)
- Real-time data synchronization
- Rich text editing with Markdown support
- Data visualization and analytics

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool for fast development and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query for server state management and caching

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Glassmorphism design system with custom glass-card components
- Dark/light theme support via context provider
- Responsive design optimized for mobile and desktop

**State Management Strategy**
- Custom hooks pattern for encapsulating business logic (`useJournals`, `useProjects`, `useProfile`)
- TanStack Query for server state with automatic background refetching
- LocalForage (IndexedDB wrapper) for offline-first local storage
- Device-specific data isolation using unique device IDs stored in localStorage

**Data Flow Pattern**
- IndexedDB serves as the primary data source (offline-first)
- Background sync with backend API when online
- Optimistic updates for instant UI feedback
- Sync queue mechanism for offline operations that replay when connectivity returns

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the HTTP server
- Node.js runtime environment
- RESTful API design with JSON payloads

**Authentication & Authorization**
- **No traditional authentication** - public access model
- Device-based data isolation using `X-Device-ID` header
- Each browser/device gets a unique ID for data segregation
- Clerk authentication infrastructure present but not actively used

**API Structure**
- `/api/journals` - CRUD operations for journal entries
- `/api/projects` - CRUD operations for projects
- `/api/profile` - User profile management
- Custom device ID header (`X-Device-ID`) for all requests

**Data Validation**
- Zod schemas for runtime type validation
- Drizzle-Zod integration for automatic schema generation from database models
- Client and server-side validation using shared schema definitions

### Data Storage Solutions

**Database Configuration**
- Drizzle ORM for type-safe database queries
- PostgreSQL via Neon serverless driver (configured but not required initially)
- Schema-first approach with migrations support

**Database Schema**
- `users` table - User accounts (email, profile info, timestamps)
- `journal_entries` table - Learning reflections with markdown content, tags, dates
- `projects` table - Project documentation with tech stack arrays
- `user_profile` table - Extended profile information (university, program, bio)
- `sessions` table - Session storage for authentication

**Offline Storage**
- LocalForage (IndexedDB) for structured offline data storage
- Separate stores for journals, projects, and sync queue
- Automatic data persistence and retrieval
- Conflict-free merging strategy (last-write-wins on sync)

**Caching Strategy**
- Service worker caching for static assets
- Cache-first strategy for offline resilience
- Network-first with cache fallback for API requests
- Sync queue stores pending operations during offline periods

### External Dependencies

**Third-Party UI Libraries**
- `@radix-ui/*` - Accessible, unstyled UI primitives (20+ components)
- `@uiw/react-md-editor` - Markdown editor with preview
- `recharts` - Data visualization charts (bar, line, pie charts)
- `date-fns` - Date manipulation and formatting
- `lucide-react` - Icon library

**Development Tools**
- `drizzle-kit` - Database migration tool
- `tsx` - TypeScript execution for development
- `esbuild` - Fast JavaScript bundling for production
- `vite` - Frontend build tool and dev server

**Data & State Management**
- `@tanstack/react-query` - Server state management
- `localforage` - IndexedDB wrapper for offline storage
- `nanoid` - Unique ID generation for entries and devices

**Form & Validation**
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Integration between react-hook-form and Zod

**Database & Backend**
- `@neondatabase/serverless` - PostgreSQL serverless driver
- `drizzle-orm` - TypeScript ORM
- `express` - Node.js web framework

**Authentication Infrastructure**
- `@clerk/clerk-react` - Frontend authentication components
- `@clerk/express` - Backend authentication middleware
- Note: Currently not enforcing authentication - public access mode

**Styling**
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `clsx` & `tailwind-merge` - Class name utilities

**PWA Features**
- Service worker for offline functionality
- Manifest file for installable app experience
- Cache API for resource caching
- Background sync for offline operation replay

**Deployment**
- Vercel configuration for serverless deployment
- Production builds via Vite and esbuild
- Environment variable management for database URLs and API keys