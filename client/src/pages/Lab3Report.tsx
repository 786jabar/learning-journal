import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Code2 } from "lucide-react";

export default function Lab3Report() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Button - Hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 shadow-lg"
          data-testid="button-print-pdf"
        >
          📄 Print to PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Cover Page */}
        <div className="mb-12 page-break-after">
          <div className="text-center space-y-6 py-20">
            <div className="mb-8">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Lab 3: JavaScript & DOM Manipulation
              </h1>
              <div className="h-1 w-32 bg-purple-600 mx-auto rounded"></div>
            </div>
            
            <div className="space-y-3 text-lg text-gray-700">
              <p className="font-semibold">FGCT6021 Mobile Application Development</p>
              <p>Demonstrating Vanilla JavaScript DOM Selection and Event Handling</p>
            </div>

            <div className="mt-16 space-y-2 text-gray-600">
              <p className="text-xl font-semibold">Student Information</p>
              <p>Name: ____________________________</p>
              <p>Student ID: ____________________________</p>
              <p>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="mt-16">
              <p className="text-sm text-gray-500">Learning Journal PWA Project</p>
              <p className="text-sm text-gray-500">GitHub: https://github.com/786jabar/learning-journal.git</p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 page-break-after">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Table of Contents</h2>
          <div className="space-y-3 text-lg">
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>1. Introduction</span>
              <span>3</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>2. DOM Selection Methods</span>
              <span>4</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>3. Feature Implementation</span>
              <span>5</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>4. Screenshots & Demonstrations</span>
              <span>9</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>5. Code Snippets</span>
              <span>13</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span>6. Conclusion</span>
              <span>16</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-12 page-break-after">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Introduction</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              This report demonstrates the implementation of vanilla JavaScript DOM manipulation techniques 
              as required for Lab 3 of FGCT6021 Mobile Application Development. The project showcases 
              five interactive features built using pure JavaScript without relying on React's virtual DOM.
            </p>
            <p>
              The Learning Journal Progressive Web Application serves as the platform for these demonstrations, 
              integrating academic requirements with a functional real-world application. Each feature has been 
              carefully designed to showcase different DOM selection methods and event handling techniques.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Project Objectives</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Demonstrate proficiency with vanilla JavaScript DOM manipulation</li>
              <li>Implement multiple DOM selection methods (getElementById, querySelector, querySelectorAll)</li>
              <li>Create interactive features using event listeners</li>
              <li>Dynamically update page content and styling using JavaScript</li>
              <li>Validate user input in real-time using JavaScript</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Technologies Used</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold text-purple-600">Frontend</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Vanilla JavaScript (ES6+)</li>
                    <li>• TypeScript</li>
                    <li>• React 18 (Framework)</li>
                    <li>• HTML5 & CSS3</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="font-semibold text-purple-600">Development Tools</p>
                  <ul className="text-sm space-y-1 mt-2">
                    <li>• Vite (Build Tool)</li>
                    <li>• Browser DevTools</li>
                    <li>• Git Version Control</li>
                    <li>• Replit IDE</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* DOM Selection Methods */}
        <div className="mb-12 page-break-after">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">2. DOM Selection Methods</h2>
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              The Document Object Model (DOM) provides several methods for selecting and manipulating HTML elements. 
              This project demonstrates three primary selection methods:
            </p>

            <div className="space-y-6">
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-purple-600" />
                    getElementById()
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">
                    Selects a single element by its unique ID attribute. This is the most efficient method 
                    for selecting individual elements.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <code className="text-purple-600">const element = document.getElementById("live-date");</code>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Use Case:</strong> Selecting unique elements like the live date display, theme toggle button, and form inputs.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-600" />
                    querySelector()
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">
                    Selects the first element that matches a CSS selector. More flexible than getElementById() 
                    as it accepts any valid CSS selector.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <code className="text-blue-600">const element = document.querySelector(".validation-message");</code>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Use Case:</strong> Selecting elements by class name, such as validation messages and icons.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-green-600" />
                    querySelectorAll()
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">
                    Selects all elements that match a CSS selector and returns a NodeList. Ideal for applying 
                    operations to multiple elements.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <code className="text-green-600">const buttons = document.querySelectorAll(".collapsible-btn");</code>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>Use Case:</strong> Selecting multiple collapsible buttons and attaching event listeners to each.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Feature Implementation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Feature Implementation</h2>
          
          {/* Feature 1 */}
          <div className="mb-8 page-break-inside-avoid">
            <Card className="border-2">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-2xl">Feature 1: Live Date & Time Display</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">
                      A real-time clock that displays the current date and time, updating every second. 
                      Demonstrates the use of setInterval() for periodic updates and textContent for DOM manipulation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">JavaScript Methods Used</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><code className="bg-gray-100 px-2 py-1 rounded">getElementById()</code> - Select the date display element</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">element.textContent</code> - Update the displayed text</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">setInterval()</code> - Execute updates every 1000ms</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">new Date()</code> - Get current date and time</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Implementation Details</h4>
                    <p className="text-gray-700">
                      The updateDateTime() function retrieves the current date/time and formats it using 
                      toLocaleDateString(). This function is called immediately on page load and then every 
                      second via setInterval(), ensuring the display always shows accurate time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature 2 */}
          <div className="mb-8 page-break-inside-avoid">
            <Card className="border-2">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-2xl">Feature 2: Theme Switcher</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">
                      An interactive button that toggles between light and dark themes by modifying CSS styles 
                      and classes dynamically. Demonstrates event handling and style manipulation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">JavaScript Methods Used</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><code className="bg-gray-100 px-2 py-1 rounded">getElementById()</code> - Select button and container</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">addEventListener("click")</code> - Listen for button clicks</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">classList.toggle()</code> - Toggle dark-theme class</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">element.style</code> - Modify inline CSS properties</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">element.textContent</code> - Update button text</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Implementation Details</h4>
                    <p className="text-gray-700">
                      The theme switcher checks the current state using classList.contains() and applies 
                      appropriate styles. The button text dynamically updates to reflect the action 
                      ("Switch to Dark Mode" vs "Switch to Light Mode").
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature 3 */}
          <div className="mb-8 page-break-inside-avoid">
            <Card className="border-2">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-2xl">Feature 3: Form Validation with Real-time Feedback</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">
                      A journal entry form that validates input in real-time, requiring a minimum of 10 words. 
                      Shows word count with color-coded feedback and prevents submission of invalid entries.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">JavaScript Methods Used</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><code className="bg-gray-100 px-2 py-1 rounded">getElementById()</code> - Select form, textarea, and word count</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">querySelector()</code> - Select validation message element</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">addEventListener("input")</code> - Monitor text changes</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">addEventListener("submit")</code> - Handle form submission</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">event.preventDefault()</code> - Prevent default form behavior</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">element.style.color</code> - Dynamic color changes</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">setTimeout()</code> - Auto-clear form after success</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Implementation Details</h4>
                    <p className="text-gray-700">
                      The input event listener counts words by splitting the text on whitespace. The word count 
                      displays in red for &lt;10 words, green for ≥10 words. On form submission, validation occurs 
                      again, showing appropriate success/error messages. Successful submissions auto-clear after 2 seconds.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature 4 */}
          <div className="mb-8 page-break-inside-avoid">
            <Card className="border-2">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-2xl">Feature 4: Collapsible Sections</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">
                      Three expandable/collapsible sections that reveal detailed information about DOM methods, 
                      event handling, and dynamic content updates. Demonstrates working with multiple elements.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">JavaScript Methods Used</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><code className="bg-gray-100 px-2 py-1 rounded">getElementById()</code> - Select individual sections</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">querySelector()</code> - Select icon elements</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">querySelectorAll()</code> - Select all collapsible buttons</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">element.style.display</code> - Show/hide content</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">element.textContent</code> - Change arrow icons</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">window.toggleCollapsible()</code> - Global toggle function</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Implementation Details</h4>
                    <p className="text-gray-700">
                      A reusable toggle function attached to the window object handles expand/collapse logic. 
                      Each button calls this function with its target section ID. The function toggles display 
                      between "none" and "block" while updating the arrow icon from ▶ to ▼.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature 5 */}
          <div className="mb-8 page-break-inside-avoid">
            <Card className="border-2">
              <CardHeader className="bg-indigo-50">
                <CardTitle className="text-2xl">Feature 5: Dynamic Navigation Menu</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700">
                      A navigation menu dynamically inserted into the page using JavaScript. Demonstrates 
                      creating and injecting HTML content programmatically.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">JavaScript Methods Used</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li><code className="bg-gray-100 px-2 py-1 rounded">getElementById()</code> - Select navigation container</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">element.innerHTML</code> - Insert HTML structure</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Implementation Details</h4>
                    <p className="text-gray-700">
                      The navigation HTML is stored as a template string and injected into a container element 
                      using innerHTML. This demonstrates how JavaScript can dynamically create entire UI sections, 
                      which is useful for loading content from APIs or generating menus programmatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 page-break-before">4. Screenshots & Demonstrations</h2>
          <p className="text-gray-700 mb-6">
            The following screenshots demonstrate each feature in action, showing both the user interface 
            and browser console output confirming vanilla JavaScript execution.
          </p>

          {/* Screenshot placeholders */}
          <div className="space-y-8">
            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Live Date & Time Feature</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 1: Live Date/Time Display</p>
                <p className="text-sm text-gray-400">Paste screenshot showing the date/time updating in real-time</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Theme Switcher - Light Mode</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 2: Page in Light Mode</p>
                <p className="text-sm text-gray-400">Paste screenshot showing the page with light theme</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Theme Switcher - Dark Mode</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 3: Page in Dark Mode</p>
                <p className="text-sm text-gray-400">Paste screenshot showing the page after clicking theme toggle</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Form Validation - Invalid Input</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 4: Form with less than 10 words (red word count)</p>
                <p className="text-sm text-gray-400">Paste screenshot showing validation error with red word count</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.5 Form Validation - Valid Input</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 5: Form with 10+ words (green word count)</p>
                <p className="text-sm text-gray-400">Paste screenshot showing valid input with green word count</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.6 Form Validation - Success Message</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 6: Success message after form submission</p>
                <p className="text-sm text-gray-400">Paste screenshot showing the success message</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.7 Collapsible Sections - Collapsed State</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 7: All sections collapsed (▶ arrows)</p>
                <p className="text-sm text-gray-400">Paste screenshot showing all three sections in collapsed state</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.8 Collapsible Sections - Expanded State</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 8: Sections expanded showing content (▼ arrows)</p>
                <p className="text-sm text-gray-400">Paste screenshot showing expanded sections with visible content</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.9 Browser Console - JavaScript Execution</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 9: Browser console showing debug messages</p>
                <p className="text-sm text-gray-400">Paste screenshot of F12 developer console showing initialization messages and event logs</p>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.10 Dynamic Navigation Menu</h3>
              <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 bg-gray-50 text-center">
                <p className="text-gray-500 mb-4">📸 Screenshot 10: Dynamically inserted navigation menu</p>
                <p className="text-sm text-gray-400">Paste screenshot showing the purple gradient navigation menu at top of page</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Snippets */}
        <div className="mb-12 page-break-before">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Code Snippets</h2>
          <p className="text-gray-700 mb-6">
            Below are key code snippets demonstrating the vanilla JavaScript implementation of each feature.
          </p>

          <div className="space-y-6">
            <div className="page-break-inside-avoid">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Live Date/Time Implementation</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Function to update date/time display
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  // Use getElementById to select element
  const dateElement = document.getElementById("live-date");
  if (dateElement) {
    // Update text content
    dateElement.textContent = now.toLocaleDateString('en-US', options);
  }
}

