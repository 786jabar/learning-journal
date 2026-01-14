import { storage } from "./server/storage";

async function seed() {
  const guestId = "guest-fallback";

  console.log("Seeding database with comprehensive lab reflections and projects...");

  try {
    // Comprehensive Lab Reflections
    const journals = [
      {
        title: "Lab 3 Reflection: Mastering DOM Manipulation",
        content: `# Lab 3: DOM Manipulation Deep Dive

## Overview
In Lab 3, I explored the fundamentals of Document Object Model (DOM) manipulation using vanilla JavaScript. This lab was essential for understanding how modern web frameworks like React work under the hood.

## Key Concepts Learned

### 1. Selecting Elements
I learned multiple ways to select DOM elements:
- \`document.getElementById()\` - for unique elements
- \`document.querySelector()\` - CSS selector syntax
- \`document.querySelectorAll()\` - multiple elements

### 2. Modifying Elements
Techniques for changing element properties:
- \`innerHTML\` and \`textContent\` for content
- \`classList.add/remove/toggle\` for styling
- \`setAttribute()\` for attributes

### 3. Event Handling
Understanding user interactions:
- \`addEventListener()\` for attaching handlers
- Event bubbling and capturing
- Event delegation patterns

## Challenges Faced
The biggest challenge was understanding event delegation. Initially, I attached event listeners to each element individually, which was inefficient. Learning to use a single listener on a parent element and checking \`event.target\` was a game-changer.

## Code Example
\`\`\`javascript
// Event delegation example
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('.list-item')) {
    e.target.classList.toggle('completed');
  }
});
\`\`\`

## Reflection
This lab gave me a solid foundation in understanding how the browser renders and updates the page. I now appreciate why frameworks like React use a Virtual DOM - direct DOM manipulation can be slow and error-prone at scale.

## What I Would Do Differently
- Start with event delegation from the beginning
- Use data attributes more for storing state
- Create more reusable functions

## Next Steps
Apply these concepts to build a more complex interactive application in future labs.`,
        tags: ["lab3", "javascript", "dom", "events", "web-development"],
        date: new Date("2025-01-10")
      },
      {
        title: "Lab 4 Reflection: Browser APIs and Third-Party Integration",
        content: `# Lab 4: Exploring Browser APIs

## Overview
Lab 4 was an exciting exploration of various browser APIs and third-party service integration. I learned how modern browsers provide powerful capabilities beyond basic HTML/CSS/JS.

## APIs Explored

### 1. Web Storage APIs
- **localStorage**: Persistent storage across sessions
- **sessionStorage**: Tab-specific temporary storage
- **IndexedDB**: Full database capabilities in the browser

### 2. Geolocation API
Learned to access user's location with permission:
\`\`\`javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    console.log(\`Location: \${latitude}, \${longitude}\`);
  },
  (error) => console.error('Location access denied')
);
\`\`\`

### 3. Notifications API
Implemented browser notifications for important updates:
- Requesting permission from users
- Creating rich notifications with icons
- Handling notification clicks

### 4. Clipboard API
Modern clipboard access for copy/paste operations:
\`\`\`javascript
await navigator.clipboard.writeText('Copied text!');
const text = await navigator.clipboard.readText();
\`\`\`

## Third-Party API Integration

### Weather API (OpenMeteo)
I integrated a free weather API to display current conditions:
- Fetching data based on user location
- Parsing JSON responses
- Error handling for network failures

### Quotes API
Added an inspirational quotes feature:
- Random quote generation
- Caching to reduce API calls
- Fallback content for offline mode

## Challenges and Solutions

**Challenge 1**: CORS issues with third-party APIs
**Solution**: Used APIs that support CORS or found alternatives

**Challenge 2**: Permission handling across browsers
**Solution**: Implemented graceful degradation when permissions denied

## Key Takeaways
- Browser APIs are incredibly powerful
- Always handle permissions gracefully
- Provide fallbacks for unsupported features
- Cache API responses when possible

## Reflection
This lab opened my eyes to what's possible purely in the browser. The combination of these APIs creates a foundation for Progressive Web Apps that can rival native applications.`,
        tags: ["lab4", "browser-apis", "geolocation", "notifications", "storage", "pwa"],
        date: new Date("2025-01-11")
      },
      {
        title: "Lab 5 Reflection: Python Backend Development",
        content: `# Lab 5: Building a Python Backend

## Overview
Lab 5 introduced server-side development with Python. I learned how to create a backend that persists data and serves it to the frontend.

## Technologies Used
- **Python 3**: Core programming language
- **JSON Files**: Data persistence layer
- **HTTP Server**: Handling requests/responses

## Key Concepts

### 1. File-Based Data Storage
For this lab, I used JSON files to store data:
\`\`\`python
import json

def load_data():
    with open('data.json', 'r') as f:
        return json.load(f)

def save_data(data):
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=2)
\`\`\`

### 2. HTTP Request Handling
Understanding the request/response cycle:
- GET requests for reading data
- POST requests for creating data
- PUT requests for updating
- DELETE requests for removing

### 3. Data Validation
Importance of validating incoming data:
- Type checking
- Required field validation
- Sanitizing user input

## Project Structure
\`\`\`
lab5/
├── server.py          # Main server logic
├── data.json          # Data storage
├── handlers/          # Request handlers
│   ├── journals.py
│   └── projects.py
└── utils/
    └── validation.py
\`\`\`

## Challenges Faced

**Challenge 1**: Concurrent file access
When multiple requests tried to read/write the JSON file simultaneously, data could get corrupted. I learned about file locking mechanisms.

**Challenge 2**: Error handling
Initially, server errors would crash the entire application. Implementing proper try/catch blocks made it more robust.

## What I Learned
- Server-side development requires different thinking than frontend
- Data persistence is crucial for real applications
- Always validate and sanitize user input
- Error handling prevents cascading failures

## Reflection
Moving from client-side JavaScript to server-side Python was a significant mindset shift. Understanding both sides of web development gives me a complete picture of how web applications work.

## Future Improvements
- Migrate from JSON to a proper database (SQLite/PostgreSQL)
- Add authentication
- Implement rate limiting
- Add logging for debugging`,
        tags: ["lab5", "python", "backend", "server", "json", "api"],
        date: new Date("2025-01-12")
      },
      {
        title: "Lab 6 Reflection: Flask REST API Development",
        content: `# Lab 6: Professional REST APIs with Flask

## Overview
Lab 6 elevated my backend skills by introducing Flask, a professional Python web framework. I learned to build RESTful APIs following industry best practices.

## Flask Framework Fundamentals

### Why Flask?
- Lightweight and flexible
- Easy to learn, powerful to use
- Great ecosystem of extensions
- Perfect for APIs and microservices

### Basic Flask Application
\`\`\`python
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/journals', methods=['GET'])
def get_journals():
    return jsonify({'journals': all_journals})

@app.route('/api/journals', methods=['POST'])
def create_journal():
    data = request.get_json()
    # Validate and create journal
    return jsonify(new_journal), 201

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`

## REST API Design Principles

### 1. Resource-Based URLs
- \`/api/journals\` - Collection of journals
- \`/api/journals/<id>\` - Specific journal
- \`/api/projects\` - Collection of projects

### 2. HTTP Methods
- GET: Retrieve resources
- POST: Create new resources
- PUT: Update existing resources
- DELETE: Remove resources

### 3. Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## Features Implemented

### CRUD Operations
Full Create, Read, Update, Delete for:
- Journal entries
- Projects
- User profiles

### Error Handling
\`\`\`python
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404
\`\`\`

### Request Validation
Using Flask-WTF and custom validators to ensure data integrity.

## Challenges and Solutions

**Challenge 1**: CORS for Frontend Communication
**Solution**: Used flask-cors extension to enable cross-origin requests

**Challenge 2**: Handling Large Payloads
**Solution**: Implemented pagination for list endpoints

## Integration with Frontend
Connected my Flask API to the React frontend:
- Used fetch/axios for API calls
- Implemented loading states
- Error handling and user feedback

## Key Takeaways
- REST conventions make APIs predictable
- Proper error handling improves developer experience
- Documentation is crucial for API consumers
- Testing APIs with tools like Postman is essential

## Reflection
Flask taught me how professional APIs are structured. The combination of Python's readability and Flask's simplicity made API development enjoyable. I now understand how to build backends that can scale and be maintained by teams.

## Skills Gained
- RESTful API design
- Flask framework proficiency
- Python decorators and routing
- API testing and documentation
- Frontend-backend integration`,
        tags: ["lab6", "flask", "rest-api", "python", "backend", "crud"],
        date: new Date("2025-01-13")
      },
      {
        title: "PWA Implementation: Offline-First Architecture",
        content: `# Building an Offline-First Progressive Web App

## Overview
This reflection documents my journey implementing Progressive Web App (PWA) features to make the Learning Journal work offline.

## PWA Core Components

### 1. Web App Manifest
The manifest.json defines how the app appears when installed:
\`\`\`json
{
  "name": "Learning Journal",
  "short_name": "Journal",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#6366f1",
  "background_color": "#0f172a"
}
\`\`\`

### 2. Service Worker
The service worker handles caching and offline functionality:
- Pre-caching static assets
- Runtime caching for API responses
- Fallback pages for offline navigation

### 3. IndexedDB Storage
Using localForage for client-side data persistence:
- Store journals and projects locally
- Sync queue for pending operations
- Conflict resolution strategies

## Caching Strategies

### Cache First (Static Assets)
For CSS, JS, and images that rarely change.

### Network First (API Data)
Try network, fall back to cache for dynamic content.

### Stale While Revalidate
Serve cached content immediately, update in background.

## Offline User Experience
- Clear indicators when offline
- Graceful degradation of features
- Queue actions for later sync
- Optimistic UI updates

## Challenges
- Handling sync conflicts
- Cache invalidation
- Service worker updates

## Results
The app now works completely offline, providing a native-app-like experience on any device!`,
        tags: ["pwa", "offline", "service-worker", "indexeddb", "caching"],
        date: new Date("2025-01-14")
      },
      {
        title: "Glassmorphism UI Design Journey",
        content: `# Designing with Glassmorphism

## Overview
This entry documents my exploration of glassmorphism design principles and implementing them in the Learning Journal PWA.

## What is Glassmorphism?
A modern UI trend featuring:
- Frosted glass effect backgrounds
- Blur and transparency
- Subtle borders
- Layered depth

## CSS Implementation
\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
\`\`\`

## Design Decisions

### Color Palette
- Primary: Purple/Indigo tones
- Secondary: Pink/Magenta accents
- Accent: Cyan highlights
- Dark mode optimized

### Typography
- Clean sans-serif fonts
- High contrast for readability
- Proper hierarchy with weights

### Animations
- Subtle hover effects
- Smooth transitions
- Floating elements for depth

## Dark Mode Support
The design adapts beautifully to dark mode with:
- Adjusted glass opacity
- Inverted gradients
- Maintained contrast ratios

## Accessibility Considerations
- Ensured sufficient contrast
- Tested with screen readers
- Keyboard navigation support

## Reflection
Glassmorphism creates a modern, premium feel while maintaining usability. The key is balance - too much blur reduces readability, too little loses the effect.`,
        tags: ["design", "glassmorphism", "css", "ui-ux", "dark-mode"],
        date: new Date("2025-01-14")
      }
    ];

    for (const journal of journals) {
      await storage.createJournal(journal, guestId);
    }
    console.log(`Created ${journals.length} journal entries`);

    // Seed Projects
    const projects = [
      {
        name: "Learning Journal PWA",
        description: "A full-stack offline-first Progressive Web App for tracking educational progress. Features glassmorphism UI, PostgreSQL backend with Drizzle ORM, and complete PWA capabilities including service workers and IndexedDB caching.",
        techStack: ["React", "TypeScript", "Drizzle ORM", "PostgreSQL", "Tailwind CSS", "Vite", "PWA"]
      },
      {
        name: "Browser API Showcase (Lab 4)",
        description: "A demonstration project showcasing various browser APIs including Geolocation, Web Notifications, Clipboard API, and Storage APIs. Integrated with third-party services like OpenMeteo for weather data.",
        techStack: ["JavaScript", "Web APIs", "HTML5", "CSS3", "LocalStorage", "IndexedDB"]
      },
      {
        name: "Python Backend Server (Lab 5)",
        description: "A Python-based backend server using JSON file storage for data persistence. Implements basic CRUD operations and serves as the foundation for understanding server-side development.",
        techStack: ["Python", "JSON", "HTTP Server", "REST API"]
      },
      {
        name: "Flask REST API (Lab 6)",
        description: "A professional REST API built with Flask framework. Features full CRUD operations, proper error handling, CORS support, and follows REST conventions for resource-based endpoints.",
        techStack: ["Python", "Flask", "REST API", "JSON", "Flask-CORS"]
      }
    ];

    for (const project of projects) {
      await storage.createProject(project, guestId);
    }
    console.log(`Created ${projects.length} projects`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
