# Learning Journal PWA

A modern, offline-first Progressive Web App for tracking learning progress through journal entries and project management. Built with React, TypeScript, and a focus on beautiful design and exceptional user experience.

## Overview

Learning Journal is a productivity-focused web application that helps users document their learning journey, manage projects, and track progress over time. The app works seamlessly offline and syncs automatically when a connection is restored.

## Recent Changes

### November 7, 2025 - Multi-User Authentication Complete ✅
- Implemented Replit Auth with OpenID Connect (Google, GitHub, X, Apple)
- Added PostgreSQL database with users and sessions tables
- Created complete data isolation - each user sees only their own data
- Built beautiful landing page with branded provider buttons
- Synchronous route protection prevents unauthorized access
- Logout functionality with session cleanup
- Comprehensive end-to-end testing passed

### November 7, 2025 - MVP Complete ✅
- Implemented complete offline-first architecture with IndexedDB
- Fixed critical ID reconciliation for proper offline sync
- Added automatic sync queue processing when online
- Verified all features with comprehensive end-to-end testing
- Theme toggle with localStorage persistence
- Analytics dashboard with beautiful charts
- Markdown editor integration for journal entries
- Search and tag filtering functionality

## Project Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight SPA routing)
- **Styling**: Tailwind CSS + ShadCN UI components
- **State Management**: React Query + Custom hooks
- **Offline Storage**: IndexedDB via localforage
- **Charts**: Recharts for analytics visualizations
- **Markdown**: @uiw/react-md-editor

### Backend Stack
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL (Neon) for users, sessions, and data persistence
- **Authentication**: Replit Auth with OpenID Connect (Passport.js)
- **Session Management**: express-session with PostgreSQL storage
- **Storage**: Database storage with user-scoped queries
- **Validation**: Zod schemas
- **API**: RESTful endpoints with authentication middleware

### Key Design Decisions

#### Offline-First Architecture
- **Primary Storage**: IndexedDB via localforage (always available)
- **Backend**: Secondary storage for persistence and cross-device sync
- **Client IDs**: Generated with nanoid() and preserved by server
- **Sync Queue**: Automatic processing when connection restored
- **Optimistic Updates**: All writes to IndexedDB immediately, sync in background

#### ID Reconciliation Strategy
- Client generates IDs using nanoid() before any operation
- Server accepts client-provided `id`, `createdAt`, `updatedAt` fields
- PUT routes validate only required fields to allow queued updates
- Sync queue uses shared db instance for proper item removal
- No duplicate entries, no ID mismatches, no stuck operations

### File Structure
```
├── client/src/
│   ├── components/       # Reusable UI components (Navbar, Footer, Cards)
│   ├── pages/           # Page components (Landing, Home, Journal, Projects, About)
│   ├── hooks/           # Custom hooks (useAuth, useJournals, useProjects, useSyncQueue)
│   ├── lib/             # Utilities (db, theme-provider, queryClient)
│   └── App.tsx          # Main app with auth-protected routing
├── server/
│   ├── replitAuth.ts    # Replit Auth/OpenID Connect setup
│   ├── routes.ts        # API endpoints with authentication
│   ├── storage.ts       # Database storage with user scoping
│   └── db.ts            # Drizzle ORM database connection
├── shared/
│   └── schema.ts        # Shared types, Zod schemas, database schema
└── design_guidelines.md # UI/UX design system
```

## User Preferences

- **Design Aesthetic**: Material Design 3 + Notion-inspired productivity focus
- **Typography**: Inter for UI, JetBrains Mono for code
- **Color Scheme**: Professional with beautiful gradients and subtle shadows
- **Offline-First**: Core requirement - app must work fully offline
- **Data Persistence**: IndexedDB as primary, backend as secondary
- **User Experience**: Fast, responsive, with smooth animations

## Features

### Multi-User Authentication
- **Login Providers**: Google, GitHub, X (Twitter), Apple
- **Landing Page**: Beautiful branded buttons for each provider
- **Session Management**: Secure PostgreSQL-backed sessions
- **Route Protection**: Synchronous guards prevent unauthorized access
- **Data Isolation**: Complete separation - users only see their own data
- **Logout**: Clean session termination with redirect to landing page
- **No Branding**: Clean UI without provider branding in app interface

### Journal Entries
- Create, edit, delete journal entries
- Markdown editor with live preview
- Tag-based organization
- Search and filter by tags
- Date-based sorting
- Works completely offline

### Project Management
- Track projects with descriptions
- Tech stack management (add/remove technologies)
- Project cards with visual hierarchy
- Persistent storage with sync

### Analytics Dashboard
- Weekly entry statistics with bar chart
- Tag distribution with pie chart
- Active project count
- Recent entries preview
- Beautiful data visualizations

### PWA Features
- Offline-first with IndexedDB
- Automatic background sync
- Installable on mobile/desktop
- Dark/light theme toggle
- Responsive design for all screen sizes
- SEO optimized with meta tags

