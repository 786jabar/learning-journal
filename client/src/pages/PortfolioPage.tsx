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
  
  introduction: `This portfolio documents my Learning Journal PWA developed for FGCT6021 Mobile Application Development. The application is built with React, TypeScript, Express.js, and PostgreSQL, featuring offline-first architecture with service workers and IndexedDB.

The project enables users to track learning progress through journal entries, manage projects, and engage with interactive features. Key technical achievements include implementing PWA capabilities for installability and offline access, integrating external APIs (Weather, GitHub), and creating the Celestial Memory Game with Web Audio API.

[See Figure 1: Application Architecture Diagram]
[See Figure 2: Home Dashboard Screenshot]`,

  lab1: `I set up the development environment by creating a GitHub repository for version control with meaningful commit messages. Visual Studio Code was configured with ESLint, Prettier, and TypeScript extensions.

I explored PythonAnywhere for Flask deployment, learning about WSGI configuration and virtual environments. I also installed Android Studio to understand how PWAs can be packaged as native apps using Trusted Web Activities (TWA).

Key PWA concepts mastered include manifest.webmanifest for installability, service workers for offline caching, and the app shell architecture. The main challenge was configuring Git credentials across environments, which I resolved using SSH key authentication.

[See Figure 3: GitHub Repository Setup]
[See Figure 4: VS Code Configuration with Extensions]
[See Figure 5: Service Worker Code - sw.js]

\`\`\`javascript
// Service Worker Registration (index.html)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('SW registered'))
    .catch(err => console.error('SW failed:', err));
}
\`\`\`

GitHub Repository: [Your GitHub Link]
Live Project: [Your PythonAnywhere Link]`,

  lab2_q1: `I used mobile-first design, starting with 320px viewport and progressively enhancing for larger screens. Tailwind CSS breakpoints (sm: 640px, md: 768px, lg: 1024px) adjust layouts dynamically. Navigation uses horizontal scroll on mobile and full navbar on desktop. Cards stack vertically on mobile and display in grids on larger screens.

[See Figure 6: Mobile vs Desktop Layout Comparison]

\`\`\`css
/* Responsive Grid Example */
.card-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}
\`\`\``,

  lab2_q2: `Flexbox and CSS Grid were the most useful concepts. Flexbox handles centering and navigation layouts, while Grid creates the dashboard with auto-fill and minmax() for responsive cards. The gap property simplifies spacing compared to margins.

[See Figure 7: Flexbox Navigation Code]

\`\`\`css
/* Dashboard Grid */
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
\`\`\``,

  lab2_q3: `Z-index stacking contexts were most challenging, especially for sticky headers and modal overlays. Understanding that transform and opacity create new stacking contexts was key. I used Tailwind's utilities to handle browser inconsistencies and the isolation property to contain stacking contexts.

[See Figure 8: Z-index Stacking Solution]`,

  lab3_q1: `I used getElementById() for unique elements like theme toggle buttons (O(1) lookup), querySelectorAll() for collections like cards and form inputs, and querySelector() for CSS selector-based targeting. In React, useRef hooks provide stable DOM references across re-renders.

[See Figure 9: DOM Selection Code]

\`\`\`javascript
// DOM Selection Examples
const themeBtn = document.getElementById('theme-toggle');
const cards = document.querySelectorAll('.entry-card');
const activeBtn = document.querySelector('button[data-active="true"]');
\`\`\``,

  lab3_q2: `Event listener timing was challenging - handlers executed before DOM loaded, causing null errors. I solved this using DOMContentLoaded in vanilla JS and useEffect hooks in React with cleanup functions to prevent memory leaks. Event propagation required stopPropagation() for nested clickable elements.

[See Figure 10: useEffect Event Listener Pattern]

\`\`\`javascript
// React Event Listener Pattern
useEffect(() => {
  const handleClick = (e) => { /* handler */ };
  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []);
\`\`\``,

  lab3_q3: `Chrome DevTools was essential for debugging. I used Console for logging, Sources for breakpoints, Network for API verification, and Application for IndexedDB/service worker inspection. Try-catch blocks provide user-friendly error messages through the toast system.

[See Figure 11: Chrome DevTools Debugging Screenshot]`,

  lab4_q1: `**Storage APIs:** IndexedDB (via localforage) for offline persistence of entries - provides gigabytes capacity vs 5MB for localStorage. LocalStorage for simple preferences.

**Browser APIs:** Clipboard API for copy functionality, Notifications API for reminders, Geolocation API for location context, Web Audio API for game music.

**Third-Party APIs:** Open-Meteo Weather API (free, no key), GitHub REST API for profiles.

[See Figure 12: Weather API Integration Code]

\`\`\`javascript
// Weather API Fetch
const response = await fetch(
  \`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current_weather=true\`
);
const data = await response.json();
\`\`\``,

  lab4_q2: `Weather API uses async/await fetch to get temperature and conditions, displayed with React components. GitHub API populates avatar images and repository counts. Clipboard API uses navigator.clipboard.writeText() with visual feedback. Loading states use skeleton components.

[See Figure 13: API Data Display Components]`,

  lab4_q3: `Main challenges: CORS issues (resolved with proper headers), rate limiting on GitHub API (cached responses in localStorage with expiration), browser autoplay policies for Web Audio (required user interaction to start audio context).

[See Figure 14: Error Handling Pattern]

\`\`\`javascript
try {
  const data = await fetchWeather(lat, lon);
  setWeather(data);
} catch (err) {
  toast({ title: "Weather unavailable", variant: "destructive" });
}
\`\`\``,

  lab4_q4: `APIs transform the PWA: IndexedDB enables full offline CRUD with sync queue, Weather API adds context to entries, Notifications keep users engaged, Web Audio creates the Memory Game soundscape with procedural C major 7 chords.

[See Figure 15: Offline Sync Queue Implementation]`,

  lab5_q1: `JSON files on the server are accessible across devices (phone and laptop share data), while IndexedDB/localStorage are device-specific. JSON can be version-controlled with Git. However, browser storage is faster (milliseconds vs network round-trips). My architecture uses both: IndexedDB for offline speed, server JSON/PostgreSQL for sync.

[See Figure 16: Data Flow Architecture Diagram]`,

  lab5_q2: `Python scripts use json.load() to read, modify the dictionary, then json.dump() to save. Flask endpoints expose these as REST API. POST creates new reflections with auto-incremented IDs and timestamps.

[See Figure 17: Flask API Code]

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

  lab5_q3: `Locally, PWA shows data from IndexedDB instantly, then background-fetches from server to merge updates. On GitHub Pages (static hosting), JSON is frozen at deployment - no server to process writes. Dynamic features require PythonAnywhere, Replit, or similar platforms.

