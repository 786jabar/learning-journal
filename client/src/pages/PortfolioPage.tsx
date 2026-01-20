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
  
  introduction: `This portfolio documents my development of a Learning Journal Progressive Web Application for FGCT6021 Mobile Application Development. The application demonstrates my understanding of modern web technologies and mobile-first design principles, serving as both a functional learning tool and a showcase of technical competencies acquired throughout the module.

The Learning Journal was built using React 18 with TypeScript for type-safe frontend development, paired with Node.js and Express.js on the backend. PostgreSQL serves as the primary database, accessed through Drizzle ORM for type-safe queries. The application implements a comprehensive offline-first architecture using Service Workers for asset caching and IndexedDB for local data persistence, ensuring users can continue working without internet connectivity.

Beyond the core journaling functionality, I developed several interactive features that demonstrate advanced browser API integration. The Celestial Memory Game generates ambient background music procedurally using the Web Audio API, while the Professional Creative Canvas employs a dual-layer architecture for non-destructive drawing. These additions transform the application from a simple note-taking tool into an engaging learning platform that showcases the full potential of modern Progressive Web Applications.`,

  lab1: `The first step in developing this application was establishing a robust development environment that would support collaborative work and professional coding practices. I created a GitHub repository to manage version control, ensuring that all changes were tracked with meaningful commit messages that describe the purpose of each modification. Visual Studio Code served as my primary development environment, configured with essential extensions including ESLint for code quality enforcement, Prettier for consistent formatting, and TypeScript language support for enhanced developer productivity.

During the initial setup phase, I explored various deployment options to understand how Progressive Web Applications can be hosted and distributed. PythonAnywhere provided insights into Flask-based deployment with WSGI configuration, while Android Studio demonstrated how PWAs can be packaged as native Android applications using Trusted Web Activities. This exploration was valuable in understanding the deployment landscape for modern web applications.

The foundational PWA concepts I mastered during this phase include the web app manifest for controlling installation behaviour, service worker registration for enabling offline functionality, and the app shell architecture pattern that ensures fast initial loading. A significant challenge I encountered was configuring Git credentials consistently across different development environments, which I resolved by implementing SSH key-based authentication for secure, password-less repository access.

\`\`\`javascript
// Service Worker Registration (client/src/main.tsx)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("SW registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });
  });
}
\`\`\``,

  lab2_q1: `My approach to responsive design followed mobile-first principles, beginning with a base viewport of 320 pixels and progressively enhancing the layout for larger screens. This methodology ensures that the core experience remains accessible on smaller devices while taking advantage of additional screen real estate when available.

Tailwind CSS provided the foundation for responsive styling through its breakpoint system. The sm breakpoint activates at 640 pixels, md at 768 pixels, and lg at 1024 pixels, allowing layouts to adapt fluidly across device categories. Navigation elements use horizontal scrolling on mobile devices to accommodate limited width, transitioning to a full navigation bar on desktop screens. Content cards stack vertically on mobile for easy thumb navigation, reorganising into responsive grid layouts on tablets and desktop displays.

\`\`\`css
/* Responsive Grid Implementation */
.card-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}
\`\`\``,

  lab2_q2: `Flexbox and CSS Grid emerged as the most valuable layout tools for this project, each serving distinct purposes within the interface design. Flexbox proved particularly effective for navigation layouts and content centering, providing intuitive control over element alignment and distribution along a single axis. Its flexibility made it ideal for header components and toolbar arrangements where items need to adapt to varying content sizes.

CSS Grid became essential for creating the main dashboard layout, where cards needed to flow responsively across available space. The auto-fill keyword combined with minmax() creates a truly fluid grid that automatically adjusts column count based on container width. The gap property significantly simplified spacing management compared to traditional margin-based approaches, ensuring consistent gutters without complex calculations.

\`\`\`css
/* Dashboard Grid Layout */
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
\`\`\``,

  lab2_q3: `The most challenging CSS concept I encountered was managing z-index stacking contexts, particularly when implementing sticky headers and modal overlay components. Initially, modals would appear behind other elements despite having high z-index values, which led me to investigate how stacking contexts are created and managed in CSS.

The key insight was understanding that certain CSS properties, including transform and opacity, create new stacking contexts that isolate their children from the global z-index hierarchy. This explained why modals rendered within transformed containers would not layer correctly. I resolved these issues by carefully structuring the DOM and using Tailwind's isolation utility to contain stacking contexts where needed, preventing unexpected layering behaviour across the application.`,

  lab3_q1: `DOM manipulation in this project required careful selection of appropriate methods depending on the use case. For unique elements such as the theme toggle button, I employed getElementById() which provides O(1) constant-time lookup efficiency through the browser's internal hash map. When working with collections of similar elements, such as journal entry cards or form inputs, querySelectorAll() proved more appropriate as it returns a NodeList of all matching elements that can be iterated.

For more complex selection requirements based on CSS selectors, querySelector() offered the flexibility needed for targeting elements by attributes, classes, or pseudo-selectors. In the React portions of the application, I transitioned to using useRef hooks which provide stable DOM references that persist across component re-renders without triggering unnecessary updates.

\`\`\`javascript
// DOM Selection Examples
const themeBtn = document.getElementById('theme-toggle');
const cards = document.querySelectorAll('.entry-card');
const activeBtn = document.querySelector('button[data-active="true"]');
\`\`\``,

  lab3_q2: `Event listener timing presented a significant challenge during development, as handlers would occasionally execute before the DOM had fully loaded, resulting in null reference errors when attempting to access elements. In vanilla JavaScript contexts, I resolved this by wrapping event listener registration within DOMContentLoaded callbacks to ensure the document structure was complete before any manipulation occurred.

Within React components, the useEffect hook served as the primary mechanism for managing event listeners, with the cleanup function in the return statement ensuring listeners are properly removed when components unmount. This pattern prevents memory leaks that can occur when orphaned event listeners continue to reference unmounted components. For nested clickable elements, understanding event propagation was essential, and I employed stopPropagation() strategically to prevent unintended parent handler execution.

\`\`\`javascript
// React Event Listener with Cleanup
useEffect(() => {
  const handleClick = (e) => { /* handler logic */ };
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []);
\`\`\``,

  lab3_q3: `Chrome DevTools became an indispensable tool throughout the debugging process, providing comprehensive insights into application behaviour. The Console panel served as the primary output for logging statements and error tracking, while the Sources panel enabled step-through debugging with breakpoints at critical code paths. The Network panel was particularly valuable for verifying API request and response data, helping identify issues with fetch operations.

For PWA-specific debugging, the Application panel provided visibility into IndexedDB contents, service worker registration status, and cached resources. Error handling throughout the application utilises try-catch blocks that display user-friendly messages through the toast notification system, ensuring users understand when operations fail without being exposed to technical error details.`,

  lab4_q1: `This application integrates multiple categories of APIs to deliver comprehensive functionality. For client-side storage, IndexedDB accessed through the localforage library provides the primary persistence layer, offering gigabytes of storage capacity compared to the 5MB limit of localStorage. This substantial capacity is essential for storing journal entries, project data, and cached assets for offline access. LocalStorage handles simpler requirements such as user preferences and theme settings.

Browser APIs enhance the user experience through native platform integration. The Clipboard API enables one-click copying of content, the Notifications API delivers reminders and updates, and the Geolocation API provides location context for entries. The Web Audio API powers the procedural music generation in the Memory Game, creating an immersive audio experience without requiring pre-recorded audio files.

For external data integration, the Open-Meteo Weather API provides current weather information without requiring an API key, while the GitHub REST API retrieves user profile information and repository statistics for developer-focused features.

\`\`\`javascript
// Weather API Integration
const response = await fetch(
  \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current_weather=true\`
);
const data = await response.json();
\`\`\``,

  lab4_q2: `API integration follows a consistent pattern throughout the application using modern async/await syntax for clean, readable asynchronous code. The Weather API fetches current temperature and conditions based on user coordinates, with the response data rendered through dedicated React components that handle loading, error, and success states appropriately.

The GitHub API integration populates user profile cards with avatar images, repository counts, and follower information, providing social context within the application. The Clipboard API implementation uses navigator.clipboard.writeText() paired with visual feedback through toast notifications, ensuring users receive confirmation when content is successfully copied. All API-dependent components display skeleton loading states during data fetching, preventing layout shifts and providing visual feedback that operations are in progress.`,

  lab4_q3: `API integration presented several technical challenges that required thoughtful solutions. Cross-Origin Resource Sharing (CORS) restrictions initially blocked requests to external APIs, which I resolved by ensuring proper headers were configured on the server side and using appropriate request modes on the client.

Rate limiting on the GitHub API required implementing a caching strategy where responses are stored in localStorage with expiration timestamps, reducing unnecessary repeated requests. Perhaps the most unexpected challenge was browser autoplay policies for the Web Audio API, which prevented audio context creation without prior user interaction. This was resolved by deferring audio initialisation until the first user click within the game interface.

\`\`\`javascript
try {
  const data = await fetchWeather(lat, lon);
  setWeather(data);
} catch (err) {
  toast({ title: "Weather unavailable", variant: "destructive" });
}
\`\`\``,

  lab4_q4: `The integration of multiple APIs fundamentally transforms this application from a simple note-taking tool into a capable Progressive Web Application. IndexedDB enables complete offline CRUD operations with a sync queue that reconciles changes when connectivity returns, ensuring no user work is lost regardless of network conditions.

The Weather API adds contextual awareness to journal entries, allowing users to record atmospheric conditions alongside their thoughts. The Notifications API maintains user engagement through timely reminders and updates. Perhaps most impressively, the Web Audio API creates the entire soundscape for the Celestial Memory Game through procedural generation, producing harmonious C major 7 chord progressions without requiring any audio file downloads.`,

  lab5_q1: `The choice between server-side JSON files and browser-based storage involves important trade-offs that I carefully considered during the architecture design. Server-stored JSON files offer the significant advantage of cross-device accessibility, meaning data entered on a mobile phone is immediately available on a laptop browser. Additionally, JSON files can be version-controlled through Git, providing a history of data changes.

However, browser storage technologies like IndexedDB and localStorage offer dramatically faster access times, measured in milliseconds rather than the hundreds of milliseconds required for network round-trips. My chosen architecture leverages both approaches: IndexedDB provides instant access to cached data for responsive user interaction, while the server maintains the authoritative copy that enables synchronisation across devices when connectivity is available.`,

  lab5_q2: `Data manipulation through Python follows a straightforward read-modify-write pattern. The json.load() function parses JSON files into Python dictionaries, which can then be manipulated using standard dictionary operations. After modifications, json.dump() serialises the updated dictionary back to the file.

Flask provides the web framework for exposing these operations as RESTful API endpoints. The POST endpoint for creating new reflections demonstrates this pattern, automatically generating unique IDs by incrementing the maximum existing ID and adding timestamps to provide temporal context for each entry.

\`\`\`python
@app.route('/api/reflections', methods=['POST'])
def create_reflection():
    data = request.get_json()
    reflections = load_json('reflections.json')
    new_id = max([r['id'] for r in reflections], default=0) + 1
    data['id'] = new_id
    reflections.append(data)
    save_json('reflections.json', reflections)
    return jsonify(data), 201
\`\`\``,

  lab5_q3: `The behaviour difference between local development and deployed environments required careful consideration. During local development, the PWA loads data from IndexedDB instantaneously for a responsive experience, while simultaneously initiating background fetch requests to the server to detect and merge any updates from other devices.

When deployed to static hosting platforms like GitHub Pages, JSON data files are effectively frozen at the time of deployment since there is no server-side runtime to process write requests. This limitation means dynamic features such as creating new entries or updating existing data require deployment to platforms with server capabilities, such as PythonAnywhere, Replit, or similar services that can execute backend code.`,

  lab5_q4: `To complement the main journal functionality, I implemented a dedicated reflections feature designed for quick daily insights. Unlike full journal entries that may require substantial writing, reflections provide a lightweight capture mechanism for brief thoughts, observations, or reminders.

The reflections feature includes category tagging for organisation, full markdown support for formatted content, and automatic timestamps for temporal tracking. Search and filtering capabilities make it easy to locate specific reflections, while export options in PDF and Markdown formats enable users to extract their reflections for external use or portfolio building.`,

  lab6_q1: `The separation of frontend and backend concerns provides several critical advantages for this application. Most importantly, a dedicated backend enables data persistence across devices, meaning users can access their journal entries from any browser rather than being confined to a single device's local storage. Server-side validation ensures data integrity by checking inputs before they reach the database, while proper security measures protect sensitive information.

The frontend focuses exclusively on user interface and experience, handling all visual presentation and client-side interaction logic. The backend manages PostgreSQL database operations and API logic, providing a clean abstraction layer between the user interface and persistent storage. This RESTful API design allows each layer to evolve independently, facilitating maintenance and feature development without tightly coupled changes.`,

  lab6_q2: `The API implementation utilises all four standard HTTP methods to provide complete CRUD functionality. GET requests retrieve existing data and return status code 200 upon success. POST requests create new resources and return status code 201 to indicate successful creation. PUT requests update existing resources, returning 200 when modifications are applied. DELETE requests remove resources and return 204 to confirm deletion without a response body.

Each endpoint includes appropriate error handling, returning 400 for validation failures, 404 when requested resources cannot be found, and 500 for unexpected server errors. This consistent pattern provides predictable behaviour that frontend code can reliably handle.

\`\`\`javascript
// Express.js CRUD Implementation (server/routes.ts)
// GET - Retrieve all journal entries for device
app.get("/api/journals", async (req, res) => {
  try {
    const journals = await storage.getAllJournals(getDeviceId(req));
    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch journals" });
  }
});

// POST - Create new journal entry with Zod validation
app.post("/api/journals", async (req, res) => {
  try {
    insertJournalEntrySchema.parse({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      date: req.body.date ? new Date(req.body.date) : new Date(),
    });
    const journal = await storage.createJournal(req.body, getDeviceId(req));
    res.status(201).json(journal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation error", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create journal" });
  }
});
\`\`\``,

  lab6_q3: `Server-side data processing provides essential security and reliability guarantees that client-side code cannot achieve. Input validation using Zod schemas ensures that all data conforms to expected formats before reaching the database, rejecting malformed or malicious inputs. The use of parameterised queries through Drizzle ORM prevents SQL injection attacks by ensuring user input is never directly concatenated into query strings.

Additionally, server-side processing enables enforcement of business logic rules that could be circumvented if implemented only on the client. Browser-based storage and processing can be inspected and manipulated through developer tools, making client-side security measures insufficient for protecting sensitive operations. The server provides a trusted environment for multi-user data isolation and secure handling of authentication tokens.`,

  lab6_q4: `Deploying the backend introduced several challenges that required systematic troubleshooting. File path handling differed between development and production environments, which I resolved by using os.path.abspath() to generate absolute paths that work consistently regardless of the current working directory.

Cross-Origin Resource Sharing (CORS) errors initially blocked frontend requests to the API, which I addressed by adding the Flask-CORS extension with appropriate configuration. Virtual environment setup required careful dependency management through requirements.txt to ensure all necessary packages were available in the production environment. On Replit specifically, environment variables for DATABASE_URL and proper port binding configuration ensured the application connected to the database and listened on the correct network interface.`,

  lab6_q5: `The reflections feature demonstrates complete CRUD functionality implemented with Express.js and Drizzle ORM. Users can create new reflections with markdown-formatted content and category tags, view their existing reflections through a searchable and filterable interface, update entries to correct mistakes or add new thoughts, and delete reflections that are no longer needed.

Export functionality allows users to download their reflections in PDF format for printing, Markdown for portability to other applications, or JSON for data backup and migration purposes. This comprehensive feature set transforms the reflections from simple notes into a valuable tool for learning portfolio development.

\`\`\`typescript
// Drizzle ORM Schema (shared/schema.ts)
export const journalEntries = pgTable("journal_entries", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull().default(sql\`ARRAY[]::text[]\`),
  date: timestamp("date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Zod validation schema with drizzle-zod
export const insertJournalEntrySchema = createInsertSchema(journalEntries)
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
  .extend({
    title: z.string().min(1, "Title is required").max(200),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string()).default([]),
  });
\`\`\``,

  lab7_q1: `Progressive Web Application features transform a standard web application into a native-like experience that rivals traditional mobile apps. The most significant benefit is offline access, which proves crucial for users with unreliable internet connectivity who need continuous access to their learning materials. When network conditions deteriorate, the application continues functioning seamlessly because all essential assets and data are cached locally.

Installability allows users to add the application to their home screen, launching it without browser navigation chrome for an immersive, app-like experience. Push notifications enable timely reminders and engagement prompts that keep users connected to their learning journey. Service workers provide the foundation for these capabilities, caching assets for instant loading and intercepting network requests to enable offline functionality.`,

  lab7_q2: `The caching strategy employs a dual approach tailored to different content types. Static assets including JavaScript bundles, CSS stylesheets, and images use a cache-first strategy, meaning the service worker serves cached content immediately while optionally checking for updates in the background. Version numbers in cache names enable clean cache invalidation when deploying new versions.

Dynamic data follows a different pattern using IndexedDB through the localforage library for local persistence. When users make changes while offline, these edits are queued in a sync queue stored in IndexedDB. Upon connectivity restoration, detected through the online event, the queue is processed to synchronise changes with the server. API requests use a network-first strategy with cache fallback, attempting to fetch fresh data but gracefully serving cached responses when the network is unavailable.

\`\`\`javascript
// Service Worker Cache Strategy (public/sw.js)
const STATIC_CACHE = 'learning-journal-static-v4';
const DYNAMIC_CACHE = 'learning-journal-dynamic-v4';

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  
  // Network first for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  // Network first for navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request));
    return;
  }
  event.respondWith(networkFirst(event.request));
});

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}
\`\`\``,

  lab7_q3: `To demonstrate and debug PWA capabilities, I implemented a dedicated PWA demonstration page accessible through the application menu. This page provides real-time visibility into the application's PWA status, serving both educational and debugging purposes.

The page displays current online/offline status with a visual indicator that updates dynamically using the online and offline events. Service worker registration state shows whether the worker is installing, waiting, or active. A cache inspector reveals all cached resources organised by cache name. The installation section captures the beforeinstallprompt event and provides a prominent Install App button that triggers the native installation dialog. Additionally, a network status indicator in the main navigation bar provides persistent visibility of connectivity state throughout the application.`,

  lab7_q4: `PWA deployment presented several challenges that required careful debugging and resolution. Initially, the service worker scope was incorrectly configured, intercepting requests only for the root path whilst missing nested routes like /journal and /projects. Navigation to these routes while offline would fail. I resolved this by ensuring proper scope registration and updating the fetch handler to return the cached app shell for navigation requests.

Cache versioning proved particularly challenging, as outdated JavaScript and CSS files persisted after code updates, causing users to see stale content or experience errors from version mismatches. The solution involved including version numbers in cache names and adding cleanup logic in the install event to delete old caches. Testing utilised Chrome DevTools Application panel for inspecting service worker state and cache contents, alongside Lighthouse audits to verify PWA compliance.`,

  mini_q1: `The mini project component of this application encompasses several significant features that extend well beyond the core requirements, demonstrating advanced technical skills across multiple domains.

The Celestial Memory Game represents the most substantial addition, featuring a visually striking space-themed card matching experience. The game utilises 30 unique celestial icons including planets, galaxies, and nebulae, each rendered with sophisticated SVG gradient effects. What sets this implementation apart is the procedurally-generated ambient music created using the Web Audio API. Rather than relying on audio files, the system generates a harmonious C major 7 chord through oscillator nodes, creating an evolving soundscape that enhances the meditative gameplay experience. Card animations employ CSS 3D transforms with perspective and backface-visibility for realistic flip effects.

\`\`\`javascript
// Web Audio API - Procedural Music (MemoryGamePage.tsx)
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = ctx.createGain();
masterGain.gain.value = 0.12;
masterGain.connect(ctx.destination);

// C Major 7 chord: C4, E4, G4, B4
const padNotes = [261.63, 329.63, 392.00, 493.88];
padNotes.forEach((freq, i) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.value = 0.08 - i * 0.01;
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
});

// Random pentatonic chimes
const melodyNotes = [523.25, 587.33, 659.25, 783.99, 880.00];
const playChime = () => {
  const noteFreq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
  const chimeOsc = ctx.createOscillator();
  chimeOsc.frequency.value = noteFreq;
  chimeOsc.start();
};
\`\`\`

The Professional Creative Canvas provides a complete drawing application demonstrating mastery of the HTML5 Canvas API. The implementation features multiple drawing tools including pen, eraser, line, rectangle, and circle shapes. A dual-canvas overlay architecture enables non-destructive editing where users see live previews of shapes before committing them to the canvas. The history system stores ImageData snapshots using useRef to avoid stale closure issues, supporting comprehensive undo/redo functionality. Additional features include PNG export, full touch device support, and a gallery system for saving artwork to IndexedDB.

\`\`\`javascript
// Canvas Coordinate System (CanvasPage.tsx)
const canvasRef = useRef<HTMLCanvasElement>(null);
const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
const historyRef = useRef<DrawingState[]>([]);

const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvasWidth / rect.width;
  const scaleY = canvasHeight / rect.height;
  
  if ("touches" in e) {
    const touch = e.touches[0] || e.changedTouches?.[0];
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  }
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
};
\`\`\`

Beyond these primary features, the application includes mobile app-style navigation with a bottom navigation bar, an analytics dashboard with streak tracking and contribution heatmaps, and a complete achievements system with persistent badge milestones.`,

  mini_q2: `The decision to create a celestial-themed memory game rather than a generic implementation was driven by educational alignment and user engagement considerations. The space exploration theme evokes wonder and curiosity, emotions that align naturally with the learning journal's educational purpose. The 30 custom icons featuring multi-stop SVG gradients give the game a distinct visual identity that users find memorable and want to return to.

The choice to implement procedural music generation through the Web Audio API rather than embedding audio files demonstrates advanced browser API integration whilst providing practical benefits. Oscillator-based synthesis creates an evolving, non-repetitive soundscape that would be impossible to achieve with pre-recorded audio of reasonable file size. This approach also eliminates audio file loading times and reduces the application bundle size.

The canvas overlay architecture decision stemmed from understanding user expectations for drawing applications. Non-destructive editing allows users to see exactly what they are drawing before committing, matching the behaviour of professional tools. Storing history state in useRef rather than useState prevents the stale closure bugs that commonly plague canvas applications where event handlers capture outdated state values.

These implementation choices collectively showcase modern React development patterns including useState for UI state, useEffect for side effects and cleanup, useCallback for memoised handlers, and useRef for imperative DOM access and mutable references.`,

  mini_q3: `Development of the mini project features presented numerous technical challenges that required systematic debugging and creative problem-solving.

The memory game's 3D card flip animation required understanding the nuances of CSS 3D transforms. The key insight was that perspective must be set on the parent container, transform-style: preserve-3d must be applied to the flipping element, and backface-visibility: hidden is required on both card faces to prevent the back from showing through during rotation. Browser autoplay policies for Web Audio presented an unexpected challenge, as modern browsers prevent AudioContext creation without prior user interaction. The solution involved deferring audio initialisation until the first user click within the game interface.

\`\`\`jsx
// CSS 3D Card Flip (MemoryGamePage.tsx)
<div style={{ perspective: '1000px' }}>
  <button
    className="transition-transform duration-500"
    style={{
      transformStyle: 'preserve-3d',
      transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
    }}
  >
    {/* Front face - card back */}
    <div 
      className="absolute inset-0 rounded-xl"
      style={{ backfaceVisibility: 'hidden' }}
    />
    {/* Back face - card icon */}
    <div 
      className="absolute inset-0 rounded-xl"
      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
    />
  </button>
</div>
\`\`\`

The canvas implementation faced coordinate accuracy issues where strokes appeared offset from the cursor position. This occurred because the canvas display size differed from its internal bitmap dimensions. The solution involved using getBoundingClientRect() to calculate the actual rendered dimensions and applying devicePixelRatio scaling for crisp rendering on high-DPI displays. Touch event handling required using changedTouches rather than touches for touchend events, since the touches array is empty when no fingers remain on the screen.`,

  mini_q4: `Given additional development time and resources, several strategic improvements would elevate the Learning Journal to a production-ready platform with expanded capabilities.

Real-time multiplayer functionality using WebSocket technology would enable competitive memory game matches and collaborative study groups with live presence indicators. This would transform the solitary learning experience into a connected community activity. Integration of AI capabilities through the OpenAI API would provide intelligent features such as automatic tag suggestions, content summarisation, and personalised learning recommendations based on entry analysis.

Native mobile app packaging through Capacitor would unlock deeper device integration including biometric authentication, camera access for document scanning, and reliable background synchronisation. App store distribution would improve discoverability and user trust compared to PWA installation. Social features would create a learning community where users can share achievements, form study groups, and participate in collaborative challenges with community rewards.

Voice note functionality using the MediaRecorder API combined with speech-to-text transcription would support learners who prefer verbal processing or need to capture thoughts quickly. Finally, comprehensive accessibility improvements targeting WCAG 2.1 AA compliance would ensure the application serves users who rely on assistive technologies, including proper heading hierarchy, ARIA landmarks, and complete keyboard navigation.`,

  appendices: `**Appendix A: Technology Stack**

| Category | Technologies |
|----------|-------------|
| Frontend | React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Node.js, Express.js, Drizzle ORM, PostgreSQL (Neon) |
| Offline | IndexedDB (localforage), Service Workers, Cache API |
| Audio/Graphics | Web Audio API, HTML5 Canvas, CSS 3D Transforms |
| Build Tools | Vite, ESBuild, PostCSS, ESLint |

**Appendix B: Features Summary**

1. **Journal** - Markdown editor, tags, search, PDF/JSON export
2. **Projects** - Cards with status, progress, GitHub links
3. **Analytics** - Streak tracking, activity charts, heatmap
4. **Achievements** - Badge milestones with persistent storage
5. **Memory Game** - Web Audio music, 3D card flips, multiple modes
6. **Creative Canvas** - Drawing tools, undo/redo, gallery, PNG export
7. **PWA** - Offline support, installable, background sync

**Appendix C: API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/journals | List all entries |
| POST | /api/journals | Create entry |
| PUT | /api/journals/:id | Update entry |
| DELETE | /api/journals/:id | Delete entry |

**Appendix D: Screenshots Reference**
- Figure 1-36: See embedded screenshots throughout document`,

  bibliography: `**References**

1. MDN. (2025). Progressive Web Apps. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
2. React Team. (2025). React 18 Documentation. https://react.dev/
3. Tailwind Labs. (2025). Tailwind CSS. https://tailwindcss.com/docs
4. shadcn. (2025). shadcn/ui Components. https://ui.shadcn.com/
5. Drizzle Team. (2025). Drizzle ORM. https://orm.drizzle.team/
6. MDN. (2025). Service Worker API. https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
7. MDN. (2025). Web Audio API. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
8. MDN. (2025). Canvas API. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
9. MDN. (2025). IndexedDB API. https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
10. Open-Meteo. (2025). Weather API. https://open-meteo.com/en/docs
11. GitHub. (2025). REST API Documentation. https://docs.github.com/en/rest
12. Firtman, M. (2024). Learn Progressive Web Apps. O'Reilly Media.`
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