## API Endpoints

All endpoints require authentication and are scoped by userId for data isolation. Client-generated IDs are preserved for offline-first sync.

### Authentication
- `GET /api/login` - Initiate OAuth login flow
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - Logout and clear session
- `GET /api/auth/user` - Get current authenticated user

### Journals
- `GET /api/journals` - Fetch all journal entries
- `GET /api/journals/:id` - Fetch single entry
- `POST /api/journals` - Create entry (accepts id, createdAt, updatedAt)
- `PUT /api/journals/:id` - Update entry
- `DELETE /api/journals/:id` - Delete entry

### Projects
- `GET /api/projects` - Fetch all projects (user-scoped)
- `GET /api/projects/:id` - Fetch single project (user-scoped)
- `POST /api/projects` - Create project (accepts id, createdAt, updatedAt)
- `PUT /api/projects/:id` - Update project (user-scoped)
- `DELETE /api/projects/:id` - Delete project (user-scoped)

### Profile
- `GET /api/profile` - Get user's profile
- `POST /api/profile` - Create/update user profile

## Custom Hooks

### useAuth()
Returns: `{ user, isAuthenticated, isLoading }`
- Checks authentication status via `/api/auth/user`
- Provides current user information
- Used for route protection and conditional rendering

### useJournals()
Returns: `{ journals, isLoading, createJournal, updateJournal, deleteJournal, isCreating, isUpdating }`
- Manages journal entries in IndexedDB
- Queues operations for backend sync
- Provides optimistic updates

### useProjects()
Returns: `{ projects, isLoading, createProject, updateProject, deleteProject, isCreating, isUpdating }`
- Manages projects in IndexedDB
- Queues operations for backend sync
- Provides optimistic updates

### useSyncQueue()
- Monitors online/offline status
- Processes queued operations when online
- Uses shared db instance for proper queue drainage
- Invalidates React Query cache after sync

## Development Guidelines

### Running the Project
```bash
npm run dev  # Starts both frontend (Vite) and backend (Express)
```

### Adding New Features
1. Define schema in `shared/schema.ts` with Zod validation
2. Update storage interface in `server/storage.ts`
3. Add API routes in `server/routes.ts` with proper validation
4. Create custom hook in `client/src/hooks/` for offline-first operations
5. Build UI components using ShadCN + Tailwind
6. Follow design_guidelines.md for consistent styling

### Offline-First Patterns
- Always write to IndexedDB first
- Queue operations in `db.addToSyncQueue()`
- Server accepts client IDs to prevent duplicates
- Extract only required fields in PUT routes for validation
- Use shared db instance for queue operations

## Testing

End-to-end testing verified:
- ✅ Landing page with branded login buttons (Google, GitHub, X, Apple)
- ✅ Protected route blocking for unauthenticated users
- ✅ Authentication flow with OAuth providers
- ✅ Complete data isolation between users
- ✅ Logout functionality and session cleanup
- ✅ Journal entry creation, editing, deletion
- ✅ Project creation with tech stack management
- ✅ Theme toggle persistence
- ✅ Search and tag filtering
- ✅ Analytics dashboard with live data
- ✅ All API endpoints returning correct data
- ✅ Offline-first architecture functioning properly

## Next Steps / Future Enhancements

Potential improvements for future iterations:
- Service worker for true offline installability
- Export/import data functionality
- Rich text formatting options
- Collaborative features (sharing entries)
- Mobile app (React Native)
- Advanced analytics (streaks, goals)
- Cloud backup integration
- Automated testing suite

## Technical Notes

- **Authentication**: Replit Auth with OpenID Connect supporting Google, GitHub, X, and Apple
- **Database**: PostgreSQL (Neon) with Drizzle ORM for type-safe queries
- **Sessions**: PostgreSQL-backed sessions with connect-pg-simple for reliability
- **Service Worker**: Configured via vite-plugin-pwa (requires additional setup for full offline caching)
- **Deployment**: Ready for deployment via Replit publishing

## Database Schema

### Users Table
- `id`: varchar (primary key, UUID from OAuth sub claim)
- `email`: varchar (unique)
- `firstName`, `lastName`: varchar
- `profileImageUrl`: varchar
- `createdAt`, `updatedAt`: timestamp

### Sessions Table
- `sid`: varchar (primary key)
- `sess`: jsonb (session data)
- `expire`: timestamp (session expiration)

### User Data Tables
All user data tables (`journal_entries`, `projects`, `user_profiles`) include:
- `userId`: varchar (foreign key to users.id)
- Cascade delete when user is removed
- All queries filtered by userId for data isolation

## Support

For issues or questions about this implementation, refer to:
- design_guidelines.md for UI/UX patterns
- shared/schema.ts for data models
- Custom hooks for offline-first patterns
- API routes for backend integration