// Call immediately and then every second
updateDateTime();
const dateInterval = setInterval(updateDateTime, 1000);`}
              </pre>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Theme Switcher Implementation</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Select elements using getElementById
const themeSwitcher = document.getElementById("vanilla-theme-toggle");
const demoContainer = document.getElementById("demo-container");

if (themeSwitcher && demoContainer) {
  // Add click event listener
  themeSwitcher.addEventListener("click", function(e) {
    e.preventDefault();
    
    // Toggle dark theme class
    demoContainer.classList.toggle("dark-theme");
    const isDark = demoContainer.classList.contains("dark-theme");
    
    // Update button text
    themeSwitcher.textContent = isDark 
      ? "Switch to Light Mode" 
      : "Switch to Dark Mode";
    
    // Apply inline styles
    if (isDark) {
      demoContainer.style.backgroundColor = "#1a1a2e";
      demoContainer.style.color = "#eee";
    } else {
      demoContainer.style.backgroundColor = "transparent";
      demoContainer.style.color = "inherit";
    }
  });
}`}
              </pre>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Form Validation Implementation</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Select form elements
const journalForm = document.getElementById("lab3-journal-form");
const journalInput = document.getElementById("journal-entry");
const wordCount = document.getElementById("word-count");
const validationMsg = document.querySelector(".validation-message");

