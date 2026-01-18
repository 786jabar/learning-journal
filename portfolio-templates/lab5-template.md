# Lab 5: Server-Side Storage with JSON

## Question 1: JSON vs Browser Storage (200-300 words)

JSON file storage differs fundamentally from browser storage in several architectural and functional aspects that affect how data is managed and accessed. JSON files are stored on the server filesystem, making data inherently accessible across different devices, browsers, and sessions - a user can start journaling on their laptop and continue on their phone seamlessly. In contrast, localStorage and IndexedDB are strictly client-side storage mechanisms that are device-specific and browser-specific; data stored in Chrome on one device cannot be accessed from Firefox on another device without explicit synchronization. JSON files can be easily backed up using standard file system tools, version-controlled with Git for complete change history and rollback capabilities, and shared between users or exported for data portability. However, browser storage offers significantly faster read/write operations since it doesn't require network round-trips to a server - IndexedDB operations complete in milliseconds locally versus hundreds of milliseconds for server requests. JSON files require server-side processing through languages like Python or Node.js to modify, adding complexity but also enabling data validation and business logic enforcement, while browser storage can be manipulated directly by client-side JavaScript. For my PWA architecture, I strategically use both approaches: IndexedDB serves as the primary data store for instant offline access and responsive user experience, while server-side storage (PostgreSQL/JSON) provides cross-device synchronization and data backup.

---

## Question 2: Python Scripts for JSON (200-300 words)

I created comprehensive Python scripts that manage JSON file operations using the built-in json module for serialization and deserialization. The script workflow begins by reading the existing JSON file from the filesystem using open() with 'r' mode, parsing the JSON string into a Python dictionary or list using json.load(), modifying the data structure as needed (adding new entries, updating existing records, or deleting specified entries), then writing the updated data structure back to the file using json.dump() with indentation for readability. I exposed these operations as Flask RESTful API endpoints following proper HTTP semantics. For example, a POST request to /api/reflections triggers the script to read the current reflections array, append a new reflection object with an auto-incremented ID (calculated as max existing ID + 1), add server-generated timestamps, validate required fields, and atomically save the file. PUT and DELETE endpoints follow similar patterns for updates and removals. Comprehensive error handling with try-except blocks ensures the file is properly closed even if an exception occurs during processing, and JSON validation prevents malformed data from corrupting the file. I also implemented file locking to prevent race conditions when multiple requests attempt simultaneous writes.

---

## Question 3: Local vs Deployed Data (200-300 words)

Locally, my PWA shows data from both IndexedDB (providing offline-first instant access) and the server API (providing synced, authoritative data). When the application loads, users see their locally-cached entries immediately from IndexedDB - this happens in milliseconds, providing a perception of instant loading. Simultaneously, a background fetch retrieves the latest data from the server API, merging any updates seamlessly. This architecture ensures users never wait for network requests to see their content. On GitHub Pages (a static hosting platform), users would see only the static JSON file content that was included at the time of deployment - the data is essentially frozen and cannot be dynamically updated after deployment. This fundamental limitation exists because GitHub Pages serves only static files; there is no server-side execution environment to process write requests, run Python/Node.js code, or modify files. The JSON would load via fetch() but any changes would be lost on page refresh. For dynamic functionality requiring persistent user data, I deploy the backend to platforms like PythonAnywhere (for Flask), Replit (for Node.js/Express), or similar services where server-side code can handle read/write operations to databases or JSON files in real-time.

---

## Question 4: Reflections Feature (200-300 words)

I added a comprehensive reflections feature that allows users to write daily learning reflections categorized by customizable topics, providing a structured way to document insights and track conceptual growth. These reflections are stored in a well-structured JSON file (and synced to PostgreSQL) and can be filtered by category, searched by keyword, sorted by date, and exported in multiple formats. The JSON structure follows a consistent schema including: unique ID for identification, author name for multi-user scenarios, reflection text content with markdown support for formatting, category/tag for organization (e.g., "Programming Concepts", "Design Patterns", "Personal Growth"), created_at and updated_at timestamps for temporal tracking, and optional metadata like mood indicators or location. This feature strategically complements the main journal entries by providing a quick-capture option for brief thoughts, insights, and "aha moments" that don't warrant a full journal entry. The categorization system enables users to review their reflections over time, identifying learning patterns across subjects, tracking progress on specific topics, and recognizing areas requiring additional focus. The API endpoints return appropriate HTTP status codes (200 OK, 201 Created, 404 Not Found, 500 Internal Server Error) to clearly indicate success, client errors, or server errors.

## Key Topics Covered
- JSON file storage vs browser storage
- Python/Flask REST API development
- File I/O operations
- Static vs dynamic hosting
- Data synchronization strategies

## Word Count Target
Each question: 200-300 words
