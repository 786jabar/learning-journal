# Lab 6: Database Integration

## Question 1: Database Setup (200-300 words)

I integrated PostgreSQL as the primary relational database for persistent server-side storage, replacing the file-based JSON approach for improved scalability, concurrent access handling, and data integrity. Using Drizzle ORM with TypeScript, I defined strongly-typed database schemas that provide compile-time type checking and autocompletion. The schema includes tables for journal entries (id, title, content, tags, created_at, updated_at, device_id), projects (id, name, description, tech_stack, status, progress, github_url), and user preferences (theme, notification settings, sync preferences). I established the database connection using the @neondatabase/serverless package which provides a PostgreSQL-compatible interface optimized for serverless environments with connection pooling. The DATABASE_URL environment variable securely stores connection credentials, keeping sensitive information out of the codebase. Schema migrations are handled through Drizzle Kit's push command (npm run db:push) which safely synchronizes the TypeScript schema definitions with the actual database structure without requiring manual SQL migration files. Foreign key relationships and indexes are defined declaratively in the schema, ensuring referential integrity and query performance.

---

## Question 2: CRUD Operations (200-300 words)

I implemented comprehensive Create, Read, Update, Delete (CRUD) operations through a clean storage interface abstraction that separates data access logic from route handlers. CREATE operations use Drizzle's insert() method with returning() to insert new records and return the created entity with its auto-generated ID and timestamps. READ operations utilize select() with optional where() clauses for filtering by device_id, category, date ranges, or search terms, supporting both single-record retrieval (findFirst) and collection queries (findMany) with orderBy for sorting. UPDATE operations employ update().set().where() chains to modify specific fields of existing records, with optimistic locking using updated_at timestamps to prevent concurrent modification conflicts. DELETE operations use delete().where() to remove records, with soft-delete patterns (setting a deleted_at timestamp) available for recoverable deletion. All operations are wrapped in try-catch blocks with appropriate error handling, returning meaningful HTTP status codes (200 OK, 201 Created, 204 No Content, 404 Not Found, 500 Internal Server Error) and JSON error messages. The storage interface (IStorage) defines the contract that both database and in-memory implementations must fulfill, enabling easy testing with mock data.

---

## Question 3: Frontend-Backend Communication (200-300 words)

The frontend communicates with the database through RESTful API endpoints defined in the Express.js backend using the Fetch API wrapped in TanStack Query for intelligent caching, automatic refetching, and optimistic updates. GET requests to endpoints like /api/entries retrieve data that TanStack Query caches by query key, preventing redundant network requests and enabling instant UI updates from cache. POST, PUT, and DELETE requests use the apiRequest helper function which handles JSON serialization, error responses, and authentication headers. After mutations, queryClient.invalidateQueries() triggers automatic refetching of affected data, ensuring the UI reflects the latest database state. The offline-first architecture layers IndexedDB on top of this flow: when online, data is fetched from the server and cached locally; when offline, data is read from IndexedDB and write operations are queued in a sync queue. When connectivity returns, the background sync process replays queued operations to the server, merging changes with conflict resolution (last-write-wins with timestamp comparison). Loading states (isLoading) display skeleton components while fetching, and error states (isError) show user-friendly retry options.

---

## Question 4: Security Considerations (200-300 words)

I implemented multiple security measures to protect database operations and user data. Input validation using Zod schemas on both client and server ensures all data meets expected formats before reaching the database, preventing malformed data and type coercion attacks. Parameterized queries through Drizzle ORM's query builder prevent SQL injection attacks by never interpolating user input directly into SQL strings - all values are passed as parameters. The device_id-based data isolation ensures users can only access their own data without requiring full authentication, with all queries including WHERE clauses filtering by the requesting device's ID. Environment variables store database credentials (DATABASE_URL) and API keys, never committed to version control, with .env files excluded via .gitignore. HTTPS is enforced in production to encrypt data in transit between client, server, and database. Rate limiting on API endpoints prevents abuse and denial-of-service attacks. Error messages returned to clients are sanitized to avoid leaking database structure or internal implementation details - detailed errors are logged server-side while clients receive generic messages. The Content Security Policy (CSP) headers restrict resource loading to trusted sources, mitigating XSS attacks.

---

## Question 5: Query Optimization (200-300 words)

I optimized database queries and implemented caching strategies to ensure responsive performance even with large datasets. Database indexes are defined on frequently-queried columns: device_id for user isolation, created_at for chronological sorting, and category for filtered views. Compound indexes on (device_id, created_at) optimize the common query pattern of fetching a user's recent entries. Pagination using limit and offset prevents loading entire tables into memory, with cursor-based pagination available for infinite scroll scenarios. Query results are cached at multiple levels: TanStack Query caches API responses client-side with configurable stale times (5 minutes for entry lists, 30 seconds for active editing), IndexedDB provides persistent local cache surviving page reloads, and server-side caching with Redis (when available) or in-memory caching reduces database load for frequently-accessed data. Selective field retrieval using Drizzle's partial select syntax fetches only needed columns (e.g., id and title for list views) rather than entire records. Batch operations combine multiple inserts or updates into single database transactions, reducing round-trips. The database connection pool managed by Neon's serverless driver efficiently reuses connections, minimizing connection establishment overhead.

## Key Topics Covered
- PostgreSQL with Drizzle ORM
- CRUD operations
- RESTful API design
- Frontend-backend communication
- Security and SQL injection prevention
- Query optimization and caching

## Word Count Target
Each question: 200-300 words
