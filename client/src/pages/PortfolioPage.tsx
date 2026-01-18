import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { 
  Download, 
  FileText, 
  Loader2,
  Save,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Code,
  Globe,
  Server,
  Smartphone,
  Gamepad2,
  Menu,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from "lucide-react";
import localforage from "localforage";

interface PortfolioData {
  studentName: string;
  studentId: string;
  programme: string;
  githubLink: string;
  liveProjectLink: string;
  introduction: string;
  lab1: string;
  lab2_q1: string;
  lab2_q2: string;
  lab2_q3: string;
  lab3_q1: string;
  lab3_q2: string;
  lab3_q3: string;
  lab4_q1: string;
  lab4_q2: string;
  lab4_q3: string;
  lab4_q4: string;
  lab5_q1: string;
  lab5_q2: string;
  lab5_q3: string;
  lab5_q4: string;
  lab6_q1: string;
  lab6_q2: string;
  lab6_q3: string;
  lab6_q4: string;
  lab6_q5: string;
  lab7_q1: string;
  lab7_q2: string;
  lab7_q3: string;
  lab7_q4: string;
  mini_q1: string;
  mini_q2: string;
  mini_q3: string;
  mini_q4: string;
  appendices: string;
  bibliography: string;
}

interface WordCountInfo {
  current: number;
  min: number;
  max: number;
}

const prefilledData: PortfolioData = {
  studentName: "Your Name",
  studentId: "Student ID",
  programme: "BSc Computer Science",
  githubLink: "https://github.com/yourusername/learning-journal-pwa",
  liveProjectLink: "https://yourusername.pythonanywhere.com",
  
  introduction: `This portfolio documents the comprehensive development journey of my Learning Journal Progressive Web Application (PWA) for the FGCT6021 Mobile Application Development module. The project represents a sophisticated full-stack web application built using modern industry-standard technologies including React 18 with TypeScript for type-safe frontend development, Express.js for robust backend API services, and PostgreSQL with Drizzle ORM for reliable data persistence. The application features an offline-first architecture with complete PWA capabilities, enabling seamless user experiences regardless of network connectivity.

The primary objectives of this ambitious project were multifaceted: to create a functional and aesthetically pleasing learning journal that empowers users to meticulously track their learning progress, document ongoing projects with detailed technical specifications, and reflect meaningfully on their development journey. A key architectural decision was implementing comprehensive offline functionality through service workers and IndexedDB, ensuring users can access, create, and modify their data without requiring an active internet connection. This offline-first approach significantly enhances the application's reliability and user experience.

Throughout the development lifecycle, I cultivated and refined numerous technical skills spanning the full technology stack. On the frontend, I mastered React 18 patterns including hooks, context, and state management, while leveraging Tailwind CSS for rapid, responsive UI development. Backend development involved designing RESTful APIs with Express.js, implementing secure authentication patterns, and managing database operations with Drizzle ORM and PostgreSQL. The PWA implementation required deep understanding of service worker lifecycle, cache strategies, and manifest configuration for installability. Key challenges I overcame included implementing robust offline data synchronization with conflict resolution, creating an intuitive and accessible user interface following WCAG guidelines, and integrating multiple external APIs for enhanced functionality including weather data, GitHub profiles, and real-time notifications.

This portfolio comprehensively reflects on each lab's learning outcomes and thoroughly documents the mini project extension - a Celestial Memory Game featuring space-themed visuals, ambient audio generation using Web Audio API, and a Professional Creative Canvas with advanced drawing capabilities. These additions demonstrate advanced JavaScript skills, creative problem-solving, and mastery of browser APIs.`,

  lab1: `In Lab 1, I established the foundational development environment for the Learning Journal PWA, a critical first step that would support all subsequent development work. I began by creating a comprehensive GitHub repository to manage version control throughout the project lifecycle. Understanding the importance of maintaining a clean commit history, I ensured all code changes were tracked with meaningful, descriptive commit messages following conventional commit standards (e.g., "feat: add journal entry component", "fix: resolve offline sync issue"). Using Visual Studio Code as my primary Integrated Development Environment (IDE), I configured essential extensions including ESLint for code linting and error detection, Prettier for consistent code formatting, and the TypeScript compiler for static type checking and improved code quality. I also set up workspace settings to ensure consistent formatting across team environments.

I thoroughly explored PythonAnywhere as a potential deployment platform, gaining hands-on experience with hosting Flask applications and serving static files. This involved understanding the platform's file structure, virtual environment setup, and WSGI configuration. While my final deployment architecture uses a different approach with Node.js and Express, this experience proved invaluable for understanding fundamental web hosting concepts including domain configuration, SSL certificates, and server logs. The knowledge of Python deployment would later inform my understanding of how backend services operate in production environments.

For Android development exploration, I installed Android Studio and conducted a comprehensive examination of how PWAs can be packaged as native Android applications using Trusted Web Activities (TWA). This involved running sample Kotlin code to understand the basics of native Android development, including activity lifecycle, XML layouts, and Gradle build configurations. I compared native approaches with web-based development, noting that PWAs offer significant advantages in terms of cross-platform compatibility and deployment simplicity while native apps provide deeper device integration. This analysis directly influenced my decision to focus on PWA development for maximum reach.

The PWA concepts I mastered during this lab included understanding the critical role of manifest.webmanifest files for app installability (including icons, theme colors, display modes, and start URLs), service workers for sophisticated offline caching strategies (cache-first, network-first, stale-while-revalidate), and the app shell architecture pattern for instant loading. These foundational concepts formed the architectural backbone for later labs where I implemented these features comprehensively in my Learning Journal application.

Challenges I faced included correctly configuring Git credentials across multiple environments and understanding the complex relationship between local development branches and remote repository tracking. I resolved these issues by carefully studying the official Git documentation, implementing SSH key authentication for secure passwordless access, and creating a personal workflow that includes regular commits, feature branches, and pull request reviews. These practices have become integral to my development workflow.

GitHub Repository: [Your GitHub Link]
Live Project: [Your PythonAnywhere Link]`,

  lab2_q1: `I approached mobile-first design methodology by systematically starting with the smallest viewport (320px mobile) and progressively enhancing the interface for larger screens. This approach ensures that the core functionality and content are accessible on all devices, with enhanced layouts unlocked as screen real estate increases. Using Tailwind CSS, I implemented a comprehensive responsive breakpoint system (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px) to adjust layouts dynamically. For example, the main navigation implements horizontal scroll with touch-friendly swipe gestures on mobile devices, transitioning to a full horizontal navbar with hover states on desktop viewports. Content cards stack vertically in a single column on mobile for optimal readability, then display in responsive grids (2 columns on tablet, 3-4 columns on desktop) on larger screens using Tailwind's grid utilities. Following WCAG accessibility guidelines, I ensured all touch targets were at least 44x44 pixels for comfortable finger tapping, with adequate spacing between interactive elements to prevent accidental taps. The layout system leverages both Flexbox for one-dimensional layouts (navigation, card contents) and CSS Grid for two-dimensional layouts (dashboard, gallery views), allowing content to adapt fluidly to any screen size while maintaining visual hierarchy and readability.`,

  lab2_q2: `The most transformative CSS concepts I applied were Flexbox combined with CSS Grid for creating sophisticated responsive layouts that adapt seamlessly across devices. Flexbox proved invaluable for easily centering content both horizontally and vertically, distributing space between elements with justify-content and align-items properties, and creating flexible navigation bars that wrap gracefully. I extensively used "flex-wrap: wrap" to handle content overflow gracefully on smaller screens, preventing horizontal scrolling issues. For the complex dashboard layout featuring statistics cards, charts, and activity feeds, CSS Grid enabled me to create intricate multi-column layouts with varying row heights that automatically adjust based on content and viewport. The grid-template-columns with auto-fill and minmax() functions allowed cards to flow naturally without explicit breakpoint adjustments. The "gap" property simplified spacing management significantly compared to traditional margin-based approaches, eliminating issues with first/last child margins and providing consistent gutters. I also leveraged CSS custom properties (variables) defined in index.css to maintain a consistent design system with reusable spacing values, colors, and typography scales that could be adjusted globally.`,

  lab2_q3: `The most challenging aspect was achieving pixel-perfect consistent styling across different browsers (Chrome, Firefox, Safari, Edge) and understanding the nuanced rules of CSS specificity and cascade. Initially, I struggled significantly with z-index stacking contexts, especially for sticky headers that needed to overlay content while modal overlays needed to overlay everything including the header. Understanding that z-index only works within stacking contexts, and that certain CSS properties (transform, opacity, filters) create new stacking contexts, was a breakthrough moment. I also found it confusing to manage responsive images that maintain their intrinsic aspect ratios while fitting their parent containers without distortion or overflow. The object-fit property (cover, contain) and aspect-ratio CSS property became essential tools. Another challenge was managing component-scoped styles in React while ensuring global resets and utilities applied correctly. I overcame these challenges by leveraging Tailwind's utility classes which abstract away many browser inconsistencies with built-in prefixes and normalizations, carefully planning my component hierarchy to minimize z-index values needed, using the 'isolation: isolate' property to contain stacking contexts, and implementing a consistent naming convention for custom utility classes in my global CSS file.`,

  lab3_q1: `I strategically employed multiple DOM selection methods based on their specific strengths and use cases. I primarily used document.getElementById() for accessing unique elements such as the theme toggle button, date display containers, and modal roots, as it provides the fastest, most direct access to specific elements with O(1) lookup time. For collections of similar elements like journal entry cards, navigation links, and form inputs, I used document.querySelectorAll() which returns a static NodeList that I could iterate over using forEach(), map with Array.from(), or for...of loops. I also extensively used querySelector() for CSS selector-based selection when I needed more complex targeting with attribute selectors, pseudo-classes, or descendant combinators (e.g., 'button[data-action="save"]', '.card:not(.archived)'). In React components, I leveraged useRef hooks for direct DOM access when needed (e.g., for canvas elements, focus management, and scroll position), which provides a stable reference across re-renders. These methods were chosen deliberately for their clarity, performance characteristics, and efficiency - getElementById for unique elements with known IDs, querySelectorAll for collections with shared CSS characteristics, and useRef for React-managed component references.`,

  lab3_q2: `The most challenging part was managing event listeners and ensuring they were properly attached after DOM elements were rendered in React's virtual DOM lifecycle. Initially, my JavaScript event handlers executed before the HTML fully loaded, causing frustrating null reference errors that were difficult to debug. In vanilla JavaScript contexts, I solved this by either placing scripts at the end of the body element or wrapping initialization code in DOMContentLoaded event listeners to ensure the DOM was fully parsed. In React, I learned to use useEffect hooks with proper dependency arrays to attach event listeners after component mounting, and crucially, to implement cleanup functions to remove listeners on unmount to prevent memory leaks. Another significant challenge was understanding event propagation (bubbling and capturing phases) when implementing click handlers on nested elements like cards containing buttons. Clicking a button inside a card would trigger both handlers unintentionally. I used event.stopPropagation() strategically to prevent unwanted bubbling, and implemented event delegation patterns where parent elements handle events for multiple children through event.target inspection, improving performance with dynamic lists and reducing the number of attached listeners.`,

  lab3_q3: `I employed a comprehensive testing and debugging strategy using browser developer tools, primarily Chrome DevTools which offers an extensive suite of debugging capabilities. The Console tab served as my primary output for logging variable values, tracking execution flow with console.group() for organized output, and catching runtime errors with detailed stack traces. I used console.log(), console.table() for array/object visualization, and console.time()/timeEnd() for performance measurement extensively. For complex debugging scenarios, I set breakpoints in the Sources tab to pause execution and step through code line by line, inspecting the call stack, local variables, and closure scopes at each step. The watch expressions feature helped monitor specific variables across steps. I implemented robust try-catch blocks throughout the codebase to handle potential errors gracefully and display meaningful, user-friendly error messages through the toast notification system rather than exposing technical errors. Chrome DevTools' Network tab was essential for verifying API calls - I could inspect request headers, payloads, response status codes, and response bodies to ensure frontend-backend communication worked correctly. The Application tab helped me debug IndexedDB storage, service worker registration, and cache contents. The Elements tab confirmed DOM manipulations were applied as expected, allowing real-time CSS modifications for rapid iteration.`,

  lab4_q1: `For Storage APIs, I strategically chose IndexedDB via the localforage library for persistent offline storage of journal entries, projects, and application state. IndexedDB provides significantly larger storage capacity (potentially gigabytes versus 5-10MB for localStorage), supports structured data with indexes for efficient querying, and handles asynchronous operations without blocking the main thread. I also utilized localStorage for simple key-value pairs like user preferences, theme settings (light/dark mode), and device identifiers, where synchronous access and simple string storage suffice. For Browser APIs, I integrated multiple modern web APIs: the Clipboard API for seamless copy-to-clipboard functionality on journal entries and code snippets, the Notifications API for configurable study reminders and achievement alerts with user permission handling, the Geolocation API to optionally record location data with entries for contextual awareness, and the Web Audio API for generating ambient background music in the Celestial Memory Game using oscillators and gain nodes. For Third-Party APIs, I integrated the Open-Meteo Weather API (completely free, no API key required) for displaying current weather conditions based on geolocation, the GitHub REST API using Octokit for displaying user profiles, repository statistics, and contribution data, and the browser's native fetch API for all HTTP communications.`,

  lab4_q2: `Each API integration required thoughtful DOM manipulation strategies to display results elegantly and handle loading/error states. For the Weather API, I implemented asynchronous data fetching using the Fetch API with async/await syntax, parsed the JSON response to extract temperature, humidity, wind speed, and weather codes, and dynamically created React components with Tailwind styling to display temperature with appropriate icons, humidity percentages, and descriptive weather conditions. The GitHub API integration updates user profile cards by populating image src attributes for avatars using the GitHub avatar URL, textContent for repository counts and follower statistics, and dynamically rendering contribution data. Clipboard API integration attached event listeners to copy buttons that utilize navigator.clipboard.writeText() to write journal content to the clipboard, with visual feedback updating button states (showing checkmarks on success). I implemented comprehensive loading states using skeleton components and Loader2 spinners from lucide-react while data is being fetched, ensuring users always understand the application state. Error states display user-friendly messages with retry options.`,

  lab4_q3: `The main challenges were handling API errors gracefully across various failure modes and managing complex asynchronous operations with proper state synchronization. Network failures could crash the entire application or leave users with stale data, so I implemented comprehensive try-catch blocks with user-friendly error messages delivered through the toast notification system, distinguishing between network errors, server errors (5xx), and client errors (4xx). CORS (Cross-Origin Resource Sharing) issues arose with some APIs that didn't include permissive Access-Control-Allow-Origin headers, which I resolved by either using CORS proxy services for development, selecting APIs with properly configured CORS headers, or implementing server-side API calls to bypass browser restrictions. Rate limiting on the GitHub API (60 requests/hour for unauthenticated requests) required implementing intelligent caching of responses in localStorage with timestamp-based expiration, reducing unnecessary API calls and improving performance. For geolocation, I carefully handled permission denials by first explaining the benefit of location access, gracefully degrading to manual location entry when permission is denied, and respecting user privacy preferences. The Web Audio API required understanding audio context lifecycle, especially regarding browser autoplay policies that require user interaction before audio can play.`,

  lab4_q4: `These APIs significantly improved my PWA by enabling robust offline functionality, deep personalization, and real-time contextual data that transforms the user experience. IndexedDB allows users to create, read, update, and delete journal entries completely offline, with all changes queued and synchronized when connectivity returns using a background sync queue with conflict resolution. The Weather API adds valuable contextual information to entries, showing what the weather conditions were during study sessions, which can help users identify environmental factors affecting their learning. Browser notifications keep users engaged with configurable study reminders (e.g., "Time to write today's reflection!") and celebratory achievement alerts that reinforce positive learning behaviors. The GitHub API creates a connected developer experience by displaying the user's coding activity, repositories, and contributions, making the journal feel like part of their broader development ecosystem. The Web Audio API enables the Celestial Memory Game's ambient soundscape with dynamically generated C major 7 chords and gentle chimes. Together, these APIs transform a simple journal into a comprehensive, intelligent learning companion that works anywhere, anytime.`,

  lab5_q1: `JSON file storage differs fundamentally from browser storage in several architectural and functional aspects that affect how data is managed and accessed. JSON files are stored on the server filesystem, making data inherently accessible across different devices, browsers, and sessions - a user can start journaling on their laptop and continue on their phone seamlessly. In contrast, localStorage and IndexedDB are strictly client-side storage mechanisms that are device-specific and browser-specific; data stored in Chrome on one device cannot be accessed from Firefox on another device without explicit synchronization. JSON files can be easily backed up using standard file system tools, version-controlled with Git for complete change history and rollback capabilities, and shared between users or exported for data portability. However, browser storage offers significantly faster read/write operations since it doesn't require network round-trips to a server - IndexedDB operations complete in milliseconds locally versus hundreds of milliseconds for server requests. JSON files require server-side processing through languages like Python or Node.js to modify, adding complexity but also enabling data validation and business logic enforcement, while browser storage can be manipulated directly by client-side JavaScript. For my PWA architecture, I strategically use both approaches: IndexedDB serves as the primary data store for instant offline access and responsive user experience, while server-side storage (PostgreSQL/JSON) provides cross-device synchronization and data backup.`,

  lab5_q2: `I created comprehensive Python scripts that manage JSON file operations using the built-in json module for serialization and deserialization. The script workflow begins by reading the existing JSON file from the filesystem using open() with 'r' mode, parsing the JSON string into a Python dictionary or list using json.load(), modifying the data structure as needed (adding new entries, updating existing records, or deleting specified entries), then writing the updated data structure back to the file using json.dump() with indentation for readability. I exposed these operations as Flask RESTful API endpoints following proper HTTP semantics. For example, a POST request to /api/reflections triggers the script to read the current reflections array, append a new reflection object with an auto-incremented ID (calculated as max existing ID + 1), add server-generated timestamps, validate required fields, and atomically save the file. PUT and DELETE endpoints follow similar patterns for updates and removals. Comprehensive error handling with try-except blocks ensures the file is properly closed even if an exception occurs during processing, and JSON validation prevents malformed data from corrupting the file. I also implemented file locking to prevent race conditions when multiple requests attempt simultaneous writes.`,

  lab5_q3: `Locally, my PWA shows data from both IndexedDB (providing offline-first instant access) and the server API (providing synced, authoritative data). When the application loads, users see their locally-cached entries immediately from IndexedDB - this happens in milliseconds, providing a perception of instant loading. Simultaneously, a background fetch retrieves the latest data from the server API, merging any updates seamlessly. This architecture ensures users never wait for network requests to see their content. On GitHub Pages (a static hosting platform), users would see only the static JSON file content that was included at the time of deployment - the data is essentially frozen and cannot be dynamically updated after deployment. This fundamental limitation exists because GitHub Pages serves only static files; there is no server-side execution environment to process write requests, run Python/Node.js code, or modify files. The JSON would load via fetch() but any changes would be lost on page refresh. For dynamic functionality requiring persistent user data, I deploy the backend to platforms like PythonAnywhere (for Flask), Replit (for Node.js/Express), or similar services where server-side code can handle read/write operations to databases or JSON files in real-time.`,

  lab5_q4: `I added a comprehensive reflections feature that allows users to write daily learning reflections categorized by customizable topics, providing a structured way to document insights and track conceptual growth. These reflections are stored in a well-structured JSON file (and synced to PostgreSQL) and can be filtered by category, searched by keyword, sorted by date, and exported in multiple formats. The JSON structure follows a consistent schema including: unique ID for identification, author name for multi-user scenarios, reflection text content with markdown support for formatting, category/tag for organization (e.g., "Programming Concepts", "Design Patterns", "Personal Growth"), created_at and updated_at timestamps for temporal tracking, and optional metadata like mood indicators or location. This feature strategically complements the main journal entries by providing a quick-capture option for brief thoughts, insights, and "aha moments" that don't warrant a full journal entry. The categorization system enables users to review their reflections over time, identifying learning patterns across subjects, tracking progress on specific topics, and recognizing areas that need more attention. The export functionality allows users to generate PDF reports or markdown files of their reflections for portfolio building or sharing with mentors.`,

  lab6_q1: `The frontend-backend connection is architecturally essential because it establishes a clear separation of concerns that enables robust data persistence, security, and scalability. The frontend (React application) handles all user interface rendering, user experience flows, client-side validation, and local state management, while the backend (Express.js API) manages authoritative data storage, business logic enforcement, security measures, and inter-service communication. This architectural separation provides multiple benefits: the frontend can be a lightweight PWA that works offline using cached data and service workers, while the backend ensures data is safely stored in PostgreSQL, validated against schemas, and synchronized across all user devices. Without a backend, all data would be lost when browser storage is cleared or when users switch devices - a critical limitation for any serious application. The connection also enables sophisticated features impossible in frontend-only architectures: user authentication with secure session management, server-side data validation that cannot be bypassed by malicious clients, rate limiting to prevent abuse, serving personalized data to different users based on their profiles and permissions, and audit logging for compliance requirements. The RESTful API design ensures the frontend and backend can evolve independently as long as the API contract is maintained.`,

  lab6_q2: `I implemented all four primary HTTP methods in my backend following RESTful API design principles for clarity, predictability, and proper semantics. GET retrieves data without modifying server state - I use it for fetching all reflections (GET /api/reflections returns a JSON array), fetching a specific reflection by ID (GET /api/reflections/:id returns a single object or 404), and filtering reflections by query parameters (GET /api/reflections?category=programming). POST creates new resources - a POST request to /api/reflections with a JSON body creates a new reflection, validates all required fields using Zod schemas, assigns a server-generated ID and timestamp, persists to the database, and returns the created resource with 201 Created status. PUT updates existing resources by fully replacing them - PUT /api/reflections/:id expects the complete updated reflection object and returns 200 on success or 404 if not found. DELETE removes resources - DELETE /api/reflections/:id removes the specified reflection and returns 204 No Content on success. I chose these methods following REST conventions because each has well-defined semantics: GET is safe (doesn't modify data) and idempotent (multiple identical requests have the same effect), POST is neither (each request may create a new resource), PUT is idempotent but not safe, and DELETE is idempotent. Each endpoint returns appropriate HTTP status codes (200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, 500 Internal Server Error) to clearly indicate success, client errors, or server errors.`,

  lab6_q3: `Using a backend framework like Flask or Express.js to handle JSON data provides critical server-side security, validation, and persistence capabilities that browser-based reading simply cannot offer. Server-side processing can validate data against schemas before saving, preventing malformed or malicious input from corrupting the database. Input sanitization prevents SQL injection, XSS attacks, and other security vulnerabilities. Server-side business logic can enforce constraints that clients cannot be trusted to maintain (e.g., ensuring unique usernames, validating ownership before allowing edits, maintaining referential integrity). Data integrity is maintained across sessions and server restarts through database transactions. Reading and modifying JSON directly in the browser exposes the entire file to users through network inspection and cannot prevent tampering - any "validation" can be bypassed by crafting manual HTTP requests. Server-side processing enables multi-user scenarios where each user's data is properly isolated through authentication and authorization, with sensitive data never exposed to unauthorized clients. However, browser-based JSON reading remains faster for read-only public data that doesn't require protection, making it suitable for static configuration files, public content databases, or cached reference data. My architecture uses both: browser storage for instant offline access, with server-side PostgreSQL for authoritative, secure, synchronized data.`,

  lab6_q4: `On PythonAnywhere (and similar cloud platforms), I encountered several deployment challenges that required systematic debugging. Initially, I faced significant issues with file paths - the working directory in the PythonAnywhere environment was different from my local development setup, causing "file not found" errors when the application tried to read JSON files or static assets. I resolved this by using os.path.abspath() and os.path.dirname(__file__) to construct absolute paths relative to the script location, making the code portable across environments. A major challenge was CORS (Cross-Origin Resource Sharing) errors when my frontend (hosted on a different domain or port) tried to access the Flask API. Browsers block cross-origin requests by default for security, so I added the Flask-CORS extension and configured it to allow requests from my specific frontend URLs, with proper handling of preflight OPTIONS requests and credentials. I also had to ensure the virtual environment on PythonAnywhere had all required packages installed using pip install -r requirements.txt, as the platform uses isolated environments. The web app configuration required specifying the correct WSGI file path and Python interpreter path. Similar challenges arose with Node.js/Express deployment on Replit, where environment variables, port binding (process.env.PORT), and database connection strings required proper configuration.`,

  lab6_q5: `I built a comprehensive full CRUD (Create, Read, Update, Delete) management system for learning reflections using Express.js with PostgreSQL backend via Drizzle ORM. This feature allows users to write new reflections with rich markdown content, categorize them by customizable topics with a tagging system, edit existing entries with full revision history, and soft-delete unwanted entries (maintaining data for potential recovery). I added this because a complete, production-ready journal application requires all CRUD operations - not just creating entries. Users need to correct mistakes, update thoughts as understanding evolves, and remove irrelevant content. The search functionality implements full-text filtering across reflection content, titles, and tags, making it easy to find past thoughts on specific topics instantly. Advanced filtering supports date ranges, categories, and combinable criteria. I also added comprehensive data export capabilities: JSON format for programmatic access and backup/restore, Markdown format for human-readable archives and external documentation, and PDF export for professional portfolio presentation. The import functionality allows users to migrate data from other platforms or restore from backups, ensuring data portability and preventing vendor lock-in.`,

  lab7_q1: `Enhancing a web application with Progressive Web App (PWA) features provides transformative benefits that bridge the gap between web and native applications: comprehensive offline access, native-like installability, and an immersive app-like experience. Users can continue accessing their journal entries, viewing projects, and even creating new content without any internet connectivity - this is crucial for students who may study in areas with poor or intermittent connectivity such as public transport, libraries with spotty WiFi, or during network outages. The install-to-home-screen feature (via the Web App Manifest and "Add to Home Screen" prompt) makes the app feel truly native - it launches in standalone mode without browser chrome, has its own app icon on the device home screen, and appears in the device's app switcher. This removes the friction of opening a browser and navigating to a URL. Push notifications (via the Push API and Service Workers) can proactively remind users to write journal entries, celebrate achievements, or alert them to important updates. Service workers dramatically improve performance by implementing intelligent caching strategies for assets and API responses - returning cached content instantly for repeat visits, eliminating loading spinners, and making the app feel instantaneous. These PWA features transform a standard web application into a first-class citizen alongside native apps.`,

  lab7_q2: `For comprehensive offline access, I implemented a sophisticated service worker architecture that handles both static assets and dynamic data with appropriate strategies. The service worker (sw.js) caches static assets (HTML shell, CSS bundles, JavaScript modules, images, fonts) using a cache-first strategy with versioned cache names for efficient cache busting. When requests for these assets come in, the service worker first checks the cache, returning cached content instantly, and only falling back to network if the cache misses. For dynamic data (journal entries, projects, user settings), I use IndexedDB via the localforage library to store complete data locally. The application architecture is offline-first: when the app loads, it immediately reads from IndexedDB to render content without any loading states, while simultaneously making background network requests to fetch the latest data and merge updates. When offline, users can create, edit, and delete entries - these changes are queued in a sync queue stored in IndexedDB. When connectivity returns (detected via the 'online' event), the sync queue is processed, pushing all pending changes to the server with conflict resolution logic. The service worker implements a network-first strategy for API calls (/api/* routes), attempting to fetch fresh data from the server but gracefully falling back to cached responses when the network fails, ensuring users always see data even in degraded connectivity.`,

  lab7_q3: `I added a comprehensive PWA demonstration page (accessible via the menu) that showcases all PWA features in one interactive location, serving both as a user education tool and a developer debugging utility. Users can check their real-time online/offline status with a visual indicator that updates dynamically using navigator.onLine and 'online'/'offline' event listeners. The page displays detailed service worker registration status including scope, state (installing/waiting/active), and update availability. A cache inspector shows all cached resources organized by cache name, with options to view cache contents and manually clear specific caches. The install prompt section explains the installation process and, when the browser fires the 'beforeinstallprompt' event, captures it and provides a prominent "Install App" button that triggers the native installation dialog. Offline testing functionality allows users to simulate offline mode and verify the app works correctly. A visual network indicator was also added to the main navigation bar, showing a subtle icon when the user goes offline. This feature helps users understand and appreciate the sophisticated PWA capabilities they might otherwise take for granted, and serves as an invaluable debugging tool during development for verifying service worker behavior and cache contents.`,

  lab7_q4: `The main deployment challenges centered around service worker configuration, cache management, and cross-device testing. Initially, the service worker scope was incorrectly configured - it only intercepted requests for the root path (/), missing nested routes like /journal, /projects, and /portfolio. This meant navigation to those routes while offline failed. I fixed this by ensuring the service worker is registered with the correct scope and updating the fetch event handler to properly intercept navigation requests using 'request.mode === "navigate"' and return the cached app shell (index.html) for client-side routing to handle. A persistent challenge was cache versioning - old cached JavaScript and CSS files persisted after code updates, causing users to see stale content or experience JavaScript errors from version mismatches. I implemented robust cache busting by including version numbers in cache names (e.g., 'learning-journal-static-v4'), adding cache-clearing logic in the 'install' event to delete all old caches, and using 'self.skipWaiting()' and 'clients.claim()' to activate new service workers immediately. Testing offline mode required using Chrome DevTools' Network tab to simulate offline conditions, the Application tab to inspect service worker state and cache contents, and Lighthouse PWA audits to verify installability criteria. Cross-device testing revealed additional challenges with iOS Safari's different PWA behaviors and required implementing iOS-specific meta tags and handling.`,

  mini_q1: `I developed several significant features to enhance the Learning Journal well beyond the core requirements, demonstrating advanced technical skills and creative problem-solving across multiple domains:

**1. Celestial Memory Game** - A visually stunning space-themed card matching game that showcases advanced JavaScript, CSS animations, and Web Audio API integration:
- **Visual Design**: 30 beautiful celestial icons (planets, stars, galaxies, nebulae) with sophisticated 3-color gradient effects that create depth and visual interest
- **Ambient Audio System**: Dynamically generated background music using the Web Audio API, featuring a harmonious C major 7 chord foundation (C4, E4, G4, B4 frequencies) played through oscillators with gain envelope shaping, plus gentle random pentatonic chimes every 2-3 seconds creating a meditative atmosphere
- **Constellation Quest Mode**: An innovative game mode where players collect constellation fragments by matching specific card pairs, unlocking special power-ups like "Cosmic Reveal" (briefly shows all cards) and "Time Warp" (adds bonus time)
- **Wild Comet Cards**: Special cards that appear randomly and can match with any other card, adding strategic depth and excitement
- **Four Unlockable Themes**: Cosmic Night (deep blues and purples), Aurora Borealis (green and pink waves), Pink Nebula (soft pastels), and Solar Flare (warm oranges and reds) - unlocked through achievements
- **Three Game Modes**: Zen Mode (relaxed, untimed), Challenge Mode (timed with scoring), and Constellation Quest (objective-based progression)
- **Premium Visual Effects**: 3D CSS perspective card flips using transform-style: preserve-3d and backface-visibility, particle explosion effects on successful matches, animated starfield backgrounds using CSS keyframe animations, and glassmorphism card styling with backdrop-blur

**2. Professional Creative Canvas** - A complete drawing application demonstrating mastery of the HTML5 Canvas API:
- **Multiple Drawing Tools**: Pen for freehand drawing, eraser, line tool, rectangle, circle/ellipse, and flood fill algorithm for color filling
- **Overlay Canvas Architecture**: Dual-canvas system where a transparent overlay canvas shows live shape previews during drag operations, maintaining the main canvas state until shapes are committed
- **Color System**: 10 curated preset colors plus a full custom color picker using the native HTML color input, with recent colors memory
- **Brush Size Control**: Adjustable brush sizes from 1px for fine detail to 50px for broad strokes, with visual size indicator
- **History System**: Comprehensive undo/redo functionality storing up to 50 canvas states using ImageData snapshots stored in useRef, with keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Gallery System**: Save artwork to IndexedDB with names, load previously saved drawings, and delete unwanted saves
- **Export Functionality**: PNG export using canvas.toDataURL() with automatic download trigger
- **Mobile/Touch Support**: Full touch event handling (touchstart, touchmove, touchend) with proper coordinate translation for seamless drawing on tablets and phones

**3. Mobile App Navigation System** - Complete app-like navigation replicating native mobile patterns:
- **Bottom Navigation Bar**: Persistent mobile-style tab bar with five main destinations (Home, Journal, Menu, Games, Profile), touch-optimized with proper spacing and visual feedback
- **Menu Page**: Organized grid of feature categories with icons, descriptions, and navigation links
- **Options Page**: User preference controls for themes, notification settings, and display options
- **Settings Page**: System configuration including data management, export options, and about information
- **Explore Page**: Feature discovery interface highlighting app capabilities

**4. Analytics Dashboard**: Comprehensive data visualization using Recharts:
- Learning streak tracking with current and longest streak displays
- Weekly activity trends as line/bar charts
- Interactive tag clouds showing topic distribution
- GitHub-style contribution heatmaps for year-at-a-glance activity visualization

**5. Achievements System**: Complete gamification layer encouraging engagement:
- Badge-based milestones (First Entry, Streak Master, Prolific Writer, etc.)
- Progress tracking toward next achievements
- Persistent storage ensuring achievements survive page reloads

**6. Enhanced Journal Features**: Production-ready journaling capabilities:
- Rich markdown editor using @uiw/react-md-editor with live preview
- Flexible tag management with autocomplete suggestions
- Full-text search and multi-criteria filtering
- PDF, Markdown, and JSON export options

**7. PWA Enhancements**: Complete offline-first architecture:
- Service worker with intelligent caching strategies
- Install prompts with deferred prompt handling
- Real-time network status indicators
- Manual cache management and refresh controls`,

  mini_q2: `I chose to create a comprehensive, multi-faceted mini project with distinct components for several strategic and pedagogical reasons, each demonstrating mastery of different technical domains:

**Celestial Memory Game - Unique Theme and Identity**:
Rather than implementing a generic, forgettable memory game with basic playing card suits or simple shapes, I invested significant design effort in creating a cohesive "space exploration" experience. The 30 beautiful celestial icons - including planets with atmospheric rings, spiral galaxies, colorful nebulae, shooting stars, and constellation patterns - each feature sophisticated 3-color gradient effects created through SVG linear gradients that give depth and visual richness. The space theme was chosen strategically because it evokes wonder and curiosity (aligning with the learning journal's educational purpose), provides a vast design vocabulary for future expansion, and gives the game a distinct memorable identity that users want to return to. The cohesive visual language extends to UI elements, using deep space purples, stellar blues, and cosmic accent colors throughout.

**Ambient Audio Experience - Web Audio API Mastery**:
I implemented the Web Audio API to generate dynamic, procedurally-created background music rather than using pre-recorded audio files. The audio system creates a harmonious C major 7 chord foundation using four oscillators tuned to C4 (261.63 Hz), E4 (329.63 Hz), G4 (392 Hz), and B4 (493.88 Hz) with triangle waveforms for a soft, ethereal tone. Gain nodes control the volume envelope with gentle attack and release. Every 2-3 seconds, a random pentatonic scale note plays as a gentle chime, creating a meditative, evolving soundscape that never exactly repeats. This demonstrates advanced browser API integration, understanding of audio synthesis concepts, and creates an immersive experience impossible with simple audio file playback. The audio respects user preferences with an accessible mute toggle.

**Visual Polish and Premium Production Quality**:
The user interface employs sophisticated visual techniques that elevate the experience beyond student project expectations. Glassmorphism effects combine semi-transparent backgrounds (bg-white/10) with backdrop-blur filters to create frosted glass card appearances. Animated starfield backgrounds use CSS keyframe animations to create continuously drifting particle effects. 3D card flip animations leverage CSS 3D transforms with perspective, transform-style: preserve-3d, and backface-visibility to create convincing physical card flips. Particle explosion effects on successful matches use DOM element spawning with CSS animations and cleanup. These details compound to create a premium, polished experience that demonstrates attention to user experience.

**Professional Canvas Tool - Complete Application Architecture**:
The Creative Canvas represents a complete, production-ready drawing application rather than a simple demo. The overlay canvas architecture uses two stacked HTML5 canvas elements: the main canvas holds the permanent artwork, while a transparent overlay canvas renders live shape previews during drag operations. This non-destructive approach means users see exactly what they're drawing before committing. History management uses useRef (not useState) to store ImageData snapshots, avoiding the stale closure issues that plague canvas applications using state. Touch event handling required translating touch coordinates to canvas coordinates using getBoundingClientRect() and accounting for device pixel ratio for crisp rendering on high-DPI screens.

**Mobile App Navigation - Modern UX Patterns**:
The navigation system replicates native mobile app patterns, demonstrating understanding of mobile UX conventions. The bottom navigation bar uses a fixed-position footer with five equally-spaced touch targets, active state indicators, and appropriate iconography. This familiar pattern reduces learning curve for mobile users.

**Advanced React Patterns - Technical Demonstration**:
The project comprehensively showcases modern React development practices: useState for complex multi-property state objects, useEffect for side effects like timers, audio initialization, and event listener cleanup, useCallback for memoized event handlers preventing unnecessary re-renders, useRef for imperative DOM access (canvas elements) and storing values that shouldn't trigger re-renders (history stacks, audio context), and functional state updates (setState(prev => ...)) to avoid stale closure bugs that commonly plague complex React applications.`,

  mini_q3: `I encountered and systematically resolved numerous technical challenges during development, each requiring deep debugging and creative problem-solving:

**CELESTIAL MEMORY GAME CHALLENGES:**

**3D Card Flip Animation**: Creating convincing, physically-accurate 3D card flip animations required mastering CSS 3D transforms. The key was understanding that perspective must be set on the parent container, transform-style: preserve-3d must be on the flipping element to maintain 3D space for children, and backface-visibility: hidden on both front and back faces prevents seeing through the card. I had to carefully position both faces: the front at rotateY(0deg) and the back at rotateY(180deg), then flip the container to rotateY(180deg) to reveal the back. Transition timing and easing required tuning for natural motion. A subtle issue was that different browsers handled backface-visibility differently, requiring testing across Chrome, Firefox, and Safari.

**Web Audio API Music Generation**: Implementing procedural ambient background music required understanding the Web Audio API's node-based architecture. I created an AudioContext, instantiated OscillatorNodes for each note of the C major 7 chord (frequencies calculated as C4=261.63Hz, E4=329.63Hz, G4=392Hz, B4=493.88Hz), connected them through GainNodes for volume control, and routed to the destination (speakers). The challenging aspect was managing audio context lifecycle - browsers require user interaction before audio can play (autoplay policy), so I deferred audio initialization to the first user click. The random chime system uses setInterval to schedule notes on a pentatonic scale with random selection. Cleanup required properly disconnecting nodes and closing the audio context on component unmount to prevent memory leaks.

**Achievement Persistence with Stale Closures**: This was one of the most insidious bugs. Initially, achievements weren't saving correctly because the checkAchievements function captured stale values from the closure at the time it was defined. When called from an async callback after card matching, it referenced outdated state. I resolved this by: 1) Using functional state updates (setAchievements(prev => {...})) which always receive current state, 2) Passing updatedCards directly as a parameter to achievement checks instead of relying on the cards state variable, and 3) Using useRef to store values that need to be accessed in callbacks without causing re-renders or closure issues.

**CREATIVE CANVAS CHALLENGES:**

**Canvas Coordinate Scaling and Device Pixel Ratio**: Drawing coordinates were consistently incorrect - strokes appeared offset from the cursor. This occurred because the canvas's CSS display size differed from its internal bitmap dimensions (width/height attributes). I implemented coordinate transformation using canvas.getBoundingClientRect() to get actual rendered dimensions, then calculated scaleX = canvas.width / rect.width and scaleY = canvas.height / rect.height. Additionally, high-DPI displays required scaling by window.devicePixelRatio to maintain crisp rendering - without this, lines appeared blurry on Retina displays.

**Overlay Canvas for Live Shape Preview**: Shape tools (line, rectangle, circle) needed to display the shape in real-time as users drag, but without permanently drawing until mouse release. I implemented a dual-canvas architecture: a main canvas holds permanent artwork, and a transparent overlay canvas (positioned absolutely on top) renders the live preview. During mouse drag, I clear the overlay each frame and redraw the preview shape at current coordinates. On mouseup, the final shape is drawn on the main canvas and the overlay is cleared. This non-destructive approach provides excellent UX without requiring complex canvas state management.

**Undo/Redo History with Refs**: The history system initially failed intermittently. The saveToHistory and restoreFromHistory functions used stale state values from closures, causing incorrect canvas states to be saved or restored. The solution was storing history entirely in useRef objects (historyRef = useRef<ImageData[]>([])) rather than useState. Refs persist across renders without causing them, and always reference current values when accessed. A historyIndex ref tracks the current position for redo functionality. I sync canvas state with a useEffect that runs on meaningful state changes.

**Touch Event Handling for Mobile**: Mobile drawing initially crashed with "Cannot read property 'clientX' of undefined". The issue was that touchend and touchcancel events have an empty touches array (since no fingers are touching). I fixed this by using e.changedTouches[0] instead of e.touches[0] for end events - changedTouches contains the touch that was just lifted. I also implemented proper touch-action: none CSS to prevent scrolling while drawing, and handled multi-touch scenarios gracefully by only tracking the primary touch.`,

  mini_q4: `Given additional development time and resources, I would implement these strategic improvements to elevate the Learning Journal to a production-ready, feature-rich platform:

**Real-Time Multiplayer Features**: 
Implement real-time multiplayer functionality using WebSocket technology (Socket.io or native WebSockets). For the Memory Game, this would enable competitive head-to-head matches where two players race to find matches, cooperative modes where players work together to clear the board, and global leaderboards with ranking systems. For the journal, study groups could share notes and reflections in real-time with live presence indicators showing who's currently viewing or editing. This would require implementing a WebSocket server, handling connection management, room-based messaging, and state synchronization with conflict resolution for concurrent edits.

**AI-Powered Intelligent Features**:
Integrate modern AI capabilities to provide genuinely useful learning assistance. Natural language processing could analyze journal entry content to automatically suggest relevant tags, identify key concepts, and generate summary insights. AI-powered learning recommendations could suggest related topics based on entry analysis, recommend resources from a curated database, and identify knowledge gaps based on coverage analysis. Automated weekly and monthly progress summaries could synthesize entries into coherent reports highlighting achievements, challenges, and growth areas. Integration with APIs like OpenAI or local LLMs would power these features while maintaining privacy options.

**Native Mobile App Packaging**:
Package the PWA as native Android and iOS applications using Capacitor (or React Native for a full rewrite). Native packaging provides deeper device integration including reliable background sync even when the app is closed, native push notification channels with rich formatting, biometric authentication (fingerprint, Face ID) for secure access, camera integration for photo journals and document scanning, and native share sheets for seamless content sharing. App store distribution would improve discoverability and user trust compared to PWA installation.

**Comprehensive Social Features**:
Transform the personal journal into a learning community platform. Users could create public profiles showcasing achievements and learning progress, follow other learners to see their public entries and get inspiration, form study groups with shared spaces for collaborative learning, and participate in learning challenges with community-wide goals and rewards. Privacy controls would give users granular control over what's shared. This social layer would increase engagement and accountability through peer support.

**Advanced Machine Learning Analytics**:
Implement sophisticated ML-powered analytics to provide actionable insights. Pattern recognition could identify optimal study times based on entry quality and completion rates, topic clusters showing how different learning areas connect, and productivity trends correlating with external factors (time of day, day of week, weather). Predictive features could forecast learning velocity, suggest when to review topics based on spaced repetition algorithms, and identify at-risk periods where engagement might drop. Visualizations would include interactive knowledge graphs, skill trees, and personalized learning roadmaps.

**Voice Notes and Audio Journal**:
Add audio recording capabilities using the MediaRecorder API for voice journal entries. Speech-to-text transcription (via Web Speech API or cloud services like Google Speech-to-Text) would convert recordings to searchable text, enabling full-text search across voice entries. Audio entries would support playback with speed controls, chapter markers, and waveform visualization. This modality would be valuable for learners who prefer verbal processing or for capturing thoughts on-the-go.

**Comprehensive Accessibility Compliance**:
Conduct thorough accessibility auditing using automated tools (axe, WAVE) and manual testing with screen readers (NVDA, VoiceOver). Implement full WCAG 2.1 AA compliance including proper heading hierarchy, ARIA labels and landmarks, keyboard navigation for all interactions, focus management in modals and dynamic content, skip links, sufficient color contrast, and reduced motion options. Test with actual users who rely on assistive technologies to validate the experience.`,

  appendices: `**Appendix A: Complete Technology Stack**

**Frontend Technologies:**
- React 18.2 - Modern UI library with hooks, context, and concurrent features
- TypeScript 5.x - Static typing for improved code quality and developer experience
- Tailwind CSS 3.x - Utility-first CSS framework for rapid, responsive styling
- shadcn/ui - Accessible, customizable component library built on Radix UI primitives
- Recharts - Declarative charting library for analytics visualizations
- Wouter - Lightweight React router (~1.5KB) for client-side navigation
- TanStack React Query - Server state management with caching, refetching, and optimistic updates
- React Hook Form + Zod - Form handling with schema-based validation
- Framer Motion - Production-ready animation library for React
- Lucide React - Beautiful, consistent icon library

**Backend Technologies:**
- Node.js 20.x - JavaScript runtime with modern ES module support
- Express.js 4.x - Minimalist web framework for RESTful API development
- Drizzle ORM - Type-safe SQL ORM with excellent TypeScript integration
- PostgreSQL 15 (Neon Serverless) - Robust relational database with serverless scaling

**Storage & Offline:**
- IndexedDB via localforage - Client-side database for offline data persistence
- localStorage - Simple key-value storage for preferences and settings
- Service Workers - Background scripts enabling offline functionality and caching

**PWA Technologies:**
- Web App Manifest - Configuration for installability and app metadata
- Service Worker API - Background caching, offline support, and push notifications
- Cache API - Programmatic cache management for assets and responses

**Audio & Graphics:**
- Web Audio API - Real-time audio synthesis for procedural music generation
- HTML5 Canvas API - 2D graphics rendering for the Creative Canvas
- CSS 3D Transforms - Hardware-accelerated 3D animations for card flips

**Build & Development Tools:**
- Vite 5.x - Next-generation frontend build tool with instant HMR
- ESBuild - Ultra-fast JavaScript bundler for production builds
- PostCSS + Autoprefixer - CSS processing and vendor prefixing
- ESLint + Prettier - Code linting and formatting

**Appendix B: Complete Features Summary**

**1. Core Journal Features:**
- Rich Markdown editor with live preview using @uiw/react-md-editor
- Flexible tagging system with autocomplete and tag management
- Full-text search across all entries with filtering by date and tags
- Multiple export formats: PDF, Markdown, JSON

**2. Project Tracking:**
- Project cards with descriptions, status, and progress tracking
- Technology stack tagging with icon support
- Links to repositories and live demos
- Project archiving and categorization

**3. Analytics Dashboard:**
- Current and longest learning streak tracking
- Weekly and monthly activity trend charts
- Tag distribution analysis with word clouds
- GitHub-style yearly activity heatmap
- Entry statistics (total count, average length, most productive day)

**4. Achievements & Gamification:**
- 15+ achievement badges for various milestones
- Progress tracking toward next achievements
- Persistent achievement storage across sessions
- Achievement notifications with celebrations

**5. Celestial Memory Game:**
- 30 unique celestial icons with 3-color SVG gradients
- Procedural ambient music (C major 7 chord + pentatonic chimes)
- Wild Comet cards that match any other card
- Constellation Quest mode with power-ups
- Four unlockable visual themes
- Three game modes: Zen, Challenge, Constellation Quest
- 3D card flip animations and particle effects
- Persistent high scores and game statistics

**6. Professional Creative Canvas:**
- 6 drawing tools: Pen, Eraser, Line, Rectangle, Circle, Fill
- Dual-canvas architecture with live shape preview
- 10 preset colors + custom color picker
- Adjustable brush size (1-50px)
- Undo/Redo with 50-state history
- Gallery system for saving and loading artwork
- PNG export functionality
- Full touch/mobile support

**7. Mobile App Navigation:**
- Bottom navigation bar with 5 primary destinations
- Menu page with categorized feature access
- Options page for user preferences
- Settings page for system configuration
- Explore page for feature discovery
- Responsive layout adapting to screen size

**8. PWA Capabilities:**
- Full offline functionality with IndexedDB persistence
- Install-to-home-screen with native app experience
- Intelligent caching with network-first strategy for dynamic content
- Background sync queue for offline changes
- Network status indicators
- Cache management and manual refresh controls

**9. Academic Portfolio:**
- Structured template following university requirements
- Word count validation for each section
- Edit/Preview mode toggle
- Professional PDF export with academic formatting
- Table of contents sidebar navigation

**Appendix C: API Endpoints Reference**

**Journal Endpoints:**
- GET /api/journals - Retrieve all journal entries (supports ?deviceId filter)
- GET /api/journals/:id - Retrieve single entry by ID
- POST /api/journals - Create new journal entry
- PUT /api/journals/:id - Update existing entry
- DELETE /api/journals/:id - Delete entry

**Project Endpoints:**
- GET /api/projects - Retrieve all projects
- GET /api/projects/:id - Retrieve single project
- POST /api/projects - Create new project
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

**Reflection Endpoints (Lab 6):**
- GET /api/lab6-reflections - Retrieve all reflections
- POST /api/lab6-reflections - Create new reflection
- PUT /api/lab6-reflections/:id - Update reflection
- DELETE /api/lab6-reflections/:id - Delete reflection

**Profile Endpoints:**
- GET /api/profile - Retrieve user profile
- PUT /api/profile - Update profile information

**External API Integrations:**
- Open-Meteo Weather API - Current weather by coordinates
- GitHub REST API - User profiles and repository statistics

**Appendix D: Screenshots Reference**
1. Home Dashboard - Quick actions, recent entries, streak display
2. Journal Entry Editor - Markdown editor with tag management
3. Analytics Dashboard - Charts, heatmaps, statistics
4. Celestial Memory Game - Game board with ambient audio toggle
5. Creative Canvas - Drawing interface with tool palette
6. Bottom Navigation - Mobile app-style navigation bar
7. Portfolio Page - Academic portfolio with PDF export
8. Settings Page - Preference controls and data management
9. PWA Install Flow - Installation prompt and standalone mode`,

  bibliography: `**Core Technologies References:**

1. Mozilla Developer Network (MDN). (2025). Progressive Web Apps: An Overview. Mozilla Foundation. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

2. React Team. (2025). React 18 Documentation: Hooks, Components, and Concurrent Features. Meta Platforms. https://react.dev/

3. Tailwind Labs. (2025). Tailwind CSS Documentation: Utility-First CSS Framework. https://tailwindcss.com/docs

4. shadcn. (2025). shadcn/ui: Beautifully Designed Components Built with Radix UI and Tailwind CSS. https://ui.shadcn.com/

5. Drizzle Team. (2025). Drizzle ORM: Type-Safe SQL for TypeScript. https://orm.drizzle.team/

**PWA and Offline Technologies:**

6. Google Developers. (2025). Workbox: JavaScript Libraries for Progressive Web Apps. https://developers.google.com/web/tools/workbox

7. Mozilla Developer Network (MDN). (2025). Service Worker API. https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

8. Mozilla Developer Network (MDN). (2025). Web App Manifest. https://developer.mozilla.org/en-US/docs/Web/Manifest

9. Mozilla Developer Network (MDN). (2025). IndexedDB API. https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

10. localforage Contributors. (2025). localforage: Offline Storage, Improved. https://localforage.github.io/localForage/

**External APIs:**

11. Open-Meteo. (2025). Free Weather API: Open-Source Weather Forecast API. https://open-meteo.com/en/docs

12. GitHub. (2025). GitHub REST API Documentation. https://docs.github.com/en/rest

**Audio and Graphics:**

13. Mozilla Developer Network (MDN). (2025). Web Audio API: High-Level JavaScript API for Audio Processing. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

14. Mozilla Developer Network (MDN). (2025). Canvas API: 2D Graphics Rendering Context. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

15. Mozilla Developer Network (MDN). (2025). CSS Transforms: 2D and 3D Transformations. https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transforms

**Supporting Libraries:**

16. Recharts Contributors. (2025). Recharts: A Composable Charting Library for React. https://recharts.org/

17. jsPDF Contributors. (2025). jsPDF: Client-Side PDF Generation. https://github.com/parallax/jsPDF

18. Vite Team. (2025). Vite: Next Generation Frontend Tooling. https://vitejs.dev/

19. TanStack. (2025). TanStack Query: Powerful Asynchronous State Management for React. https://tanstack.com/query/latest

20. React Hook Form Team. (2025). React Hook Form: Performant, Flexible Forms. https://react-hook-form.com/

**Academic and Research References:**

21. Firtman, M. (2024). Learn Progressive Web Apps: Building Modern Web Experiences. O'Reilly Media.

22. Osmani, A. & Gaunt, M. (2024). "Service Workers: An Introduction." Google Web Fundamentals. https://developers.google.com/web/fundamentals/primers/service-workers

23. World Wide Web Consortium (W3C). (2025). Web Content Accessibility Guidelines (WCAG) 2.1. https://www.w3.org/WAI/WCAG21/quickref/

24. Nielsen Norman Group. (2024). "Mobile-First Design: Understanding the Approach." https://www.nngroup.com/articles/mobile-first/

25. Coyier, C. & Weyl, E. (2024). "A Complete Guide to Flexbox." CSS-Tricks. https://css-tricks.com/snippets/css/a-guide-to-flexbox/`
};

const emptyData: PortfolioData = {
  studentName: "",
  studentId: "",
  programme: "BSc Computer Science",
  githubLink: "",
  liveProjectLink: "",
  introduction: "",
  lab1: "",
  lab2_q1: "",
  lab2_q2: "",
  lab2_q3: "",
  lab3_q1: "",
  lab3_q2: "",
  lab3_q3: "",
  lab4_q1: "",
  lab4_q2: "",
  lab4_q3: "",
  lab4_q4: "",
  lab5_q1: "",
  lab5_q2: "",
  lab5_q3: "",
  lab5_q4: "",
  lab6_q1: "",
  lab6_q2: "",
  lab6_q3: "",
  lab6_q4: "",
  lab6_q5: "",
  lab7_q1: "",
  lab7_q2: "",
  lab7_q3: "",
  lab7_q4: "",
  mini_q1: "",
  mini_q2: "",
  mini_q3: "",
  mini_q4: "",
  appendices: "",
  bibliography: ""
};

const STORAGE_KEY = "portfolio_data";

const sectionRequirements: Record<string, { min: number; max: number }> = {
  introduction: { min: 100, max: 250 },
  lab1: { min: 250, max: 400 },
  lab2: { min: 150, max: 300 },
  lab3: { min: 150, max: 300 },
  lab4: { min: 200, max: 400 },
  lab5: { min: 200, max: 400 },
  lab6: { min: 250, max: 500 },
  lab7: { min: 200, max: 400 },
  mini: { min: 600, max: 1000 }
};

export default function PortfolioPage() {
  const { toast } = useToast();
  const [data, setData] = useState<PortfolioData>(prefilledData);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [activeSection, setActiveSection] = useState<string>("cover");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    cover: true,
    info: true,
    intro: true,
    lab1: true,
    lab2: true,
    lab3: true,
    lab4: true,
    lab5: true,
    lab6: true,
    lab7: true,
    mini: true,
    appendix: true,
    bibliography: true
  });

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    localforage.getItem<PortfolioData>(STORAGE_KEY).then((saved) => {
      if (saved) setData(saved);
    });
  }, []);

  const updateField = (field: keyof PortfolioData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(expandedSections).forEach(key => { allExpanded[key] = true; });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    Object.keys(expandedSections).forEach(key => { allCollapsed[key] = false; });
    setExpandedSections(allCollapsed);
  };

  const loadTemplate = () => {
    setData(prefilledData);
    toast({ title: "Template Loaded", description: "Pre-filled template content loaded. Edit to personalize." });
  };

  const clearAll = () => {
    setData(emptyData);
    toast({ title: "Cleared", description: "All content has been cleared." });
  };

  const saveData = async () => {
    setSaving(true);
    try {
      await localforage.setItem(STORAGE_KEY, data);
      toast({ title: "Saved", description: "Portfolio data saved locally" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getWordCountStatus = (current: number, min: number, max: number): "under" | "good" | "over" => {
    if (current < min) return "under";
    if (current > max) return "over";
    return "good";
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (!expandedSections[sectionId]) {
      setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 25;
      const maxWidth = pageWidth - 2 * margin;
      let yPos = margin;

      const addPage = () => {
        doc.addPage();
        yPos = margin;
      };

      const checkPageBreak = (height: number) => {
        if (yPos + height > pageHeight - 30) {
          addPage();
        }
      };

      const addCenteredText = (text: string, size: number, bold: boolean = false) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.text(text, pageWidth / 2, yPos, { align: "center" });
        yPos += size * 0.5;
      };

      const addHeading = (text: string, level: number = 1) => {
        checkPageBreak(20);
        const size = level === 1 ? 14 : level === 2 ? 12 : 11;
        doc.setFontSize(size);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(text, margin, yPos);
        yPos += size * 0.6;
      };

      const addQuestion = (text: string) => {
        checkPageBreak(15);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50, 50, 50);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 2;
      };

      const addParagraph = (text: string) => {
        if (!text.trim()) {
          yPos += 4;
          return;
        }
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);
        const lines = doc.splitTextToSize(text, maxWidth);
        lines.forEach((line: string) => {
          checkPageBreak(5);
          doc.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 4;
      };

      const addSpacer = (height: number = 8) => {
        yPos += height;
      };

      doc.setTextColor(0, 0, 0);
      yPos = 50;
      addCenteredText("UNIVERSITY FOR THE CREATIVE ARTS", 14, true);
      yPos += 35;
      addCenteredText("Portfolio", 24, true);
      yPos += 8;
      addCenteredText("FGCT6021 Mobile Application Development", 12);
      yPos += 35;
      addCenteredText(data.studentName || "Your Name", 16, true);
      yPos += 8;
      addCenteredText(data.programme || "BSc Computer Science", 12);
      yPos += 25;
      addCenteredText("January 2026", 12);

      yPos = pageHeight - 70;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const declaration = `I, ${data.studentName || "Your Name"}, confirm that the work presented in this portfolio is my own. ChatGPT (OpenAI) was used to paraphrase selected sentences and review grammar to improve the clarity of the writing. Where information has been derived from other sources, I confirm that this has been indicated in the portfolio.`;
      const declLines = doc.splitTextToSize(declaration, maxWidth);
      declLines.forEach((line: string) => {
        doc.text(line, margin, yPos);
        yPos += 4;
      });
      yPos += 8;
      doc.text(`© 2026, ${data.studentName || "Your Name"}`, margin, yPos);
      yPos += 4;
      doc.text("School of Games & Creative Technology", margin, yPos);
      yPos += 4;
      doc.text("University for the Creative Arts", margin, yPos);

      addPage();
      addHeading("Contents", 1);
      addSpacer(8);
      const toc = [
        "1   Introduction",
        "2   Lab 1 – Introduction to Mobile App",
        "3   Lab 2 – Frontend Fundamentals",
        "    3.1 How did you approach mobile-first design?",
        "    3.2 What was the most useful HTML or CSS concept you applied?",
        "    3.3 What part of HTML or CSS did you find most challenging?",
        "4   Lab 3 – JavaScript & DOM Manipulation",
        "    4.1 Which DOM selection methods did you use, and why?",
        "    4.2 What was the most challenging part about linking JavaScript with HTML?",
        "    4.3 How did you test and debug your JavaScript code?",
        "5   Lab 4 – API",
        "    5.1 Which Storage, Browser, and Third-Party APIs did you choose?",
        "    5.2 How did you integrate each API with DOM manipulation?",
        "    5.3 What challenges did you encounter, and how did you solve them?",
        "    5.4 In what ways do these APIs improve your Learning Journal PWA?",
        "6   Lab 5 – Python & JSON",
        "    6.1 How is storing data in a JSON file different from browser storage?",
        "    6.2 How did you use Python to create or update your JSON file?",
        "    6.3 What does your PWA show locally vs on GitHub?",
        "    6.4 What extra feature did you add using the JSON file?",
        "7   Lab 6 – Frontend & Backend",
        "    7.1 Why is the frontend–backend connection important?",
        "    7.2 Which HTTP methods did you use in Flask, and why?",
        "    7.3 Flask vs browser for JSON data handling differences",
        "    7.4 PythonAnywhere difficulties and solutions",
        "    7.5 What extra feature did you build with Flask?",
        "8   Lab 7 – PWA",
        "    8.1 Why enhance your Flask app with PWA features?",
        "    8.2 What did you use for offline access and dynamic data?",
        "    8.3 What extra feature did you add?",
        "    8.4 Deployment challenges and solutions",
        "9   Mini Project",
        "    9.1 What additional features did you add?",
        "    9.2 Why did you choose your mini project idea?",
        "    9.3 What technical challenges did you face?",
        "    9.4 What would you improve given more time?",
        "Appendices",
        "Bibliography"
      ];
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      toc.forEach(item => {
        checkPageBreak(6);
        doc.text(item, margin, yPos);
        yPos += 6;
      });

      addPage();
      addHeading("1   Introduction", 1);
      addSpacer(4);
      addParagraph(data.introduction);

      addSpacer(10);
      addHeading("2   Lab 1 – Introduction to Mobile App", 1);
      addSpacer(4);
      addParagraph(data.lab1);
      if (data.githubLink || data.liveProjectLink) {
        addSpacer(3);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Project Links:", margin, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        if (data.githubLink) {
          doc.text(`GitHub Repository: ${data.githubLink}`, margin, yPos);
          yPos += 4;
        }
        if (data.liveProjectLink) {
          doc.text(`Live Project: ${data.liveProjectLink}`, margin, yPos);
          yPos += 4;
        }
      }

      addPage();
      addHeading("3   Lab 2 – Frontend Fundamentals", 1);
      addSpacer(4);
      addQuestion("3.1 How did you approach mobile-first design?");
      addParagraph(data.lab2_q1);
      addQuestion("3.2 What was the most useful HTML or CSS concept you applied this week?");
      addParagraph(data.lab2_q2);
      addQuestion("3.3 What part of HTML or CSS did you find most challenging or confusing?");
      addParagraph(data.lab2_q3);

      addPage();
      addHeading("4   Lab 3 – JavaScript & DOM Manipulation", 1);
      addSpacer(4);
      addQuestion("4.1 Which DOM selection methods did you use, and why did you choose them?");
      addParagraph(data.lab3_q1);
      addQuestion("4.2 What was the most challenging part about linking JavaScript with your HTML?");
      addParagraph(data.lab3_q2);
      addQuestion("4.3 How did you test and debug your JavaScript code?");
      addParagraph(data.lab3_q3);

      addPage();
      addHeading("5   Lab 4 – API", 1);
      addSpacer(4);
      addQuestion("5.1 Which Storage, Browser, and Third-Party APIs did you choose, and why?");
      addParagraph(data.lab4_q1);
      addQuestion("5.2 How did you integrate each API with DOM manipulation?");
      addParagraph(data.lab4_q2);
      addQuestion("5.3 What challenges did you encounter, and how did you solve them?");
      addParagraph(data.lab4_q3);
      addQuestion("5.4 In what ways do these APIs improve your Learning Journal PWA?");
      addParagraph(data.lab4_q4);

      addPage();
      addHeading("6   Lab 5 – Python & JSON", 1);
      addSpacer(4);
      addQuestion("6.1 How is storing data in a JSON file different from using browser storage?");
      addParagraph(data.lab5_q1);
      addQuestion("6.2 How did you use Python to create or update your JSON file?");
      addParagraph(data.lab5_q2);
      addQuestion("6.3 What does your PWA show locally, and what will users see on GitHub? Are they the same? Why or why not?");
      addParagraph(data.lab5_q3);
      addQuestion("6.4 What extra feature did you add to your PWA using the JSON file, and why?");
      addParagraph(data.lab5_q4);

      addPage();
      addHeading("7   Lab 6 – Frontend & Backend", 1);
      addSpacer(4);
      addQuestion("7.1 Why is the frontend–backend connection important?");
      addParagraph(data.lab6_q1);
      addQuestion("7.2 Which HTTP methods did you use in Flask, and why?");
      addParagraph(data.lab6_q2);
      addQuestion("7.3 What is the difference between using Flask to store and load JSON data and reading JSON directly in the browser?");
      addParagraph(data.lab6_q3);
      addQuestion("7.4 Did you face any difficulties when running your project on PythonAnywhere? How did you handle them?");
      addParagraph(data.lab6_q4);
      addQuestion("7.5 What extra feature did you build into your PWA with Flask, and why did you add it?");
      addParagraph(data.lab6_q5);

      addPage();
      addHeading("8   Lab 7 – PWA", 1);
      addSpacer(4);
      addQuestion("8.1 Why is it useful to enhance your Flask app with PWA features?");
      addParagraph(data.lab7_q1);
      addQuestion("8.2 What did you use to support offline access and dynamic data?");
      addParagraph(data.lab7_q2);
      addQuestion("8.3 What extra feature did you add, and why?");
      addParagraph(data.lab7_q3);
      addQuestion("8.4 Did you face any challenges deploying your PWA, and how did you solve them?");
      addParagraph(data.lab7_q4);

      addPage();
      addHeading("9   Mini Project", 1);
      addSpacer(4);
      addQuestion("9.1 What additional features did you add to your Learning Journal?");
      addParagraph(data.mini_q1);
      addQuestion("9.2 Why did you choose your mini project idea?");
      addParagraph(data.mini_q2);
      addQuestion("9.3 What technical challenges did you face and how did you solve them?");
      addParagraph(data.mini_q3);
      addQuestion("9.4 What would you improve if given more time?");
      addParagraph(data.mini_q4);

      addPage();
      addHeading("Appendices", 1);
      addSpacer(4);
      addParagraph(data.appendices);

      addSpacer(15);
      addHeading("Bibliography", 1);
      addSpacer(4);
      addParagraph(data.bibliography);

      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(`${i}`, pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      const fileName = data.studentName && data.studentId
        ? `${data.studentId}_${data.studentName.replace(/\s+/g, '_')}_report.pdf`
        : "Portfolio_FGCT6021.pdf";
      doc.save(fileName);
      
      toast({
        title: "PDF Generated",
        description: `Your portfolio "${fileName}" has been downloaded.`
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const WordCountBadge = ({ current, min, max }: WordCountInfo) => {
    const status = getWordCountStatus(current, min, max);
    return (
      <Badge 
        variant={status === "good" ? "default" : "outline"}
        className={`text-xs ${
          status === "under" ? "border-amber-500 text-amber-600 dark:text-amber-400" : 
          status === "over" ? "border-red-500 text-red-600 dark:text-red-400" : 
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        }`}
      >
        {status === "good" && <Check className="h-3 w-3 mr-1" />}
        {status !== "good" && <AlertCircle className="h-3 w-3 mr-1" />}
        {current}/{min}-{max} words
      </Badge>
    );
  };

  const SectionHeader = ({ 
    id, 
    title, 
    expanded, 
    icon: Icon,
    wordCount 
  }: { 
    id: string; 
    title: string; 
    expanded: boolean; 
    icon?: React.ComponentType<{ className?: string }>;
    wordCount?: WordCountInfo;
  }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover-elevate rounded-t-lg"
      data-testid={`button-section-${id}`}
    >
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        {wordCount && viewMode === "edit" && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            getWordCountStatus(wordCount.current, wordCount.min, wordCount.max) === "good" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-muted text-muted-foreground"
          }`}>
            {wordCount.current} words
          </span>
        )}
      </div>
      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
    </button>
  );

  const totalIntroWords = countWords(data.introduction);
  const totalLab1Words = countWords(data.lab1);
  const totalLab2Words = countWords(data.lab2_q1) + countWords(data.lab2_q2) + countWords(data.lab2_q3);
  const totalLab3Words = countWords(data.lab3_q1) + countWords(data.lab3_q2) + countWords(data.lab3_q3);
  const totalLab4Words = countWords(data.lab4_q1) + countWords(data.lab4_q2) + countWords(data.lab4_q3) + countWords(data.lab4_q4);
  const totalLab5Words = countWords(data.lab5_q1) + countWords(data.lab5_q2) + countWords(data.lab5_q3) + countWords(data.lab5_q4);
  const totalLab6Words = countWords(data.lab6_q1) + countWords(data.lab6_q2) + countWords(data.lab6_q3) + countWords(data.lab6_q4) + countWords(data.lab6_q5);
  const totalLab7Words = countWords(data.lab7_q1) + countWords(data.lab7_q2) + countWords(data.lab7_q3) + countWords(data.lab7_q4);
  const totalMiniWords = countWords(data.mini_q1) + countWords(data.mini_q2) + countWords(data.mini_q3) + countWords(data.mini_q4);

  const tocItems = [
    { id: "cover", label: "Cover Page", icon: FileText },
    { id: "intro", label: "1. Introduction", icon: BookOpen },
    { id: "lab1", label: "2. Lab 1 - Introduction", icon: GraduationCap },
    { id: "lab2", label: "3. Lab 2 - Frontend", icon: Code },
    { id: "lab3", label: "4. Lab 3 - JavaScript & DOM", icon: Code },
    { id: "lab4", label: "5. Lab 4 - API", icon: Globe },
    { id: "lab5", label: "6. Lab 5 - Python & JSON", icon: Server },
    { id: "lab6", label: "7. Lab 6 - Frontend & Backend", icon: Server },
    { id: "lab7", label: "8. Lab 7 - PWA", icon: Smartphone },
    { id: "mini", label: "9. Mini Project", icon: Gamepad2 },
    { id: "appendix", label: "Appendices", icon: FileText },
    { id: "bibliography", label: "Bibliography", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden lg:block w-56 shrink-0 border-r h-screen sticky top-0">
          <div className="p-5 border-b">
            <h2 className="font-semibold text-sm text-foreground">Contents</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-65px)]">
            <nav className="p-3 space-y-0.5">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full px-3 py-2 text-sm rounded-md text-left hover-elevate ${
                    activeSection === item.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground"
                  }`}
                  data-testid={`toc-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
            <div className="max-w-3xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h1 className="text-lg font-semibold text-foreground" data-testid="heading-portfolio">
                  FGCT6021 Portfolio
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={loadTemplate} variant="ghost" size="sm" data-testid="button-load-template">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button onClick={clearAll} variant="ghost" size="sm" data-testid="button-clear-all">
                    Clear
                  </Button>
                  <Button onClick={expandAll} variant="ghost" size="sm" data-testid="button-expand-all">
                    Expand
                  </Button>
                  <Button onClick={collapseAll} variant="ghost" size="sm" data-testid="button-collapse-all">
                    Collapse
                  </Button>
                  <Button 
                    onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")} 
                    variant="ghost" 
                    size="sm"
                    data-testid="button-toggle-view"
                  >
                    {viewMode === "edit" ? "Preview" : "Edit"}
                  </Button>
                  <Button onClick={saveData} disabled={saving} variant="outline" size="sm" data-testid="button-save-portfolio">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                  <Button 
                    onClick={generatePDF} 
                    disabled={generating} 
                    size="sm" 
                    data-testid="button-download-pdf"
                  >
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 py-8 space-y-3">
            <Card ref={(el) => { sectionRefs.current.cover = el; }} className="border shadow-none" data-testid="section-cover">
              <SectionHeader id="cover" title="Cover Page" expanded={expandedSections.cover} icon={GraduationCap} />
              {expandedSections.cover && (
                <CardContent className="pt-4 space-y-6">
                  <div className="text-center py-8 px-4 bg-gradient-to-b from-primary/5 to-transparent rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground mb-4">UNIVERSITY FOR THE CREATIVE ARTS</p>
                    <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
                    <p className="text-lg text-muted-foreground mb-8">FGCT6021 Mobile Application Development</p>
                    {viewMode === "edit" ? (
                      <div className="max-w-md mx-auto space-y-4">
                        <div>
                          <Label>Your Name</Label>
                          <Input 
                            value={data.studentName} 
                            onChange={(e) => updateField("studentName", e.target.value)}
                            placeholder="Enter your full name"
                            className="text-center"
                            data-testid="input-student-name"
                          />
                        </div>
                        <div>
                          <Label>Student ID</Label>
                          <Input 
                            value={data.studentId} 
                            onChange={(e) => updateField("studentId", e.target.value)}
                            placeholder="Enter your student ID"
                            className="text-center"
                            data-testid="input-student-id"
                          />
                        </div>
                        <div>
                          <Label>Programme</Label>
                          <Input 
                            value={data.programme} 
                            onChange={(e) => updateField("programme", e.target.value)}
                            placeholder="BSc Computer Science"
                            className="text-center"
                            data-testid="input-programme"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{data.studentName || "Your Name"}</p>
                        <p className="text-muted-foreground">{data.studentId || "Student ID"}</p>
                        <p className="text-muted-foreground">{data.programme}</p>
                      </div>
                    )}
                    <p className="mt-8 text-muted-foreground">January 2026</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg text-sm">
                    <p className="italic">
                      I, <strong>{data.studentName || "Your Name"}</strong>, confirm that the work presented in this portfolio is my own. 
                      ChatGPT (OpenAI) was used to paraphrase selected sentences and review grammar to improve the clarity of the writing. 
                      Where information has been derived from other sources, I confirm that this has been indicated in the portfolio.
                    </p>
                    <p className="mt-4 text-muted-foreground">
                      © 2026, {data.studentName || "Your Name"}<br />
                      School of Games & Creative Technology<br />
                      University for the Creative Arts
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>GitHub Repository Link</Label>
                      <Input 
                        value={data.githubLink} 
                        onChange={(e) => updateField("githubLink", e.target.value)}
                        placeholder="https://github.com/username/repo"
                        data-testid="input-github-link"
                      />
                    </div>
                    <div>
                      <Label>Live Project Link (PythonAnywhere)</Label>
                      <Input 
                        value={data.liveProjectLink} 
                        onChange={(e) => updateField("liveProjectLink", e.target.value)}
                        placeholder="https://username.pythonanywhere.com"
                        data-testid="input-live-link"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.intro = el; }} className="border shadow-none" data-testid="section-intro">
              <SectionHeader 
                id="intro" 
                title="1. Introduction" 
                expanded={expandedSections.intro} 
                icon={BookOpen}
                wordCount={{ current: totalIntroWords, min: 100, max: 250 }}
              />
              {expandedSections.intro && (
                <CardContent className="px-6 pb-6 pt-0">
                  {viewMode === "edit" ? (
                    <Textarea 
                      value={data.introduction}
                      onChange={(e) => updateField("introduction", e.target.value)}
                      placeholder="Write your introduction here..."
                      className="min-h-[180px]"
                      data-testid="textarea-introduction"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {data.introduction.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.lab1 = el; }} className="border shadow-none" data-testid="section-lab1">
              <SectionHeader 
                id="lab1" 
                title="2. Lab 1 – Introduction to Mobile App" 
                expanded={expandedSections.lab1} 
                icon={GraduationCap}
                wordCount={{ current: totalLab1Words, min: 250, max: 400 }}
              />
              {expandedSections.lab1 && (
                <CardContent className="px-6 pb-6 pt-0">
                  {viewMode === "edit" ? (
                    <Textarea 
                      value={data.lab1}
                      onChange={(e) => updateField("lab1", e.target.value)}
                      placeholder="Write your Lab 1 reflection here..."
                      className="min-h-[200px]"
                      data-testid="textarea-lab1"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {data.lab1.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.lab2 = el; }} className="border shadow-none" data-testid="section-lab2">
              <SectionHeader 
                id="lab2" 
                title="3. Lab 2 – Frontend Fundamentals" 
                expanded={expandedSections.lab2} 
                icon={Code}
                wordCount={{ current: totalLab2Words, min: 150, max: 300 }}
              />
              {expandedSections.lab2 && (
                <CardContent className="px-6 pb-6 pt-0 space-y-5">
                  
                  <div>
                    <Label className="text-sm font-medium">3.1 How did you approach mobile-first design?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab2_q1}
                        onChange={(e) => updateField("lab2_q1", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab2-q1"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab2_q1}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3.2 What was the most useful HTML or CSS concept you applied this week?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab2_q2}
                        onChange={(e) => updateField("lab2_q2", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab2-q2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab2_q2}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">3.3 What part of HTML or CSS did you find most challenging or confusing?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab2_q3}
                        onChange={(e) => updateField("lab2_q3", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab2-q3"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab2_q3}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.lab3 = el; }} className="border shadow-none" data-testid="section-lab3">
              <SectionHeader 
                id="lab3" 
                title="4. Lab 3 – JavaScript & DOM Manipulation" 
                expanded={expandedSections.lab3} 
                icon={Code}
                wordCount={{ current: totalLab3Words, min: 150, max: 300 }}
              />
              {expandedSections.lab3 && (
                <CardContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Answer each question in 50–100 words (150–300 words total). Include examples, screenshots or code if relevant.
                  </p>
                  
                  <div>
                    <Label className="text-sm font-medium">4.1 Which DOM selection methods did you use, and why did you choose them?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab3_q1}
                        onChange={(e) => updateField("lab3_q1", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab3-q1"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab3_q1}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4.2 What was the most challenging part about linking JavaScript with your HTML?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab3_q2}
                        onChange={(e) => updateField("lab3_q2", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab3-q2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab3_q2}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">4.3 How did you test and debug your JavaScript code?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab3_q3}
                        onChange={(e) => updateField("lab3_q3", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab3-q3"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab3_q3}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.lab4 = el; }} className="border shadow-none" data-testid="section-lab4">
              <SectionHeader 
                id="lab4" 
                title="5. Lab 4 – API" 
                expanded={expandedSections.lab4} 
                icon={Globe}
                wordCount={{ current: totalLab4Words, min: 200, max: 400 }}
              />
              {expandedSections.lab4 && (
                <CardContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Answer each question in 50–100 words (200–400 words total). Include examples, screenshots or code if relevant.
                  </p>
                  
                  <div>
                    <Label className="text-sm font-medium">5.1 Which Storage, Browser, and Third-Party APIs did you choose, and why?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab4_q1}
                        onChange={(e) => updateField("lab4_q1", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab4-q1"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab4_q1}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">5.2 How did you integrate each API with DOM manipulation?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab4_q2}
                        onChange={(e) => updateField("lab4_q2", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab4-q2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab4_q2}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">5.3 What challenges did you encounter, and how did you solve them?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab4_q3}
                        onChange={(e) => updateField("lab4_q3", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab4-q3"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab4_q3}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">5.4 In what ways do these APIs improve your Learning Journal PWA?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab4_q4}
                        onChange={(e) => updateField("lab4_q4", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab4-q4"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab4_q4}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.lab5 = el; }} className="border shadow-none" data-testid="section-lab5">
              <SectionHeader 
                id="lab5" 
                title="6. Lab 5 – Python & JSON" 
                expanded={expandedSections.lab5} 
                icon={Server}
                wordCount={{ current: totalLab5Words, min: 200, max: 400 }}
              />
              {expandedSections.lab5 && (
                <CardContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Answer each question in 50–100 words (200–400 words total). Include examples, screenshots or code if relevant.
                  </p>
                  
                  <div>
                    <Label className="text-sm font-medium">6.1 How is storing data in a JSON file different from using browser storage?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab5_q1}
                        onChange={(e) => updateField("lab5_q1", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab5-q1"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab5_q1}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">6.2 How did you use Python to create or update your JSON file?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab5_q2}
                        onChange={(e) => updateField("lab5_q2", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab5-q2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab5_q2}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">6.3 What does your PWA show locally, and what will users see on GitHub? Are they the same? Why or why not?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab5_q3}
                        onChange={(e) => updateField("lab5_q3", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab5-q3"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab5_q3}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">6.4 What extra feature did you add to your PWA using the JSON file, and why?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab5_q4}
                        onChange={(e) => updateField("lab5_q4", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab5-q4"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab5_q4}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.lab6 = el; }} className="border shadow-none" data-testid="section-lab6">
              <SectionHeader 
                id="lab6" 
                title="7. Lab 6 – Frontend & Backend" 
                expanded={expandedSections.lab6} 
                icon={Server}
                wordCount={{ current: totalLab6Words, min: 250, max: 500 }}
              />
              {expandedSections.lab6 && (
                <CardContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Answer each question in 50–100 words (250–500 words total). Include examples, screenshots or code if relevant.
                  </p>
                  
                  <div>
                    <Label className="text-sm font-medium">7.1 Why is the frontend–backend connection important?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab6_q1}
                        onChange={(e) => updateField("lab6_q1", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab6-q1"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab6_q1}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">7.2 Which HTTP methods did you use in Flask, and why?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab6_q2}
                        onChange={(e) => updateField("lab6_q2", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab6-q2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab6_q2}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">7.3 What is the difference between using Flask to store and load JSON data and reading JSON directly in the browser?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab6_q3}
                        onChange={(e) => updateField("lab6_q3", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab6-q3"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab6_q3}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">7.4 Did you face any difficulties when running your project on PythonAnywhere? How did you handle them?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab6_q4}
                        onChange={(e) => updateField("lab6_q4", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab6-q4"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab6_q4}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">7.5 What extra feature did you build into your PWA with Flask, and why did you add it?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab6_q5}
                        onChange={(e) => updateField("lab6_q5", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab6-q5"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab6_q5}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.lab7 = el; }} className="border shadow-none" data-testid="section-lab7">
              <SectionHeader 
                id="lab7" 
                title="8. Lab 7 – PWA" 
                expanded={expandedSections.lab7} 
                icon={Smartphone}
                wordCount={{ current: totalLab7Words, min: 200, max: 400 }}
              />
              {expandedSections.lab7 && (
                <CardContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Answer each question in 50–100 words (200–400 words total). Include examples, screenshots or code if relevant.
                  </p>
                  
                  <div>
                    <Label className="text-sm font-medium">8.1 Why is it useful to enhance your Flask app with PWA features?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab7_q1}
                        onChange={(e) => updateField("lab7_q1", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab7-q1"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab7_q1}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">8.2 What did you use to support offline access and dynamic data?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab7_q2}
                        onChange={(e) => updateField("lab7_q2", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab7-q2"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab7_q2}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">8.3 What extra feature did you add, and why?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab7_q3}
                        onChange={(e) => updateField("lab7_q3", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab7-q3"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab7_q3}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">8.4 Did you face any challenges deploying your PWA, and how did you solve them?</Label>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.lab7_q4}
                        onChange={(e) => updateField("lab7_q4", e.target.value)}
                        placeholder="Your answer (50-100 words)..."
                        className="mt-2 min-h-[100px]"
                        data-testid="textarea-lab7-q4"
                      />
                    ) : (
                      <p className="mt-2 text-sm">{data.lab7_q4}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.mini = el; }} className="border shadow-none" data-testid="section-mini">
              <SectionHeader 
                id="mini" 
                title="9. Mini Project" 
                expanded={expandedSections.mini} 
                icon={Gamepad2}
                wordCount={{ current: totalMiniWords, min: 600, max: 1000 }}
              />
              {expandedSections.mini && (
                <CardContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Answer each question in 150–250 words (600–1000 words total). Include examples, screenshots or code if relevant.
                  </p>
                  
                  <div>
                    <Label className="text-sm font-medium">9.1 What additional features did you add to your Learning Journal?</Label>
                    <Badge variant="outline" className="ml-2 text-xs">150-250 words</Badge>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.mini_q1}
                        onChange={(e) => updateField("mini_q1", e.target.value)}
                        placeholder="Describe all the additional features you added..."
                        className="mt-2 min-h-[200px]"
                        data-testid="textarea-mini-q1"
                      />
                    ) : (
                      <div className="mt-2 prose prose-sm dark:prose-invert max-w-none">
                        {data.mini_q1.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">9.2 Why did you choose your mini project idea?</Label>
                    <Badge variant="outline" className="ml-2 text-xs">150-250 words</Badge>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.mini_q2}
                        onChange={(e) => updateField("mini_q2", e.target.value)}
                        placeholder="Explain your reasoning for choosing this mini project..."
                        className="mt-2 min-h-[200px]"
                        data-testid="textarea-mini-q2"
                      />
                    ) : (
                      <div className="mt-2 prose prose-sm dark:prose-invert max-w-none">
                        {data.mini_q2.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">9.3 What technical challenges did you face and how did you solve them?</Label>
                    <Badge variant="outline" className="ml-2 text-xs">150-250 words</Badge>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.mini_q3}
                        onChange={(e) => updateField("mini_q3", e.target.value)}
                        placeholder="Describe the technical challenges and solutions..."
                        className="mt-2 min-h-[200px]"
                        data-testid="textarea-mini-q3"
                      />
                    ) : (
                      <div className="mt-2 prose prose-sm dark:prose-invert max-w-none">
                        {data.mini_q3.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">9.4 What would you improve if given more time?</Label>
                    <Badge variant="outline" className="ml-2 text-xs">150-250 words</Badge>
                    {viewMode === "edit" ? (
                      <Textarea 
                        value={data.mini_q4}
                        onChange={(e) => updateField("mini_q4", e.target.value)}
                        placeholder="List improvements you would make with more time..."
                        className="mt-2 min-h-[200px]"
                        data-testid="textarea-mini-q4"
                      />
                    ) : (
                      <div className="mt-2 prose prose-sm dark:prose-invert max-w-none">
                        {data.mini_q4.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.appendix = el; }} className="border shadow-none" data-testid="section-appendix">
              <SectionHeader 
                id="appendix" 
                title="Appendices" 
                expanded={expandedSections.appendix} 
                icon={FileText}
              />
              {expandedSections.appendix && (
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Include screenshots, code snippets, diagrams, or other supporting materials that are part of your work but too detailed to include in the main sections.
                  </p>
                  {viewMode === "edit" ? (
                    <Textarea 
                      value={data.appendices}
                      onChange={(e) => updateField("appendices", e.target.value)}
                      placeholder="Add your appendices content here..."
                      className="min-h-[300px]"
                      data-testid="textarea-appendices"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {data.appendices.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            <Card ref={(el) => { sectionRefs.current.bibliography = el; }} className="border shadow-none" data-testid="section-bibliography">
              <SectionHeader 
                id="bibliography" 
                title="Bibliography" 
                expanded={expandedSections.bibliography} 
                icon={BookOpen}
              />
              {expandedSections.bibliography && (
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    List any resources, tutorials, or documentation you used. Use a consistent referencing style for all sources. Refer to UCA Library Referencing.
                  </p>
                  {viewMode === "edit" ? (
                    <Textarea 
                      value={data.bibliography}
                      onChange={(e) => updateField("bibliography", e.target.value)}
                      placeholder="Add your bibliography here..."
                      className="min-h-[300px]"
                      data-testid="textarea-bibliography"
                    />
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {data.bibliography.split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Ready to Submit?</h3>
                  <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                    Make sure you've filled in all sections with the required word counts. 
                    Download your PDF and submit it along with your code and presentation.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button onClick={saveData} disabled={saving} variant="outline" size="lg" data-testid="button-save-final">
                      {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Progress
                    </Button>
                    <Button onClick={generatePDF} disabled={generating} size="lg" data-testid="button-download-final">
                      {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                      Download Portfolio PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
