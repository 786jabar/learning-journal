import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Lab4Report() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text" data-testid="heading-lab4-report">
          Lab 4 Report: API Integration
        </h1>
        <p className="text-muted-foreground">
          Student: Md Jawar Safi (#2315024) | FGCT6021 Mobile Application Development
        </p>
      </div>

      {/* Question 1 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            1. Which Storage, Browser, and Third-Party APIs did you choose, and why?
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h3 className="font-semibold text-lg mb-3">Storage APIs</h3>
          <ul className="space-y-2">
            <li>
              <strong>LocalStorage:</strong> I chose LocalStorage for persistent user preferences like theme settings. 
              It's perfect for small amounts of data that should survive browser restarts. The data persists indefinitely 
              until explicitly cleared, making it ideal for settings that users expect to remain consistent across sessions.
            </li>
            <li>
              <strong>SessionStorage:</strong> I implemented SessionStorage for temporary data that should only exist 
              during the current browser session. This is useful for form data, temporary notes, or draft content that 
              shouldn't persist after the user closes the tab.
            </li>
            <li>
              <strong>IndexedDB:</strong> Already integrated in the main app through localforage for storing journal 
              entries and projects. IndexedDB handles larger datasets and complex objects, supporting offline functionality 
              and enabling the PWA to work without internet connection.
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Browser APIs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Clipboard API:</strong> Enables users to easily copy journal entries or any text with one click. 
              This improves user experience by allowing quick sharing of content without manual text selection.
            </li>
            <li>
              <strong>Notifications API:</strong> Provides user feedback when important actions occur, like successfully 
              saving a journal entry. Notifications work even when the browser is minimized, helping users stay informed 
              about their learning progress.
            </li>
            <li>
              <strong>Geolocation API:</strong> Allows users to tag journal entries with their study location. This adds 
              context to learning sessions and can help track where they're most productive. It's particularly useful for 
              students who study in different locations.
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Third-Party APIs</h3>
          <ul className="space-y-2">
            <li>
              <strong>Weather API (Open-Meteo):</strong> Integrates real-time weather data based on user location. This 
              helps track environmental conditions during study sessions. I chose Open-Meteo because it's completely free, 
              requires no API key, and provides accurate weather data worldwide.
            </li>
            <li>
              <strong>Quotes API (Quotable):</strong> Provides motivational and inspirational quotes to encourage users. 
              Daily quotes can boost motivation and make the learning journal more engaging. The API is free and returns 
              high-quality quotes from famous authors and thinkers.
            </li>
            <li>
              <strong>GitHub API:</strong> Allows users to display their GitHub profile and coding projects directly in 
              their learning journal. This is perfect for computer science students who want to track their programming 
              progress alongside their learning notes.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Question 2 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            2. How did you integrate each API with DOM manipulation?
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h3 className="font-semibold text-lg mb-3">Storage APIs Integration</h3>
          <p>
            I used <code>document.getElementById()</code> to select form elements and buttons, then attached event 
            listeners with <code>addEventListener()</code>. When users interact with the storage demos:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Save actions:</strong> Extract values from input elements using <code>.value</code>, store them 
              with <code>localStorage.setItem()</code> or <code>sessionStorage.setItem()</code>, then update the DOM 
              by setting <code>textContent</code> to show success messages.
            </li>
            <li>
              <strong>Retrieve actions:</strong> Fetch data using <code>localStorage.getItem()</code>, then manipulate 
              the DOM by updating <code>textContent</code> and <code>className</code> to display the retrieved values 
              with appropriate styling.
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Browser APIs Integration</h3>
          <p>
            Each browser API demonstration follows the same pattern of DOM manipulation:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Event Binding:</strong> Used <code>addEventListener('click')</code> on buttons to trigger API calls
            </li>
            <li>
              <strong>Loading States:</strong> Update <code>textContent</code> to show "Loading..." before API calls
            </li>
            <li>
              <strong>Result Display:</strong> After API responses, manipulate DOM using <code>innerHTML</code> or 
              <code>textContent</code> to display formatted results
            </li>
            <li>
              <strong>Error Handling:</strong> If API calls fail, update <code>className</code> to show error styling 
              and <code>textContent</code> to display error messages
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Third-Party APIs Integration</h3>
          <p>
            Third-party API integration required asynchronous DOM manipulation:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Weather API:</strong> First get user location with Geolocation API, then fetch weather data. 
              Use <code>innerHTML</code> to create rich weather displays with temperature, conditions, and wind speed.
            </li>
            <li>
              <strong>Quotes API:</strong> Fetch random quotes asynchronously, then update DOM with formatted quote 
              text using <code>innerHTML</code> to include italics for the quote and smaller text for the author.
            </li>
            <li>
              <strong>GitHub API:</strong> Read username from input element, fetch profile data, then dynamically 
              create profile cards using <code>innerHTML</code> with avatar images, follower counts, and repository stats.
            </li>
          </ul>

          <p className="mt-4">
            <strong>Key DOM Methods Used:</strong>
          </p>
          <ul>
            <li><code>document.getElementById()</code> - Element selection</li>
            <li><code>element.addEventListener()</code> - Event handling</li>
            <li><code>element.textContent</code> - Simple text updates</li>
            <li><code>element.innerHTML</code> - Complex HTML updates</li>
            <li><code>element.className</code> - Dynamic styling</li>
            <li><code>element.value</code> - Input field access</li>
          </ul>
        </CardContent>
      </Card>

      {/* Question 3 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            3. What challenges did you encounter, and how did you solve them?
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h3 className="font-semibold text-lg mb-3">Challenge 1: Browser Permissions</h3>
          <p>
            <strong>Problem:</strong> Notifications and Geolocation APIs require explicit user permission, which could 
            be denied or blocked by browser settings.
          </p>
          <p>
            <strong>Solution:</strong> Implemented permission checking with <code>Notification.permission</code> and 
            added clear user feedback. If permission is denied, I display helpful messages guiding users to enable 
            permissions in their browser settings. I also check <code>'Notification' in window</code> to detect if 
            the API is supported before requesting permission.
          </p>

          <h3 className="font-semibold text-lg mb-3 mt-6">Challenge 2: Asynchronous API Calls</h3>
          <p>
            <strong>Problem:</strong> Third-party APIs are asynchronous, which made DOM manipulation timing tricky. 
            Users might see outdated content while waiting for responses.
          </p>
          <p>
            <strong>Solution:</strong> Used async/await syntax for cleaner code and implemented loading states. Before 
            each API call, I update the DOM to show "Loading..." messages, then replace them with actual data or 
            error messages. This provides immediate visual feedback and better user experience.
          </p>

          <h3 className="font-semibold text-lg mb-3 mt-6">Challenge 3: Cross-Origin Resource Sharing (CORS)</h3>
          <p>
            <strong>Problem:</strong> Some third-party APIs have strict CORS policies that block requests from certain 
            origins.
          </p>
          <p>
            <strong>Solution:</strong> Selected APIs that explicitly support CORS for browser-based requests. Open-Meteo, 
            Quotable, and GitHub API all have permissive CORS policies. I also implemented comprehensive error handling 
            with try-catch blocks to gracefully handle any network failures.
          </p>

          <h3 className="font-semibold text-lg mb-3 mt-6">Challenge 4: Geolocation Accuracy and Speed</h3>
          <p>
            <strong>Problem:</strong> Getting user location can be slow, especially with high accuracy settings, and 
            might fail in certain environments.
          </p>
          <p>
            <strong>Solution:</strong> Set reasonable timeout (5000ms) and provided fallback error messages. I also 
            display the accuracy radius (±X meters) so users understand the precision level. The loading message keeps 
            users informed while waiting for GPS signal.
          </p>

          <h3 className="font-semibold text-lg mb-3 mt-6">Challenge 5: API Rate Limiting</h3>
          <p>
            <strong>Problem:</strong> Some APIs have rate limits that could cause failures if users make too many requests.
          </p>
          <p>
            <strong>Solution:</strong> Chose free-tier APIs with generous rate limits (GitHub: 60 req/hour, Quotable: 
            unlimited, Open-Meteo: unlimited). Implemented proper error handling to catch and display rate limit errors 
            if they occur.
          </p>
        </CardContent>
      </Card>

      {/* Question 4 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            4. In what ways do these APIs improve your Learning Journal PWA?
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h3 className="font-semibold text-lg mb-3">Enhanced User Experience</h3>
          <ul className="space-y-2">
            <li>
              <strong>Persistent Settings:</strong> LocalStorage saves user preferences, so theme and settings remain 
              consistent across sessions without requiring sign-in.
            </li>
            <li>
              <strong>Offline Capability:</strong> IndexedDB integration enables full offline functionality, allowing 
              students to journal anywhere without internet access.
            </li>
            <li>
              <strong>Quick Sharing:</strong> Clipboard API makes it effortless to copy and share journal entries, 
              study notes, or project details with classmates or on social media.
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Increased Engagement</h3>
          <ul className="space-y-2">
            <li>
              <strong>Motivational Content:</strong> Daily inspirational quotes encourage consistent journaling and 
              provide mental breaks during long study sessions.
            </li>
            <li>
              <strong>Real-time Notifications:</strong> Browser notifications confirm saved entries and celebrate 
              milestones, creating positive reinforcement for regular journaling habits.
            </li>
            <li>
              <strong>Context-Rich Entries:</strong> Location and weather data add environmental context, helping users 
              remember specific study sessions and identify optimal learning conditions.
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Developer Portfolio Integration</h3>
          <ul className="space-y-2">
            <li>
              <strong>GitHub Integration:</strong> Computer science students can showcase their coding projects 
              alongside learning notes, creating a comprehensive portfolio.
            </li>
            <li>
              <strong>Project Tracking:</strong> Link journal entries to specific GitHub repositories, tracking both 
              conceptual learning and practical implementation.
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Data Insights</h3>
          <ul className="space-y-2">
            <li>
              <strong>Location Patterns:</strong> Geolocation data helps identify most productive study locations over time
            </li>
            <li>
              <strong>Weather Correlations:</strong> Track whether weather conditions affect study productivity and mood
            </li>
            <li>
              <strong>Session Context:</strong> Rich metadata makes journal entries more meaningful and easier to recall
            </li>
          </ul>

          <h3 className="font-semibold text-lg mb-3 mt-6">Professional Features</h3>
          <ul className="space-y-2">
            <li>
              <strong>Modern PWA Capabilities:</strong> Demonstrates cutting-edge web technologies expected in 
              professional applications
            </li>
            <li>
              <strong>Cross-Platform Consistency:</strong> APIs work across desktop and mobile browsers, providing 
              unified experience
            </li>
            <li>
              <strong>Privacy-Conscious:</strong> All data stored locally first (IndexedDB/LocalStorage), giving users 
              control over their information
            </li>
          </ul>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
            <p className="font-semibold mb-2">Overall Impact:</p>
            <p>
              These APIs transform the Learning Journal from a simple note-taking app into a comprehensive learning 
              companion. The combination of offline storage, browser capabilities, and external services creates a 
              powerful tool that adapts to each user's needs while maintaining privacy and reliability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Technical Implementation Summary</CardTitle>
          <CardDescription>Files and Technologies Used</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3"> Vanilla JavaScript Files</h3>
              <ul className="text-sm space-y-1 font-mono text-muted-foreground">
                <li>[OK] /public/js/storage.js</li>
                <li>[OK] /public/js/browser.js</li>
                <li>[OK] /public/js/thirdparty.js</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Tech: Technologies</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>[OK] Vanilla JavaScript (ES6+)</li>
                <li>[OK] Fetch API</li>
                <li>[OK] Async/Await</li>
                <li>[OK] DOM Manipulation</li>
                <li>[OK] Event Listeners</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
