# Lab 7: PWA Features and Service Workers

## Question 1: Service Worker Implementation (200-300 words)

I implemented a comprehensive service worker (sw.js) that intercepts network requests and implements sophisticated caching strategies for offline functionality. The service worker lifecycle begins with the 'install' event where I pre-cache essential app shell resources (HTML, CSS, JavaScript bundles, icons, fonts) using the Cache API, ensuring the application loads instantly on repeat visits. During the 'activate' event, old caches are cleaned up to prevent storage bloat, with cache versioning enabling smooth updates. For fetch event handling, I implemented a cache-first strategy for static assets (returning cached versions immediately for fast performance, updating cache in background), network-first for API calls (ensuring fresh data when online, falling back to cached responses offline), and stale-while-revalidate for semi-dynamic content (serving cached content immediately while fetching updates). The Background Sync API queues failed POST/PUT/DELETE requests when offline, automatically retrying them when connectivity returns. Push notification support enables server-triggered notifications for reminders and updates. The service worker scope is set to '/' to intercept all application requests, with navigation preload enabled for faster page loads.

---

## Question 2: Offline Functionality (200-300 words)

The PWA provides complete offline functionality through a layered caching architecture combining the service worker cache and IndexedDB. When offline, users can view all previously-loaded journal entries, projects, and analytics from IndexedDB - the app appears fully functional. New entries and edits are saved to IndexedDB immediately, providing instant feedback, and simultaneously queued in a sync queue array stored in localStorage. Visual indicators (a subtle offline badge in the header) inform users of their connectivity status without being intrusive. When the network returns, the 'online' event triggers the sync queue processor which iterates through pending operations, sending each to the server API in order. Conflict resolution uses timestamp comparison: if the server's version is newer than the queued change, the user is prompted to choose which version to keep. Successful syncs remove items from the queue and update the local IndexedDB cache with server-confirmed data. The entire process is invisible to users who simply see their changes "just work" regardless of connectivity.

---

## Question 3: PWA Installation Experience (200-300 words)

I optimized the PWA installation experience through a carefully crafted manifest.json (manifest.webmanifest) and user-friendly install prompts. The manifest defines essential metadata: name and short_name for display, start_url for the entry point, display: "standalone" for fullscreen app-like experience without browser chrome, theme_color and background_color for native-feeling splash screens, and a comprehensive icon set (192x192 and 512x512 in PNG format with maskable variants for adaptive icons on Android). The 'beforeinstallprompt' event is captured and deferred, allowing me to display a custom, contextual install button rather than relying on the browser's generic prompt. This custom prompt appears after the user has engaged with the app (e.g., created their first entry), increasing installation likelihood. Installation benefits are clearly communicated: offline access, faster loading, home screen icon, and push notifications. For iOS Safari (which doesn't support beforeinstallprompt), I detect the platform and display instructions for "Add to Home Screen" via the share menu. Post-installation, the 'appinstalled' event triggers analytics and hides the install prompt, while the display-mode media query detects standalone mode for installation-specific UI adjustments.

---

## Question 4: PWA Testing and Debugging (200-300 words)

I employed Chrome DevTools' Application panel extensively for PWA testing and debugging. The Service Workers section displays registration status, allows manual updates and unregistration, and enables offline simulation for testing cache behavior. I used "Update on reload" during development to ensure the latest service worker code was always active. The Cache Storage section shows all cached resources, enabling verification that critical assets are pre-cached and inspection of cache sizes. The Manifest section validates manifest.json parsing, displays installability status with specific error messages for any issues (missing icons, invalid start_url, etc.), and allows testing of the install flow. Lighthouse PWA audits provided comprehensive scoring across installability, PWA-optimized criteria, and best practices, with actionable recommendations for improvement. I tested offline scenarios by toggling "Offline" mode in the Network panel, verifying the app remained functional and displayed appropriate offline indicators. IndexedDB contents were inspected and modified directly in the Storage section for debugging data sync issues. The Console displayed service worker logs, fetch intercepts, and cache operations for tracing request handling. Real-device testing on Android and iOS ensured installation flows, splash screens, and offline behavior worked correctly across platforms.

## Key Topics Covered
- Service worker lifecycle (install, activate, fetch)
- Caching strategies (cache-first, network-first, stale-while-revalidate)
- Background Sync API
- Web App Manifest configuration
- Installation experience optimization
- PWA testing with Chrome DevTools and Lighthouse

## Word Count Target
Each question: 200-300 words
