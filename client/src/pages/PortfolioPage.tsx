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
  
  introduction: `This portfolio documents the development of my Learning Journal Progressive Web Application (PWA) for the FGCT6021 Mobile Application Development module. The project demonstrates a full-stack web application built with modern technologies including React, TypeScript, Express.js, and PostgreSQL, featuring offline-first architecture and PWA capabilities.

The main objectives of this project were to create a functional learning journal that allows users to track their learning progress, document projects, and reflect on their development journey. The application supports offline functionality through service workers and IndexedDB, ensuring users can access their data without an internet connection.

Throughout this project, I developed skills in frontend development with React and Tailwind CSS, backend API design with Express.js, database management with Drizzle ORM and PostgreSQL, and PWA implementation including service workers and manifest configuration. Key challenges included implementing offline data synchronization, creating an intuitive user interface, and integrating multiple APIs for enhanced functionality.

This portfolio reflects on each lab's learning outcomes and documents the mini project extension - a Memory Match card game that demonstrates JavaScript skills and interactive UI design.`,

  lab1: `In Lab 1, I set up the foundational development environment for the Learning Journal PWA. I began by creating a GitHub repository to manage version control, ensuring all code changes were tracked with meaningful commit messages. Using VS Code as my primary IDE, I configured essential extensions including ESLint, Prettier, and the TypeScript compiler for improved code quality.

I explored PythonAnywhere as a potential deployment platform, understanding how to host Flask applications and serve static files. While my final deployment uses a different approach, this experience was valuable for understanding web hosting concepts.

For Android development exploration, I installed Android Studio and examined how PWAs can be packaged as Android applications using Trusted Web Activities (TWA). I ran sample Kotlin code to understand the basics of native Android development and how it compares to web-based approaches.

The PWA concepts I learned included understanding the role of manifest files for installability, service workers for offline caching, and the app shell architecture pattern. These concepts formed the foundation for later labs where I implemented these features in my Learning Journal.

Challenges I faced included configuring Git credentials correctly and understanding the relationship between local development and remote repositories. I resolved these by carefully reading documentation and using SSH keys for authentication.

GitHub Repository: [Your GitHub Link]
Live Project: [Your PythonAnywhere Link]`,

  lab2_q1: `I approached mobile-first design by starting with the smallest viewport and progressively enhancing for larger screens. Using Tailwind CSS, I implemented responsive breakpoints (sm, md, lg, xl) to adjust layouts. For example, the navigation uses a horizontal scroll on mobile and a full navbar on desktop. Cards stack vertically on mobile but display in grids on larger screens. I ensured touch targets were at least 44px for accessibility and used flexible layouts with Flexbox and CSS Grid to adapt content to any screen size.`,

  lab2_q2: `The most useful CSS concept was Flexbox combined with CSS Grid for creating responsive layouts. Flexbox allowed me to easily center content, distribute space between elements, and create flexible navigation bars. I used "flex-wrap" to handle overflow gracefully on smaller screens. For the dashboard layout, CSS Grid enabled me to create complex multi-column layouts that automatically adjust. The combination of "gap" property with Flexbox simplified spacing between elements without complex margin calculations.`,

  lab2_q3: `The most challenging aspect was achieving consistent styling across different browsers and understanding CSS specificity. Initially, I struggled with z-index stacking contexts, especially for sticky headers and modal overlays. I also found it confusing to manage responsive images that maintain aspect ratios while fitting their containers. I overcame these challenges by using Tailwind's utility classes which abstract away browser inconsistencies, and by carefully planning my component hierarchy to avoid z-index conflicts.`,

  lab3_q1: `I primarily used document.getElementById() for accessing unique elements like the theme toggle button and date display, as it provides fast, direct access to specific elements. For collections of similar elements, I used document.querySelectorAll() which returns a NodeList that I could iterate over using forEach(). I also used querySelector() for CSS selector-based selection when I needed more complex targeting. These methods were chosen for their clarity and efficiency - getElementById for unique elements, querySelectorAll for multiple elements with shared characteristics.`,

  lab3_q2: `The most challenging part was managing event listeners and ensuring they were properly attached after DOM elements were rendered. Initially, my JavaScript ran before the HTML loaded, causing null reference errors. I solved this by either placing scripts at the end of the body or using DOMContentLoaded event listeners. Another challenge was understanding event propagation (bubbling and capturing) when implementing click handlers on nested elements. I used event.stopPropagation() and event delegation patterns to handle these scenarios correctly.`,

  lab3_q3: `I tested my JavaScript code using browser developer tools, primarily the Console tab for logging values and checking for errors. I used console.log() extensively to track variable values and execution flow. For debugging, I set breakpoints in the Sources tab to step through code line by line. I also used try-catch blocks to handle potential errors gracefully and display meaningful error messages. Chrome DevTools' network tab helped me verify API calls were working correctly, while the Elements tab confirmed DOM manipulations were applied as expected.`,

  lab4_q1: `For Storage APIs, I chose IndexedDB via the localforage library for persistent offline storage of journal entries and projects. I also used localStorage for simple key-value pairs like user preferences and theme settings. For Browser APIs, I integrated the Clipboard API for copy-to-clipboard functionality, the Notifications API for reminders and alerts, and the Geolocation API to record location data with entries. For Third-Party APIs, I integrated the Open-Meteo Weather API (no key required), the GitHub API for displaying user profiles, and experimented with news APIs for tech updates.`,

  lab4_q2: `Each API integration involved DOM manipulation to display results. For the Weather API, I fetched data using the Fetch API, parsed the JSON response, and dynamically created elements to display temperature, humidity, and weather icons. The GitHub API integration updates user profile cards by populating img src attributes for avatars and textContent for stats. Clipboard API integration attached event listeners to copy buttons that write text to the clipboard and update button states. I used loading spinners and skeleton states while data was being fetched.`,

  lab4_q3: `The main challenges were handling API errors gracefully and managing asynchronous operations. Network failures could crash the app, so I implemented try-catch blocks with user-friendly error messages. CORS issues arose with some APIs, which I resolved by either using CORS proxies or finding APIs with permissive headers. Rate limiting on the GitHub API required caching responses in localStorage. For geolocation, I handled permission denials by showing alternative content and explaining why location access enhances the experience.`,

  lab4_q4: `These APIs significantly improved my PWA by enabling offline functionality, personalization, and real-time data. IndexedDB allows users to create and view journal entries offline, syncing when connectivity returns. The Weather API adds contextual information to entries, showing what the weather was like during study sessions. Notifications keep users engaged with study reminders. The GitHub API creates a connected experience by displaying the user's coding activity. Together, these APIs transform a simple journal into a comprehensive learning companion.`,

  lab5_q1: `JSON file storage differs from browser storage in several key ways. JSON files are stored on the server, making data accessible across different devices and browsers, whereas localStorage/IndexedDB are client-side and device-specific. JSON files can be easily backed up, version-controlled with Git, and shared between users. However, browser storage is faster for read/write operations since it doesn't require network requests. JSON files require server-side processing to modify, while browser storage can be manipulated directly by JavaScript. For my PWA, I use both: browser storage for offline access and JSON for server-side persistence.`,

  lab5_q2: `I created a Python script that manages the JSON file using the json module. The script reads the existing JSON file, parses it into a Python dictionary, modifies the data (adding, updating, or deleting entries), then writes the updated dictionary back to the file. I used Flask routes to expose these operations as API endpoints. For example, a POST request triggers the script to append a new reflection to the JSON array, assign it an auto-incremented ID, and save the file. Error handling ensures the file is properly closed even if an exception occurs.`,

  lab5_q3: `Locally, my PWA shows data from both IndexedDB (for offline-first access) and the server API (for synced data). Users see their locally-cached entries immediately, with updates fetched from the server when online. On GitHub Pages, users would see only the static JSON file content at the time of deployment - it cannot be dynamically updated. This is because GitHub Pages serves static files only; there's no server to process write requests. For dynamic functionality, I deploy to PythonAnywhere where Flask can handle read/write operations to the JSON file.`,

  lab5_q4: `I added a reflections feature that allows users to write daily learning reflections categorized by topic. These reflections are stored in a JSON file and can be filtered, searched, and exported. The JSON structure includes ID, author name, reflection text, category, and timestamp. This feature complements the main journal by providing a quick-capture option for brief thoughts and insights. Users can review their reflections over time to identify learning patterns and track their progress across different subjects.`,

  lab6_q1: `The frontend-backend connection is essential because it separates concerns and enables data persistence. The frontend handles user interface and user experience, while the backend manages data storage, business logic, and security. This separation allows the frontend to be a lightweight PWA that works offline, while the backend ensures data is safely stored and synchronized. Without a backend, all data would be lost when browser storage is cleared. The connection also enables features like user authentication, data validation, and serving different data to different users.`,

  lab6_q2: `I used four HTTP methods in my Flask backend: GET retrieves data (fetching all reflections or a specific one by ID), POST creates new records (adding a new reflection with validation), PUT updates existing records (modifying a reflection's content or category), and DELETE removes records. I chose these methods following REST conventions for clarity and predictability. GET is idempotent and safe for data retrieval, POST for creation, PUT for full updates, and DELETE for removal. Each endpoint returns appropriate status codes (200, 201, 404, 500) to indicate success or failure.`,

  lab6_q3: `Using Flask to handle JSON data provides server-side security, validation, and persistence that browser-based reading cannot offer. Flask can validate data before saving, prevent malicious input, and maintain data integrity across sessions. Reading JSON directly in the browser exposes the entire file to users and cannot prevent tampering. Flask also enables multi-user scenarios where each user's data is kept separate. However, browser-based JSON reading is faster for read-only data that doesn't need protection, making it suitable for static configuration files or public data.`,

  lab6_q4: `On PythonAnywhere, I initially faced issues with file paths - the working directory was different from local development. I resolved this by using os.path.abspath() to construct absolute paths to my JSON files. Another challenge was CORS errors when my frontend tried to access the Flask API from a different domain. I added Flask-CORS and configured it to allow requests from my frontend URL. I also had to ensure the virtual environment had all required packages installed using pip. The web app configuration required specifying the correct WSGI file path.`,

  lab6_q5: `I built a full CRUD (Create, Read, Update, Delete) management system for learning reflections with Flask. This feature allows users to write reflections, categorize them by topic, edit existing entries, and delete unwanted ones. I added this because a complete journal needs all CRUD operations - not just creating entries. The search functionality filters reflections by content, making it easy to find past thoughts on specific topics. I also added data export to JSON format, allowing users to backup their reflections or migrate to another platform.`,

  lab7_q1: `Enhancing a Flask app with PWA features provides significant benefits: offline access, installability, and app-like experience. Users can continue accessing their journal entries even without internet connectivity - crucial for students who may study in areas with poor connectivity. The install-to-home-screen feature makes the app feel native and easily accessible without opening a browser. Push notifications can remind users to write journal entries. Service workers improve performance by caching assets and API responses, reducing load times on repeat visits.`,

  lab7_q2: `For offline access, I implemented a service worker that caches static assets (HTML, CSS, JavaScript, images) using a cache-first strategy. For dynamic data, I use IndexedDB via the localforage library to store journal entries and projects locally. When offline, the app reads from IndexedDB; when online, it syncs with the server. I implemented a sync queue that tracks changes made offline and pushes them to the server when connectivity returns. The service worker also implements a network-first strategy for API calls, falling back to cached responses when the network fails.`,

  lab7_q3: `I added a comprehensive PWA demo page that showcases all PWA features in one place. Users can check their online/offline status, view service worker registration status, see cached resources, trigger the install prompt, and test offline functionality. I also added a visual indicator in the navbar showing connection status. This feature helps users understand and appreciate the PWA capabilities, and serves as a debugging tool during development. The demo includes buttons to manually trigger cache updates and view cache contents.`,

  lab7_q4: `The main deployment challenge was ensuring the service worker scope was correctly configured. Initially, the service worker only cached the root path, missing nested routes. I fixed this by adjusting the scope in the registration call and updating the service worker's fetch event to handle all routes. Another challenge was cache versioning - old cached files persisted after updates. I implemented cache busting by including version numbers in cache names and adding logic to delete outdated caches on activation. Testing offline mode required using Chrome DevTools' offline simulation.`,

  mini_q1: `I added several significant features to enhance the Learning Journal beyond the core requirements:

1. **Celestial Memory Game**: A visually stunning space-themed card matching game with extensive features including 30 beautiful celestial icons with 3-color gradient effects, ambient background music using Web Audio API with C major 7 chord foundation and gentle random chimes, constellation quest system with power-ups, wild comet cards that match anything, four unlockable themes (Cosmic Night, Aurora Borealis, Pink Nebula, Solar Flare), three game modes (Zen, Challenge, Constellation Quest), and stunning visual effects like 3D card flips, particle explosions, and animated starfield backgrounds.

2. **Professional Creative Canvas**: A complete drawing application featuring multiple drawing tools (pen, eraser, line, rectangle, circle, fill), live shape preview with overlay canvas architecture, color system with 10 presets plus custom picker, adjustable brush sizes (1-50px), history system with undo/redo (up to 50 states), gallery system for saving/loading artwork, PNG export functionality, and full mobile/tablet touch support.

3. **Mobile App Navigation System**: Complete app-like navigation with bottom navigation bar (mobile-style tabs), organized menu page with feature categories, options page for user preferences, settings page for system controls, and explore page for feature discovery.

4. **Analytics Dashboard**: Comprehensive analytics with learning streaks, weekly trends using Recharts, tag clouds, and GitHub-style activity heatmaps.

5. **Achievements System**: Gamification with badges for milestones, progress tracking, and persistent achievement storage.

6. **Enhanced Journal Features**: Rich markdown editor, tag management, search/filter, and PDF export.

7. **PWA Enhancements**: Offline support, install prompts, network status indicators, and service worker management.`,

  mini_q2: `I chose to create a comprehensive mini project with multiple components for several strategic reasons:

**Celestial Memory Game - Unique Theme and Identity**: Rather than a generic memory game, I created a cohesive "space exploration" experience with 30 beautiful celestial icons featuring 3-color gradients. The space theme gives the game a distinct identity that makes it memorable and engaging.

**Ambient Audio Experience**: Implemented Web Audio API to generate sweet melodic background music using a C major 7 chord foundation (C4, E4, G4, B4) with gentle random chimes every 2 seconds. This demonstrates advanced browser API integration.

**Visual Polish and Premium Feel**: Glassmorphism effects (frosted glass cards, backdrop blur), animated starfield backgrounds, 3D card flip animations, and particle effects on matches create a premium, polished experience that goes beyond basic requirements.

**Professional Canvas Tool**: Built a complete drawing application demonstrating Canvas API mastery with multiple tools, overlay canvas architecture for non-destructive shape preview, history management using useRef, and touch event handling for mobile devices.

**Mobile App Navigation System**: Designed complete app-like navigation with bottom navigation bar, organized menu, and settings pages to showcase modern app design patterns.

**Advanced React Patterns**: The project showcases useState for complex state, useEffect for timers and audio, useCallback for memoized functions, useRef for DOM access and state tracking, and functional state updates to avoid stale closures.`,

  mini_q3: `I faced several technical challenges during development:

**CELESTIAL MEMORY GAME CHALLENGES:**

**3D Card Flip Animation**: Creating convincing 3D card flips required CSS 3D transforms with perspective, transform-style: preserve-3d, and backface-visibility. I had to carefully position both front and back faces and rotate them correctly.

**Web Audio API Music Generation**: Implementing ambient background music required understanding oscillators, gain nodes, and audio scheduling. I created a C major 7 chord using multiple oscillators tuned to C4, E4, G4, B4 frequencies with gentle random chimes played at intervals.

**Achievement Persistence with Stale Closures**: Initially, achievements weren't saving correctly because state updates used stale closure values. I fixed this by using functional state updates (setAchievements(prev => ...)) and passing updatedCards directly to achievement checks instead of relying on state.

**CREATIVE CANVAS CHALLENGES:**

**Canvas Coordinate Scaling**: Drawing coordinates were incorrect because the canvas display size differed from its logical size. I implemented coordinate scaling using getBoundingClientRect() to calculate scaleX and scaleY ratios.

**Overlay Canvas for Live Preview**: Shape tools needed to show the shape while dragging before committing. I implemented a transparent overlay canvas that renders the preview and clears on mouse up while the final shape is drawn on the main canvas.

**Undo/Redo with Refs**: The history system initially failed because saveToHistory and restoreFromHistory used stale state from closures. I solved this by storing history in useRef and syncing with useEffect.

**Touch Event Handling**: Mobile drawing crashed because touchend has empty touches array. I fixed this by using e.changedTouches as fallback.`,

  mini_q4: `Given more time, I would implement these improvements:

**Multiplayer Features**: Add real-time multiplayer modes where users can compete in puzzle challenges or collaborate on learning goals. This would require WebSocket integration for live updates.

**AI-Powered Features**: Integrate AI to provide personalized learning recommendations based on journal entry analysis, suggest related topics, or summarize weekly progress automatically.

**Mobile App Packaging**: Create native Android and iOS apps using Capacitor or React Native, providing better device integration including native notifications, camera access for photo journals, and better offline sync.

**Social Features**: Enable users to share achievements, follow other learners, and create study groups within the app. This would transform the personal journal into a learning community.

**Advanced Analytics**: Implement machine learning to identify learning patterns, predict optimal study times, and track skill progression over time with more sophisticated visualizations.

**Voice Notes**: Add audio recording capabilities for voice journal entries, with speech-to-text transcription for searchability.

**Accessibility Improvements**: Conduct thorough accessibility auditing and implement WCAG 2.1 AA compliance, including screen reader optimization and keyboard navigation enhancements.`,

  appendices: `**Appendix A: Technology Stack**
- Frontend: React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- Backend: Node.js, Express.js, Drizzle ORM
- Database: PostgreSQL (Neon), IndexedDB (localforage)
- PWA: Service Workers, Web App Manifest, Workbox
- Audio: Web Audio API for dynamic music generation
- Graphics: HTML5 Canvas API with overlay architecture
- Build Tools: Vite, ESBuild

**Appendix B: Key Features Summary**
1. Journal Entries with Markdown support
2. Project Tracking with tech stack tags
3. Analytics Dashboard with visualizations
4. Achievements and Gamification System
5. Celestial Memory Game with:
   - 30 celestial icons with gradient effects
   - Ambient background music (Web Audio API)
   - Constellation quest system with power-ups
   - Multiple game modes and unlockable themes
   - Endless mode with progressive difficulty
6. Professional Creative Canvas with:
   - Drawing tools (pen, eraser, line, rectangle, circle, fill)
   - Live shape preview with overlay canvas
   - Gallery system and PNG export
   - Full mobile/touch support
7. Mobile App Navigation:
   - Bottom navigation bar for mobile devices
   - Menu, Options, Settings, Explore pages
8. Offline-first Architecture
9. PWA Installability

**Appendix C: API Endpoints**
- GET/POST /api/journals - Journal CRUD
- GET/POST /api/projects - Project CRUD
- GET/POST /api/lab6-reflections - Reflection CRUD
- GET/PUT /api/profile - User profile

**Appendix D: Screenshots**
[Include screenshots of: Home Dashboard with Quick Actions, Bottom Navigation Bar, Menu Page, Celestial Memory Game with Music Toggle, Creative Canvas with Tools, Settings Page, Explore Page, PWA Install Process]`,

  bibliography: `1. Mozilla Developer Network (MDN). (2024). Progressive Web Apps. https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps

2. React Documentation. (2024). React 18 Documentation. https://react.dev/

3. Tailwind CSS. (2024). Tailwind CSS Documentation. https://tailwindcss.com/docs

4. shadcn/ui. (2024). UI Component Library. https://ui.shadcn.com/

5. Drizzle ORM. (2024). TypeScript ORM Documentation. https://orm.drizzle.team/

6. Workbox. (2024). Service Worker Libraries. https://developers.google.com/web/tools/workbox

7. Open-Meteo. (2024). Free Weather API Documentation. https://open-meteo.com/en/docs

8. GitHub REST API. (2024). GitHub API Documentation. https://docs.github.com/en/rest

9. localforage. (2024). Offline Storage Library. https://localforage.github.io/localForage/

10. Recharts. (2024). React Charting Library. https://recharts.org/

11. jsPDF. (2024). PDF Generation Library. https://github.com/parallax/jsPDF

12. Vite. (2024). Next Generation Frontend Tooling. https://vitejs.dev/

13. Web Audio API. (2024). Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

14. Canvas API. (2024). Mozilla Developer Network. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API`
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
      className="w-full flex items-center justify-between gap-2 p-4 text-left hover-elevate rounded-t-lg border-b"
      data-testid={`button-section-${id}`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h3 className="text-base font-semibold">{title}</h3>
        {wordCount && <WordCountBadge {...wordCount} />}
      </div>
      {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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
      <div className="flex flex-col lg:flex-row">
        <aside className="hidden lg:block w-64 shrink-0 border-r bg-card/50 h-screen sticky top-0 overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Portfolio Contents</h2>
            <p className="text-xs text-muted-foreground mt-1">FGCT6021 Mobile Application Development</p>
          </div>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <nav className="p-2">
              {tocItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md text-left hover-elevate ${
                    activeSection === item.id ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                  data-testid={`toc-${item.id}`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold" data-testid="heading-portfolio">FGCT6021 Portfolio</h1>
                  <p className="text-sm text-muted-foreground">January 2026</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")} variant="outline" size="sm">
                    {viewMode === "edit" ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                    {viewMode === "edit" ? "Preview" : "Edit"}
                  </Button>
                  <Button onClick={saveData} disabled={saving} variant="outline" size="sm" data-testid="button-save-portfolio">
                    {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
                    Save
                  </Button>
                  <Button onClick={generatePDF} disabled={generating} size="sm" data-testid="button-download-pdf">
                    {generating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
                    Download PDF
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button onClick={loadTemplate} variant="ghost" size="sm" data-testid="button-load-template">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Load Template
                </Button>
                <Button onClick={clearAll} variant="ghost" size="sm" data-testid="button-clear-all">
                  Clear All
                </Button>
                <Button onClick={expandAll} variant="ghost" size="sm" data-testid="button-expand-all">
                  Expand All
                </Button>
                <Button onClick={collapseAll} variant="ghost" size="sm" data-testid="button-collapse-all">
                  Collapse All
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
            <Card ref={(el) => { sectionRefs.current.cover = el; }} data-testid="section-cover">
              <SectionHeader id="cover" title="Cover Page & Student Information" expanded={expandedSections.cover} icon={GraduationCap} />
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

            <Card ref={(el) => { sectionRefs.current.intro = el; }} data-testid="section-intro">
              <SectionHeader 
                id="intro" 
                title="1. Introduction" 
                expanded={expandedSections.intro} 
                icon={BookOpen}
                wordCount={{ current: totalIntroWords, min: 100, max: 250 }}
              />
              {expandedSections.intro && (
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Provide an overview of your project, including its purpose and main objectives. Explain the aim of this portfolio and what it documents. 
                    Reflect on your overall experience during the project, highlighting key learning points, skills developed, and any challenges you faced along the way.
                  </p>
                  {viewMode === "edit" ? (
                    <Textarea 
                      value={data.introduction}
                      onChange={(e) => updateField("introduction", e.target.value)}
                      placeholder="Write your introduction here (100-250 words)..."
                      className="min-h-[200px]"
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

            <Card ref={(el) => { sectionRefs.current.lab1 = el; }} data-testid="section-lab1">
              <SectionHeader 
                id="lab1" 
                title="2. Lab 1 – Introduction to Mobile App" 
                expanded={expandedSections.lab1} 
                icon={GraduationCap}
                wordCount={{ current: totalLab1Words, min: 250, max: 400 }}
              />
              {expandedSections.lab1 && (
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Write a short reflection on the steps you have followed using GitHub, VS Code, PythonAnywhere, Android Studio, PWA, and Kotlin code. 
                    You may include screenshots and should describe any challenges you faced while running the code.
                    Include the links to your GitHub repository and your live project on PythonAnywhere.
                  </p>
                  {viewMode === "edit" ? (
                    <Textarea 
                      value={data.lab1}
                      onChange={(e) => updateField("lab1", e.target.value)}
                      placeholder="Write your Lab 1 reflection here (250-400 words)..."
                      className="min-h-[250px]"
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

            <Card ref={(el) => { sectionRefs.current.lab2 = el; }} data-testid="section-lab2">
              <SectionHeader 
                id="lab2" 
                title="3. Lab 2 – Frontend Fundamentals" 
                expanded={expandedSections.lab2} 
                icon={Code}
                wordCount={{ current: totalLab2Words, min: 150, max: 300 }}
              />
              {expandedSections.lab2 && (
                <CardContent className="pt-4 space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Answer each question in 50–100 words (150–300 words total). Include examples, screenshots or code if relevant.
                  </p>
                  
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

            <Card ref={(el) => { sectionRefs.current.lab3 = el; }} data-testid="section-lab3">
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

            <Card ref={(el) => { sectionRefs.current.lab4 = el; }} data-testid="section-lab4">
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

            <Card ref={(el) => { sectionRefs.current.lab5 = el; }} data-testid="section-lab5">
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

            <Card ref={(el) => { sectionRefs.current.lab6 = el; }} data-testid="section-lab6">
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

            <Card ref={(el) => { sectionRefs.current.lab7 = el; }} data-testid="section-lab7">
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

            <Card ref={(el) => { sectionRefs.current.mini = el; }} data-testid="section-mini">
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

            <Card ref={(el) => { sectionRefs.current.appendix = el; }} data-testid="section-appendix">
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

            <Card ref={(el) => { sectionRefs.current.bibliography = el; }} data-testid="section-bibliography">
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
