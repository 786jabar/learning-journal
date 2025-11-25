import { AlertTriangle, Code2, Globe, Server } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Lab6Report() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Lab 6 Report
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Frontend & Backend Integration with Flask
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-600 dark:text-slate-400">
            <Server className="w-4 h-4" />
            <span>FGCT6021 Mobile Application Development</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Student: Md Jawar Safi (#2315024)
          </p>
        </div>

        {/* Overview Section */}
        <Card className="p-8 mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Overview
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Lab 6 demonstrates professional full-stack web development by integrating a Flask
            backend with a React frontend. The Learning Journal PWA now communicates with a
            RESTful API backend to perform CRUD operations (Create, Read, Update, Delete) on
            reflections stored in JSON files. This lab bridges the gap between frontend user
            interface and backend data persistence, showcasing real-world web application
            architecture used in production environments.
          </p>
        </Card>

        {/* Implementation Section */}
        <Card className="p-8 mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Implementation Details
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-green-600" />
                Flask Backend Architecture
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                The Flask backend implements a RESTful API with the following routes:
              </p>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-2 text-slate-700 dark:text-slate-300 font-mono text-sm">
                <p><strong>GET /api/reflections</strong></p>
                <p className="pl-4">Returns all reflections from JSON file</p>
                <p className="mt-3"><strong>POST /api/reflections</strong></p>
                <p className="pl-4">Accepts JSON data, appends to file, returns new entry</p>
                <p className="mt-3"><strong>PUT /api/reflections/:id</strong></p>
                <p className="pl-4">Updates existing reflection by ID</p>
                <p className="mt-3"><strong>DELETE /api/reflections/:id</strong></p>
                <p className="pl-4">Removes reflection by ID from JSON file</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-600" />
                HTTP Methods & Request Handling
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                Flask handles different HTTP methods appropriately:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>
                  <strong>GET:</strong> Safe, idempotent operation to retrieve data without
                  side effects
                </li>
                <li>
                  <strong>POST:</strong> Creates new resources and modifies server state;
                  receives JSON body
                </li>
                <li>
                  <strong>PUT:</strong> Replaces entire resource; used for updates with full
                  data
                </li>
                <li>
                  <strong>DELETE:</strong> Removes resources; identified by ID in URL path
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Frontend-Backend Communication
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                Frontend uses Fetch API with proper headers and methods:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>
                  <strong>Content-Type: application/json</strong> - Tells Flask to parse JSON
                  body
                </li>
                <li>
                  <strong>Async/Await:</strong> Non-blocking requests for smooth UX
                </li>
                <li>
                  <strong>Error Handling:</strong> Checks response.ok before processing data
                </li>
                <li>
                  <strong>State Updates:</strong> React state reflects backend changes
                  immediately
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Extra Features Section */}
        <Card className="p-8 mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Extra Features Implemented
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                1. Edit Reflections (PUT Method)
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Users can click "Edit" on any reflection to modify the name and text. The PUT
                request sends updated data to Flask, which updates the JSON file. This
                demonstrates proper HTTP semantics for resource updates.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                2. Delete Reflections (DELETE Method)
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Each reflection has a delete button that sends a DELETE request to Flask with
                the reflection ID. Flask removes it from the JSON file and the UI updates
                immediately. Demonstrates proper REST semantics for resource removal.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                3. Client-Side Search & Filter
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Real-time search functionality filters reflections by name or text content.
                Implemented on client-side for instant results without backend requests. Shows
                result count dynamically. Improves UX for finding specific reflections.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                4. Refresh Button
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Allows syncing latest data from Flask backend. Useful when data changes
                externally or to ensure frontend matches backend state. Sends GET request to
                reload all reflections.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                5. Full CRUD Dashboard
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Complete Create, Read, Update, Delete interface on single page. Shows stats
                (total reflections), inline editing, real-time feedback with toast
                notifications, and responsive design. Professional dashboard experience.
              </p>
            </div>
          </div>
        </Card>

        {/* Journal Questions Section */}
        <Card className="p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Journal Questions & Reflections
          </h2>

          <div className="space-y-8">
            {/* Question 1 */}
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 1: Why is the frontend–backend connection important?
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  The frontend-backend connection is fundamental to modern web applications:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Separation of Concerns:</strong> Frontend handles UI/UX; backend
                    handles data logic and persistence
                  </li>
                  <li>
                    <strong>Scalability:</strong> Multiple frontends (web, mobile) can use
                    same backend API
                  </li>
                  <li>
                    <strong>Security:</strong> Sensitive operations (validation, encryption)
                    happen server-side
                  </li>
                  <li>
                    <strong>Data Consistency:</strong> Single source of truth; all clients
                    access same data
                  </li>
                  <li>
                    <strong>Real-time Sync:</strong> Multiple users see updated data
                    automatically
                  </li>
                  <li>
                    <strong>Offline Capability:</strong> Frontend can cache data and sync when
                    online
                  </li>
                  <li>
                    <strong>Performance:</strong> Backend handles heavy computations; frontend
                    renders results
                  </li>
                  <li>
                    <strong>Professional Standards:</strong> Industry standard architecture for
                    production apps
                  </li>
                </ul>
                <p className="mt-3">
                  <strong>Without this connection:</strong> Apps would be static, single-user,
                  insecure, and unable to persist data.
                </p>
              </div>
            </div>

            {/* Question 2 */}
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 2: Which HTTP methods did you use in Flask, and why?
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>HTTP Methods Used:</strong>
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">GET /api/reflections</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Retrieve data without modifying server state.
                      Idempotent and cacheable. Used on page load and refresh.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">POST /api/reflections</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Create new resources. Body contains full reflection
                      data. Non-idempotent; each call creates new entry. Used for form
                      submission.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">PUT /api/reflections/:id</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Replace entire resource with updated data.
                      Idempotent; same request same result. Used for editing existing
                      reflection.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">DELETE /api/reflections/:id</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Remove resource from server. Idempotent; deleting
                      twice doesn't cause error. Used for removing unwanted reflections.
                    </p>
                  </div>
                </div>

                <p className="mt-3">
                  <strong>RESTful Principles:</strong> Each HTTP method has specific semantics.
                  Following these standards makes API predictable and maintainable.
                </p>
              </div>
            </div>

            {/* Question 3 */}
            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 3: What is the difference between using Flask to store and load JSON
                data and reading JSON directly in the browser?
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>Reading JSON Directly in Browser:</strong>
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Can only access files in same domain/CORS-compliant sources</li>
                  <li>Cannot write/modify files (security restriction)</li>
                  <li>Data stored in browser (IndexedDB, localStorage)</li>
                  <li>No server-side processing or validation</li>
                  <li>Each browser maintains separate data</li>
                </ul>

                <p className="mt-3">
                  <strong>Using Flask Backend:</strong>
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Backend controls all file I/O operations</li>
                  <li>Can write/modify/delete JSON files securely</li>
                  <li>Centralized data store on server</li>
                  <li>Server-side validation before storing data</li>
                  <li>All users/devices access same data</li>
                  <li>Backend handles concurrency and data consistency</li>
                  <li>Can implement access controls and permissions</li>
                  <li>Scalable architecture for multiple users</li>
                </ul>

                <p className="mt-3">
                  <strong>Why Flask is Better:</strong>
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>
                    <strong>Security:</strong> Browser cannot directly modify server files
                  </li>
                  <li>
                    <strong>Reliability:</strong> Server enforces data integrity rules
                  </li>
                  <li>
                    <strong>Collaboration:</strong> Multiple users see same data in real-time
                  </li>
                  <li>
                    <strong>Backup:</strong> Data stored safely on server infrastructure
                  </li>
                  <li>
                    <strong>Scalability:</strong> Handles millions of users with database
                    backends
                  </li>
                </ul>
              </div>
            </div>

            {/* Question 4 */}
            <div className="border-l-4 border-orange-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 4: Did you face any difficulties when running your project on
                PythonAnywhere? How did you handle them?
              </h3>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>Challenges & Solutions:</strong>
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">Challenge 1: CORS (Cross-Origin Requests)</p>
                    <p className="text-sm">
                      Frontend on one domain, backend on PythonAnywhere domain. Browser blocked
                      requests. <strong>Solution:</strong> Configure Flask with proper CORS
                      headers or use relative API paths if same domain.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Challenge 2: File Permissions</p>
                    <p className="text-sm">
                      JSON file created by Flask couldn't be written to. <strong>Solution:</strong> Ensure
                      /backend directory has proper write permissions on PythonAnywhere.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Challenge 3: Path Issues</p>
                    <p className="text-sm">
                      Relative file paths work locally but fail on PythonAnywhere. <strong>Solution:</strong> Use
                      __file__ and os.path.dirname() to construct absolute paths.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Challenge 4: Module Imports</p>
                    <p className="text-sm">
                      Flask dependencies not installed in PythonAnywhere environment. <strong>Solution:</strong> Use
                      virtual environments and install requirements.txt via pip.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Challenge 5: Reloading</p>
                    <p className="text-sm">
                      Code changes don't take effect immediately. <strong>Solution:</strong> Use Reload Web
                      App button in PythonAnywhere dashboard after code changes.
                    </p>
                  </div>
                </div>

                <p className="mt-3">
                  <strong>Key Lesson:</strong> Testing locally first prevents most deployment
                  issues. PythonAnywhere is reliable once environment is properly configured.
                </p>
              </div>
            </div>

            {/* Question 5 */}
            <div className="border-l-4 border-red-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 5: What extra feature did you build into your PWA with Flask, and
                why did you add it?
              </h3>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>Five Extra Features Implemented:</strong>
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">1. Edit Reflections (PUT Method)</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Users make mistakes or want to refine reflections
                      later. Editing capability improves user experience and data accuracy.
                      Demonstrates proper PUT semantics in REST API.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">2. Delete Reflections (DELETE Method)</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Users may want to remove unwanted entries. Complete
                      CRUD functionality. DELETE method demonstrates REST compliance. User
                      control over their data.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">3. Real-Time Search/Filter</p>
                    <p className="text-sm">
                      <strong>Why:</strong> With many reflections, users need to find specific
                      entries quickly. Client-side filtering provides instant results. Shows
                      count of matches. Improves discoverability.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">4. Refresh Button</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Ensures frontend stays in sync with backend. Useful
                      if data changes externally. Demonstrates explicit GET request to reload
                      state.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">5. Statistics Dashboard</p>
                    <p className="text-sm">
                      <strong>Why:</strong> Shows total reflections count, backend framework
                      details, and HTTP methods. Provides visual summary of system
                      architecture. Helps understand how everything connects.
                    </p>
                  </div>
                </div>

                <p className="mt-3">
                  <strong>Overall Strategy:</strong> Each feature demonstrates a key REST
                  concept while improving usability. Together they showcase professional
                  full-stack development.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Technical Stack */}
        <Card className="p-8 mt-8 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Technical Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Flask Backend
              </h4>
              <ul className="text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Flask web framework</li>
                <li>• RESTful API design</li>
                <li>• JSON file persistence</li>
                <li>• HTTP method handlers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                React Frontend
              </h4>
              <ul className="text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Fetch API for HTTP requests</li>
                <li>• React hooks for state</li>
                <li>• Async/await patterns</li>
                <li>• Real-time UI updates</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Conclusion */}
        <Card className="p-8 mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
            Conclusion
          </h2>
          <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
            Lab 6 successfully demonstrates professional full-stack web development with
            Flask backend and React frontend integration. By implementing a complete CRUD
            API with proper HTTP semantics and handling real-world challenges like CORS
            and file permissions, this lab showcases production-ready architecture. The
            extra features demonstrate how REST principles enable scalable, maintainable,
            and user-friendly applications. The frontend-backend separation enables
            multiple interfaces to share the same backend, demonstrating how enterprise
            applications are built today.
          </p>
        </Card>
      </div>
    </div>
  );
}
