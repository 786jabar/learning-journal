import { AlertTriangle, Code2, Database, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Lab5Report() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Lab 5 Report
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Python & JSON Backend Data Integration
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-600 dark:text-slate-400">
            <Globe className="w-4 h-4" />
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
            Lab 5 extends the Learning Journal Progressive Web App by integrating
            Python for backend data processing and JSON for persistent file-based
            storage. While previous labs focused on browser storage (IndexedDB,
            LocalStorage) and DOM manipulation, Lab 5 introduces the concept of
            server-side operations and structured data persistence through JSON
            files. This lab demonstrates how a PWA can work with external data
            sources, fetch data dynamically, and render it within the browser
            using JavaScript and DOM manipulation techniques.
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
                <Code2 className="w-5 h-5 text-blue-600" />
                Python Backend (save_entry.py)
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                Created a Python script that:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>Loads existing reflections from reflections.json</li>
                <li>
                  Prompts users to input a new reflection and select a category
                </li>
                <li>
                  Appends the entry with metadata (id, date, timestamp, category)
                </li>
                <li>Saves the updated JSON file with proper formatting</li>
                <li>Provides user feedback on successful storage</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                JSON File Storage
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                Implemented file-based data persistence:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>
                  Created /backend/reflections.json as the primary data store
                </li>
                <li>Each entry contains: id, text, category, date, timestamp</li>
                <li>JSON structure remains organized with proper indentation</li>
                <li>File updates atomically to prevent data corruption</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Frontend Integration
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-3">
                Frontend fetches and displays JSON data:
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>
                  Uses fetch() API to load /backend/reflections.json on component
                  mount
                </li>
                <li>Parses JSON response and stores in React state</li>
                <li>Dynamically renders entries in the DOM</li>
                <li>Updates UI in real-time when new reflections are added</li>
                <li>Displays reflection count, date, category, and full text</li>
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
                1. Reflection Counter
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Displays the total count of reflections saved. This provides
                quick insight into how many journal entries have been created
                over time.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                2. Export to JSON
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Users can download the reflections.json file directly from the
                browser. This enables data portability and allows users to back
                up their reflections or import them elsewhere.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                3. Export to CSV
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Converts JSON data to CSV format for easy analysis in
                spreadsheet applications. CSV export allows users to analyze
                their reflections using Excel or Google Sheets.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                4. Category Organization
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Each reflection includes a category (general, learning, project,
                challenge, success) for better organization and filtering
                capabilities.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                5. Refresh Button
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                Allows users to reload reflections from the JSON file. Useful
                when data is updated externally or to sync changes from the
                Python script.
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
                Question 1: How is storing data in a JSON file different from
                using browser storage?
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>Key Differences:</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Location:</strong> Browser storage (IndexedDB,
                    LocalStorage) is stored in the browser only. JSON files are
                    stored on the server/backend.
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Browser storage is isolated
                    to a single browser/device. JSON files can be accessed from
                    any client through API calls.
                  </li>
                  <li>
                    <strong>Persistence:</strong> Browser storage persists until
                    cleared. JSON files persist on the server until explicitly
                    deleted.
                  </li>
                  <li>
                    <strong>Data Sharing:</strong> Browser storage is personal
                    per device. JSON files can be shared, exported, or accessed
                    by multiple users/devices.
                  </li>
                  <li>
                    <strong>Processing:</strong> Browser storage requires
                    JavaScript for manipulation. JSON files can be processed by
                    any backend language (Python, Node.js, etc.).
                  </li>
                  <li>
                    <strong>Use Cases:</strong> Browser storage is ideal for
                    offline-first apps. JSON files are ideal for centralized
                    data management and API integration.
                  </li>
                </ul>
              </div>
            </div>

            {/* Question 2 */}
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 2: How did you use Python to create or update your JSON
                file?
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>Python Implementation:</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Loading Data:</strong> Used json.load() to read the
                    existing reflections.json file into a Python list.
                  </li>
                  <li>
                    <strong>User Input:</strong> Collected reflection text and
                    category using input() function for interactive user input.
                  </li>
                  <li>
                    <strong>Creating Entry:</strong> Built a dictionary with
                    entry data (id, text, category, date, timestamp).
                  </li>
                  <li>
                    <strong>Appending Data:</strong> Used list.append() to add
                    the new entry to the reflections list.
                  </li>
                  <li>
                    <strong>Saving Data:</strong> Used json.dump() to write the
                    updated list back to reflections.json with proper
                    indentation for readability.
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Added checks for empty
                    reflections and JSONDecodeError for robust file handling.
                  </li>
                </ul>
                <p className="mt-3">
                  <strong>Code Pattern:</strong> load_reflections() →
                  create_entry() → save_reflections()
                </p>
              </div>
            </div>

            {/* Question 3 */}
            <div className="border-l-4 border-purple-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 3: What does your PWA show locally, and what will users
                see on GitHub? Are they the same? Why or why not?
              </h3>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>Local PWA Display:</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    Shows live reflections from /backend/reflections.json file
                  </li>
                  <li>Contains actual user-added reflections with real dates</li>
                  <li>
                    Displays dynamic content that changes as entries are added
                  </li>
                  <li>Python script can modify the JSON file in real-time</li>
                </ul>

                <p className="mt-3">
                  <strong>GitHub Display:</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    Shows the repository files including save_entry.py and
                    reflections.json
                  </li>
                  <li>
                    reflections.json will contain either an empty array [] or
                    sample entries (depending on commit state)
                  </li>
                  <li>
                    Shows the source code but not the dynamic execution
                    capabilities
                  </li>
                </ul>

                <p className="mt-3">
                  <strong>Are They the Same?</strong>
                </p>
                <p>
                  <strong>No, they are not the same</strong> because:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Content:</strong> Local PWA shows current user data.
                    GitHub shows the code and file state at time of last commit.
                  </li>
                  <li>
                    <strong>Functionality:</strong> Local PWA executes Python
                    scripts and generates dynamic content. GitHub only shows
                    static files and code.
                  </li>
                  <li>
                    <strong>Interactivity:</strong> Local PWA is fully
                    interactive. GitHub shows a read-only view of the code.
                  </li>
                  <li>
                    <strong>Data Separation:</strong> Personal user data stays
                    local. GitHub contains only the application structure and
                    sample/initial data.
                  </li>
                  <li>
                    <strong>Privacy:</strong> User reflections are kept locally.
                    Only code is pushed to GitHub, protecting personal data.
                  </li>
                </ul>
              </div>
            </div>

            {/* Question 4 */}
            <div className="border-l-4 border-orange-600 pl-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Question 4: What extra feature did you add to your PWA using the
                JSON file, and why?
              </h3>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  <strong>Extra Features Implemented:</strong>
                </p>

                <div className="space-y-3 mt-2">
                  <div>
                    <p className="font-semibold">1. Reflection Counter</p>
                    <p className="text-sm">
                      Displays total number of reflections. Why: Provides
                      motivation and visual feedback on learning progress.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">2. Export to JSON</p>
                    <p className="text-sm">
                      Allows users to download reflections.json. Why: Enables
                      data portability, backup creation, and personal data
                      ownership.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">3. Export to CSV</p>
                    <p className="text-sm">
                      Converts reflections to spreadsheet format. Why: Enables
                      data analysis, filtering, and visualization using common
                      tools like Excel.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">4. Category System</p>
                    <p className="text-sm">
                      Organizes reflections into categories. Why: Provides
                      structure for different types of learning (success,
                      challenges, projects).
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">5. Refresh Function</p>
                    <p className="text-sm">
                      Reloads JSON data from backend. Why: Syncs changes made
                      via Python script without page refresh.
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  <strong>Why These Features?</strong> These features demonstrate
                  how JSON file storage enables advanced PWA capabilities: data
                  export for analysis, multi-format export for compatibility,
                  real-time synchronization, and structured data organization
                  beyond simple browser storage.
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
                Backend
              </h4>
              <ul className="text-slate-700 dark:text-slate-300 space-y-1">
                <li>• Python 3.x (json, os, datetime modules)</li>
                <li>• reflections.json (JSON data file)</li>
                <li>• save_entry.py (CLI script)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Frontend
              </h4>
              <ul className="text-slate-700 dark:text-slate-300 space-y-1">
                <li>• React + TypeScript</li>
                <li>• Fetch API (async data loading)</li>
                <li>• DOM Manipulation (dynamic rendering)</li>
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
            Lab 5 successfully integrated Python backend processing with JSON
            file storage into the Learning Journal PWA. The implementation
            demonstrates key concepts in modern web development: server-side
            data processing, file-based storage, API integration, and frontend
            rendering. By combining Python for data manipulation, JSON for
            structured storage, and JavaScript for dynamic UI updates, this lab
            showcases a complete full-stack workflow. The extra features
            (export, categorization, counter) demonstrate practical PWA
            enhancements that add real value for users while reinforcing
            concepts of data portability and interoperability.
          </p>
        </Card>
      </div>
    </div>
  );
}
