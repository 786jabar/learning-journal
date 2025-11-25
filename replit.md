# Learning Journal PWA

## Overview

Learning Journal is a Progressive Web App (PWA) built with React, TypeScript, and Vite that allows users to track their learning journey through journal entries and project management. The application features offline-first functionality, real-time data synchronization, modern glassmorphism design, and comprehensive API integration demonstrating Storage APIs, Browser APIs, and Third-Party APIs. Users can create and manage journal entries with markdown support, organize projects with tech stacks, visualize their progress with analytics charts, export their data in multiple formats, and leverage browser capabilities like clipboard, notifications, and geolocation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Academic Integration

**Course**: FGCT6021 Mobile Application Development  
**Student**: Md Jawar Safi (#2315024)  
**Lab 3**: Vanilla JavaScript DOM Manipulation (Completed)  
**Lab 4**: API Integration - Storage, Browser & Third-Party APIs (Completed)  
**Lab 5**: Python & JSON Backend Data (Completed)  
**Lab 6**: Frontend & Backend Integration with Flask (Completed)

**Lab 4 Report**: Professional academic report available at `/lab4-report` with unique emerald/teal design, print-to-PDF functionality. Demonstrates 10 working APIs:
- **Storage APIs**: IndexedDB (journal/project management), LocalStorage (device ID persistence), SessionStorage (form state)
- **Browser APIs**: Geolocation (location tracking), Notifications (journal reminders), Clipboard (copy functionality)
- **Third-Party APIs**: WeatherAPI (weather data), GitHub (repository stats), NewsAPI (tech news), TikTok (profile data)

**Lab 5 Report**: Professional academic report available at `/lab5-report` demonstrating Python & JSON integration:
- **Backend**: Python script (save_entry.py) for creating and updating JSON files
- **Storage**: JSON file-based data persistence (/backend/reflections.json)
- **Frontend Integration**: Fetch API to load JSON data and render dynamically in DOM
- **Extra Features**: Reflection counter, export to JSON/CSV, category organization, refresh functionality
- **Answers**: Comprehensive responses to 4 journal reflection questions about file-based storage vs browser storage, Python implementation, data display differences, and custom features

**Lab 6 Report**: Professional academic report available at `/lab6-report` demonstrating Flask backend integration:
- **Backend**: Flask REST API with GET, POST, PUT, DELETE routes
- **Frontend-Backend Integration**: Fetch API communicating with Flask endpoints
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Extra Features**: Edit reflections (PUT), delete reflections (DELETE), real-time search/filter, refresh button, statistics dashboard
- **Answers**: Comprehensive responses to 5 journal questions about frontend-backend connection importance, HTTP methods, Flask vs browser JSON, PythonAnywhere challenges, and custom features

**Design Distinction**: Lab 4 report uses emerald/teal color scheme vs Lab 3's purple/blue to provide unique visual identity while maintaining professional presentation. Lab 5 integrates seamlessly with main app. Lab 6 demonstrates professional CRUD dashboard.

## System Architecture

### Frontend Architecture

**Core Framework**: React 18 with TypeScript, bundled via Vite for fast development and optimized production builds.

**Routing**: Wouter provides lightweight client-side routing. All routes are publicly accessible without authentication. A landing page is available to introduce new users to the app's features.

**State Management**: TanStack Query (React Query) manages server state with intelligent caching, automatic refetching, and optimistic updates. Local state uses React hooks.

**Offline-First Design**: IndexedDB (via localforage) serves as the primary data store. All CRUD operations write to IndexedDB immediately, then sync to the backend when online. A sync queue tracks pending operations for automatic background synchronization.

**UI Components**: Radix UI primitives provide accessible, unstyled components. ShadCN UI adds styled variants with Tailwind CSS for a glassmorphism design system featuring frosted glass cards, gradient accents, and smooth animations.

**Design System**: Hybrid approach combining Material Design 3 structure, glassmorphic floating elements, minimalist spacing, and bold gradient treatments. Custom CSS variables enable consistent theming with light/dark mode support.

### Backend Architecture

**Server Framework**: Express.js handles API routes, authentication middleware, and static file serving in production.

**Database ORM**: Drizzle ORM provides type-safe database operations with PostgreSQL (Neon serverless driver for HTTP-based connections without WebSocket requirements).

**API Design**: RESTful endpoints under `/api/*` for journals, projects, and user profiles. All routes are publicly accessible. Data isolation is maintained through device-specific IDs sent via X-Device-ID headers.

**Development Mode**: Vite dev server runs alongside Express with HMR support. Production mode serves compiled static assets from Express.

### Authentication & Authorization

**Public Access Model**: The application now operates without traditional user authentication. Instead of requiring sign-in, each browser/device receives a unique identifier for data isolation.

**Device-Based Isolation**: When a user first accesses the app, a unique device ID is generated using nanoid() and stored in the browser's localStorage. This ID persists across sessions and serves as the identity for all data operations.

**Header-Based Identity**: The frontend sends the device ID via an "X-Device-ID" custom header with every API request. The backend extracts this ID and uses it to isolate data per device.

**Data Scope**: All journals, projects, and user data are scoped to the device ID. Each browser maintains its own isolated workspace, preventing data sharing between different devices while requiring no authentication flow.

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