[See Figure 18: Local vs Deployed Comparison]`,

  lab5_q4: `Added reflections feature for quick daily insights with categories, markdown support, and timestamps. Complements main journal with a quick-capture option. Includes search, filtering, and PDF/Markdown export.

[See Figure 19: Reflections Feature Screenshot]`,

  lab6_q1: `Frontend-backend separation enables data persistence across devices, server-side validation, and security. Frontend handles UI/UX, backend manages PostgreSQL storage and API logic. Without a backend, data is lost when browser storage clears. RESTful API design allows independent evolution of each layer.

[See Figure 20: Frontend-Backend Architecture]`,

  lab6_q2: `I use all four HTTP methods: GET for fetching (returns 200), POST for creating (returns 201), PUT for updating (returns 200), DELETE for removing (returns 204). Each returns appropriate status codes for errors (400, 404, 500).

[See Figure 21: Express.js CRUD Routes]

\`\`\`javascript
// Express CRUD Endpoints
app.get('/api/reflections', async (req, res) => {
  const data = await db.select().from(reflections);
  res.json(data);
});
app.post('/api/reflections', async (req, res) => {
  const newEntry = await db.insert(reflections).values(req.body).returning();
  res.status(201).json(newEntry[0]);
});
\`\`\``,

  lab6_q3: `Server-side processing validates data before saving (Zod schemas), prevents SQL injection, and enforces business logic. Browser-based reading can be tampered with via network inspection. Server enables multi-user isolation and secure data handling.

[See Figure 22: Zod Validation Schema]`,

  lab6_q4: `Deployment challenges: file path differences (solved with os.path.abspath()), CORS errors (added Flask-CORS extension), virtual environment setup (pip install -r requirements.txt). On Replit, configured environment variables for DATABASE_URL and proper port binding.

[See Figure 23: CORS Configuration]`,

  lab6_q5: `Built full CRUD for reflections with Express.js and Drizzle ORM. Features: markdown editing, category tagging, search/filtering, and PDF/JSON/Markdown export. Users can correct mistakes, update thoughts, and export for portfolio building.

[See Figure 24: Drizzle ORM Schema]

\`\`\`typescript
// Drizzle Schema
export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});
\`\`\``,

  lab7_q1: `PWA features provide offline access (crucial for poor connectivity), installability (launches without browser chrome), and push notifications for reminders. Service workers cache assets for instant loading. These transform a web app into a native-like experience.

[See Figure 25: PWA Installation Flow]`,

  lab7_q2: `Service worker caches static assets (cache-first strategy) with versioned cache names. IndexedDB (via localforage) stores dynamic data locally. Offline edits queue in sync queue, processed when connectivity returns via 'online' event. API calls use network-first with cache fallback.

[See Figure 26: Service Worker Code]

\`\`\`javascript
// sw.js - Cache Strategy
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('/api/')) {
    e.respondWith(networkFirst(e.request));
  } else {
    e.respondWith(cacheFirst(e.request));
  }
});
\`\`\``,

  lab7_q3: `Added PWA demo page showing: online/offline status indicator, service worker registration state, cache inspector, and "Install App" button capturing beforeinstallprompt event. Network indicator in navbar shows offline status. Useful for debugging and user education.

[See Figure 27: PWA Demo Page Screenshot]`,

  lab7_q4: `Challenges: service worker scope missing nested routes (fixed with proper scope registration), cache versioning causing stale content (added version numbers and skipWaiting()). Tested with Chrome DevTools Application tab and Lighthouse PWA audits.

[See Figure 28: Chrome DevTools Application Panel]`,

  mini_q1: `**1. Celestial Memory Game**
- Space-themed card matching with 30 celestial icons (planets, galaxies, nebulae)
- Web Audio API generates ambient C major 7 chord music with oscillators
- 3D CSS card flip animations using transform-style: preserve-3d
- Three game modes: Zen, Challenge, Constellation Quest

[See Figure 29: Memory Game Screenshot]
[See Figure 30: Web Audio API Code]

\`\`\`javascript
// Web Audio - Create chord
const audioCtx = new AudioContext();
const osc = audioCtx.createOscillator();
osc.frequency.value = 261.63; // C4
osc.connect(audioCtx.destination);
osc.start();
\`\`\`

**2. Professional Creative Canvas**
- Drawing tools: pen, eraser, line, rectangle, circle
- Dual-canvas overlay architecture for live shape preview
- Undo/redo with ImageData snapshots in useRef
- PNG export, touch support, gallery save to IndexedDB

[See Figure 31: Canvas Tool Screenshot]
[See Figure 32: Canvas Code Architecture]

**3. Mobile App Navigation** - Bottom nav bar, menu grid, settings pages

**4. Analytics Dashboard** - Streak tracking, activity charts, contribution heatmap

**5. Achievements System** - Badge milestones with persistent storage`,

  mini_q2: `**Why Celestial Theme:** Space theme evokes wonder and curiosity, aligning with educational purpose. Distinct from generic card games with 30 custom icons featuring SVG gradients.

**Why Web Audio API:** Procedural music (no audio files) demonstrates advanced browser APIs. Oscillators create evolving, non-repetitive soundscape impossible with pre-recorded audio.

**Why Canvas Overlay Architecture:** Non-destructive editing shows shapes before committing. useRef for history avoids stale closure issues common in canvas apps.

**Why React Patterns:** Demonstrates useState, useEffect, useCallback, and useRef - core hooks for professional React development.

[See Figure 33: Technical Architecture Decisions]`,

  mini_q3: `**Memory Game Challenges:**
- 3D card flip required perspective on parent, transform-style: preserve-3d, and backface-visibility: hidden
- Web Audio autoplay policy required user interaction before AudioContext creation
- Stale closures in achievements fixed with functional state updates: setState(prev => {...})

[See Figure 34: CSS 3D Transform Code]

\`\`\`css
/* 3D Card Flip */
.card { transform-style: preserve-3d; perspective: 1000px; }
.card-face { backface-visibility: hidden; }
.card.flipped { transform: rotateY(180deg); }
\`\`\`

**Canvas Challenges:**
- Coordinate offset fixed with getBoundingClientRect() and devicePixelRatio scaling
- Touch events: use changedTouches[0] (not touches[0]) for touchend
- History stored in useRef to avoid stale closures

[See Figure 35: Canvas Coordinate Transformation]`,

  mini_q4: `**Future Improvements:**

1. **Real-Time Multiplayer** - WebSocket-based competitive Memory Game matches, study groups with live presence

2. **AI Features** - Auto-tagging, content summarization, learning recommendations using OpenAI API

3. **Native App Packaging** - Capacitor for iOS/Android with biometric auth and camera integration

4. **Social Features** - Public profiles, study groups, learning challenges with community rewards

5. **Voice Notes** - MediaRecorder API with speech-to-text for audio journal entries

6. **Accessibility** - WCAG 2.1 AA compliance, screen reader testing, keyboard navigation

[See Figure 36: Future Roadmap Diagram]`,

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