// Real-time word count on input
journalInput.addEventListener("input", function() {
  const text = journalInput.value.trim();
  const words = text.split(/\\s+/).filter(word => word.length > 0);
  const count = words.length;
  
  // Update word count display
  wordCount.textContent = \`\${count} words\`;
  
  // Color-coded feedback
  if (count < 10 && text.length > 0) {
    wordCount.style.color = "#ef4444"; // Red
  } else if (count >= 10) {
    wordCount.style.color = "#22c55e"; // Green
  }
});

// Form submission validation
journalForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission
  
  const text = journalInput.value.trim();
  const words = text.split(/\\s+/).filter(word => word.length > 0);
  
  if (words.length < 10) {
    // Show error message
    validationMsg.textContent = \`Need 10+ words. You have: \${words.length}\`;
    validationMsg.style.color = "#ef4444";
    validationMsg.style.display = "block";
  } else {
    // Show success and auto-clear
    validationMsg.textContent = \`Success! (\${words.length} words)\`;
    validationMsg.style.color = "#22c55e";
    validationMsg.style.display = "block";
    
    setTimeout(() => {
      journalInput.value = "";
      wordCount.textContent = "0 words";
      validationMsg.style.display = "none";
    }, 2000);
  }
});`}
              </pre>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.4 Collapsible Sections Implementation</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Create global toggle function
window.toggleCollapsible = function(buttonId, targetId) {
  // Use getElementById to find elements
  const content = document.getElementById(targetId);
  const button = document.getElementById(buttonId);
  
  // Use querySelector to find icon within button
  const icon = button?.querySelector(".collapse-icon");
  
  if (content && icon) {
    // Check current state
    const isHidden = content.style.display === "none" || !content.style.display;
    
    // Toggle display
    content.style.display = isHidden ? "block" : "none";
    
    // Update icon text
    icon.textContent = isHidden ? "▼" : "▶";
  }
};

// Verify buttons exist using querySelectorAll
const collapsibleButtons = document.querySelectorAll(".collapsible-btn");
console.log(\`Found \${collapsibleButtons.length} collapsible buttons\`);`}
              </pre>
            </div>

            <div className="page-break-inside-avoid">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.5 Dynamic Navigation Implementation</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Select container element
const navContainer = document.getElementById("dynamic-nav");

if (navContainer) {
  // Create HTML as string
  const navHTML = \`
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 1.25rem 1.5rem; border-radius: 12px;">
      <div style="color: white; font-weight: 600; margin-bottom: 0.75rem;">
        Dynamic Navigation (Inserted via JavaScript)
      </div>
      <nav>
        <ul style="list-style: none; display: flex; gap: 0.75rem;">
          <li><a href="/" style="color: white;">Home</a></li>
          <li><a href="/journal" style="color: white;">Journal</a></li>
          <li><a href="/projects" style="color: white;">Projects</a></li>
          <li><a href="/analytics" style="color: white;">Analytics</a></li>
        </ul>
      </nav>
    </div>
  \`;
  
  // Insert HTML into DOM
  navContainer.innerHTML = navHTML;
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Conclusion */}
        <div className="mb-12 page-break-before">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Conclusion</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              This Lab 3 demonstration successfully implements five interactive features using vanilla JavaScript 
              DOM manipulation techniques. Each feature showcases different aspects of DOM interaction, from 
              selecting elements to handling events and dynamically updating content.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Key Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-purple-600 mb-2">Technical Skills Demonstrated</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>getElementById() for unique elements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>querySelector() for CSS selectors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>querySelectorAll() for collections</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Event listeners (click, input, submit)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>DOM content manipulation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>CSS style manipulation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-semibold text-purple-600 mb-2">Learning Outcomes</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Understanding DOM structure</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Event-driven programming</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Real-time validation techniques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Dynamic content generation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Debugging with browser console</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Clean code practices</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Challenges & Solutions</h3>
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="font-semibold text-blue-900 mb-2">React vs Vanilla JavaScript Integration</p>
              <p className="text-sm text-gray-700">
                <strong>Challenge:</strong> React's virtual DOM interfered with vanilla JavaScript event listeners 
                on certain elements.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                <strong>Solution:</strong> Created global functions attached to the window object and used React's 
                onClick props to call vanilla JavaScript functions, maintaining compatibility between React framework 
                and pure JavaScript DOM manipulation.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Real-World Applications</h3>
            <p>
              The skills demonstrated in this lab are fundamental to modern web development. DOM manipulation is 
              essential for creating interactive user experiences, even when using frameworks like React or Vue. 
              Understanding vanilla JavaScript provides a solid foundation for working with any JavaScript framework 
              and enables developers to solve problems when framework abstractions are insufficient.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Future Enhancements</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Add localStorage persistence for theme preference</li>
              <li>Implement keyboard accessibility for collapsible sections</li>
              <li>Add animation transitions using CSS and JavaScript</li>
              <li>Extend form validation with more complex rules (email, phone numbers)</li>
              <li>Create a quiz or assessment feature to test DOM manipulation knowledge</li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-center text-gray-800 font-semibold">
                This project demonstrates comprehensive understanding of vanilla JavaScript DOM manipulation 
                techniques as required for FGCT6021 Lab 3 assignment.
              </p>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>End of Report</p>
              <p className="mt-2">GitHub Repository: https://github.com/786jabar/learning-journal.git</p>
              <p>Page Count: Approximately 16 pages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
          
          .page-break-before {
            page-break-before: always;
          }
          
          .page-break-after {
            page-break-after: always;
          }
          
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
          
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
