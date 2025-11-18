import { CheckCircle2, Code2 } from "lucide-react";

export default function Lab3Report() {
  const handlePrint = () => {
    alert('IMPORTANT: In the print dialog, click "More settings" and turn OFF "Headers and footers" to remove the URL!');
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Button */}
      <div className="print:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 shadow-lg"
          data-testid="button-print-pdf"
        >
          📄 Print to PDF
        </button>
      </div>

      {/* Instructions */}
      <div className="print:hidden max-w-4xl mx-auto p-6 mt-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="font-bold text-yellow-800">⚠️ To remove URL from PDF:</p>
          <p className="text-sm text-yellow-700">Click "Print to PDF" → Click "More settings" → Turn OFF "Headers and footers"</p>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-5xl mx-auto px-12 py-8 print:px-0">
        
        {/* COVER PAGE */}
        <div className="page-break text-center py-32">
          <div className="border-b-4 border-gray-800 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Lab 3: JavaScript & DOM Manipulation
            </h1>
            <p className="text-xl text-gray-600">FGCT6021 Mobile Application Development</p>
          </div>
          
          <div className="my-16 space-y-4 text-lg">
            <p className="text-gray-700">Demonstrating Vanilla JavaScript DOM Selection and Event Handling</p>
          </div>

          <div className="my-20 space-y-3 text-left inline-block">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <span className="font-semibold text-gray-700">Name:</span>
              <span className="border-b border-gray-400">_______________________________</span>
              <span className="font-semibold text-gray-700">Student ID:</span>
              <span className="border-b border-gray-400">_______________________________</span>
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="text-gray-700">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="mt-32">
            <p className="text-sm text-gray-500">Learning Journal PWA Project</p>
            <p className="text-sm text-gray-500">GitHub Repository: https://github.com/786jabar/learning-journal.git</p>
          </div>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">Table of Contents</h2>
          <div className="space-y-2">
            {[
              { title: "1. Introduction", page: "3" },
              { title: "2. DOM Selection Methods", page: "4" },
              { title: "3. Feature Implementations", page: "5" },
              { title: "4. Code Documentation", page: "10" },
              { title: "5. Screenshots", page: "14" },
              { title: "6. Conclusion", page: "16" }
            ].map((item, i) => (
              <div key={i} className="flex justify-between border-b border-gray-300 py-2">
                <span className="text-gray-800">{item.title}</span>
                <span className="text-gray-600">{item.page}</span>
              </div>
            ))}
          </div>
        </div>

        {/* INTRODUCTION */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">1. Introduction</h2>
          
          <p className="text-gray-800 leading-relaxed mb-4">
            This report demonstrates the implementation of vanilla JavaScript DOM manipulation techniques 
            as required for Lab 3 of FGCT6021 Mobile Application Development. The project showcases 
            five interactive features built using pure JavaScript methods for DOM selection and manipulation.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1.1 Project Objectives</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800 ml-4">
            <li>Demonstrate proficiency with vanilla JavaScript DOM manipulation</li>
            <li>Implement getElementById(), querySelector(), and querySelectorAll() methods</li>
            <li>Create interactive features using event listeners</li>
            <li>Dynamically update page content and styling</li>
            <li>Validate user input in real-time</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">1.2 Technologies Used</h3>
          <table className="w-full border-collapse border border-gray-300 mt-3">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-3 font-semibold bg-gray-100">Frontend</td>
                <td className="p-3">Vanilla JavaScript (ES6+), HTML5, CSS3</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3 font-semibold bg-gray-100">Framework</td>
                <td className="p-3">React 18 with TypeScript</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold bg-gray-100">Build Tool</td>
                <td className="p-3">Vite</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DOM METHODS */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">2. DOM Selection Methods</h2>
          
          <p className="text-gray-800 mb-6">
            The Document Object Model (DOM) provides several methods for selecting and manipulating HTML elements. 
            This project demonstrates three primary selection methods:
          </p>

          <div className="space-y-6">
            {/* Method 1 */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 getElementById()</h3>
              <p className="text-gray-700 mb-2">
                Selects a single element by its unique ID attribute. Most efficient method for individual elements.
              </p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm border border-gray-300">
                const element = document.getElementById("live-date");
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Use Case:</strong> Selecting unique elements (live date display, theme toggle, form inputs)
              </p>
            </div>

            {/* Method 2 */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 querySelector()</h3>
              <p className="text-gray-700 mb-2">
                Selects the first element matching a CSS selector. More flexible than getElementById().
              </p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm border border-gray-300">
                const element = document.querySelector(".validation-message");
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Use Case:</strong> Selecting by class name, attribute, or complex CSS selector
              </p>
            </div>

            {/* Method 3 */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 querySelectorAll()</h3>
              <p className="text-gray-700 mb-2">
                Selects all elements matching a CSS selector, returns a NodeList.
              </p>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm border border-gray-300">
                const buttons = document.querySelectorAll(".collapsible-btn");
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Use Case:</strong> Applying operations to multiple elements simultaneously
              </p>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">3. Feature Implementations</h2>

          {/* Feature 1 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 bg-gray-100 p-3 border-l-4 border-blue-600">
              3.1 Live Date & Time Display
            </h3>
            <p className="text-gray-800 mb-3">
              Real-time clock displaying current date and time, updating every second using setInterval().
            </p>
            <div className="ml-4">
              <p className="font-semibold text-gray-800 mb-2">JavaScript Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><code className="bg-gray-100 px-2 py-1">getElementById()</code> - Select date display element</li>
                <li><code className="bg-gray-100 px-2 py-1">element.textContent</code> - Update displayed text</li>
                <li><code className="bg-gray-100 px-2 py-1">setInterval()</code> - Execute updates every 1000ms</li>
                <li><code className="bg-gray-100 px-2 py-1">new Date()</code> - Get current date/time</li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 bg-gray-100 p-3 border-l-4 border-purple-600">
              3.2 Theme Switcher
            </h3>
            <p className="text-gray-800 mb-3">
              Interactive button toggling between light and dark themes by modifying CSS styles and classes.
            </p>
            <div className="ml-4">
              <p className="font-semibold text-gray-800 mb-2">JavaScript Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><code className="bg-gray-100 px-2 py-1">getElementById()</code> - Select button and container</li>
                <li><code className="bg-gray-100 px-2 py-1">addEventListener("click")</code> - Listen for clicks</li>
                <li><code className="bg-gray-100 px-2 py-1">classList.toggle()</code> - Toggle dark-theme class</li>
                <li><code className="bg-gray-100 px-2 py-1">element.style</code> - Modify inline CSS properties</li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 bg-gray-100 p-3 border-l-4 border-green-600">
              3.3 Form Validation with Real-time Feedback
            </h3>
            <p className="text-gray-800 mb-3">
              Journal entry form validating input in real-time, requiring minimum 10 words with color-coded feedback.
            </p>
            <div className="ml-4">
              <p className="font-semibold text-gray-800 mb-2">JavaScript Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><code className="bg-gray-100 px-2 py-1">getElementById()</code> - Select form, textarea, word count</li>
                <li><code className="bg-gray-100 px-2 py-1">querySelector()</code> - Select validation message</li>
                <li><code className="bg-gray-100 px-2 py-1">addEventListener("input")</code> - Monitor text changes</li>
                <li><code className="bg-gray-100 px-2 py-1">addEventListener("submit")</code> - Handle form submission</li>
                <li><code className="bg-gray-100 px-2 py-1">event.preventDefault()</code> - Prevent default behavior</li>
                <li><code className="bg-gray-100 px-2 py-1">element.style.color</code> - Dynamic color changes</li>
              </ul>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 bg-gray-100 p-3 border-l-4 border-orange-600">
              3.4 Collapsible Sections
            </h3>
            <p className="text-gray-800 mb-3">
              Three expandable/collapsible sections revealing detailed information about DOM methods and event handling.
            </p>
            <div className="ml-4">
              <p className="font-semibold text-gray-800 mb-2">JavaScript Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><code className="bg-gray-100 px-2 py-1">getElementById()</code> - Select individual sections</li>
                <li><code className="bg-gray-100 px-2 py-1">querySelector()</code> - Select icon elements</li>
                <li><code className="bg-gray-100 px-2 py-1">element.style.display</code> - Show/hide content</li>
                <li><code className="bg-gray-100 px-2 py-1">element.textContent</code> - Change arrow icons (▶ ↔ ▼)</li>
              </ul>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 bg-gray-100 p-3 border-l-4 border-indigo-600">
              3.5 Dynamic Navigation Menu
            </h3>
            <p className="text-gray-800 mb-3">
              Navigation menu dynamically inserted into the page using JavaScript innerHTML.
            </p>
            <div className="ml-4">
              <p className="font-semibold text-gray-800 mb-2">JavaScript Methods:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li><code className="bg-gray-100 px-2 py-1">getElementById()</code> - Select navigation container</li>
                <li><code className="bg-gray-100 px-2 py-1">element.innerHTML</code> - Insert HTML structure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CODE DOCUMENTATION */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">4. Code Documentation</h2>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.1 Live Date/Time Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto border border-gray-700 mb-6">
{`function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  
  const dateElement = document.getElementById("live-date");
  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString('en-US', options);
  }
}

updateDateTime();
setInterval(updateDateTime, 1000);`}
          </pre>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.2 Theme Switcher Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto border border-gray-700 mb-6">
{`const themeSwitcher = document.getElementById("vanilla-theme-toggle");
const demoContainer = document.getElementById("demo-container");

if (themeSwitcher && demoContainer) {
  themeSwitcher.addEventListener("click", function(e) {
    e.preventDefault();
    demoContainer.classList.toggle("dark-theme");
    const isDark = demoContainer.classList.contains("dark-theme");
    
    themeSwitcher.textContent = isDark 
      ? "Switch to Light Mode" 
      : "Switch to Dark Mode";
    
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

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.3 Form Validation Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto border border-gray-700 mb-6">
{`const journalForm = document.getElementById("lab3-journal-form");
const journalInput = document.getElementById("journal-entry");
const wordCount = document.getElementById("word-count");
const validationMsg = document.querySelector(".validation-message");

journalInput.addEventListener("input", function() {
  const text = journalInput.value.trim();
  const words = text.split(/\\s+/).filter(word => word.length > 0);
  const count = words.length;
  
  wordCount.textContent = \`\${count} words\`;
  
  if (count < 10 && text.length > 0) {
    wordCount.style.color = "#ef4444"; // Red
  } else if (count >= 10) {
    wordCount.style.color = "#22c55e"; // Green
  }
});

journalForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const text = journalInput.value.trim();
  const words = text.split(/\\s+/).filter(word => word.length > 0);
  
  if (words.length < 10) {
    validationMsg.textContent = \`Need 10+ words. You have: \${words.length}\`;
    validationMsg.style.color = "#ef4444";
    validationMsg.style.display = "block";
  } else {
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

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.4 Collapsible Sections Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto border border-gray-700 mb-6">
{`window.toggleCollapsible = function(buttonId, targetId) {
  const content = document.getElementById(targetId);
  const button = document.getElementById(buttonId);
  const icon = button?.querySelector(".collapse-icon");
  
  if (content && icon) {
    const isHidden = content.style.display === "none" || !content.style.display;
    content.style.display = isHidden ? "block" : "none";
    icon.textContent = isHidden ? "▼" : "▶";
  }
};`}
          </pre>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">4.5 Dynamic Navigation Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto border border-gray-700">
{`const navContainer = document.getElementById("dynamic-nav");
if (navContainer) {
  const navHTML = \`
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 1.25rem; border-radius: 12px;">
      <div style="color: white; font-weight: 600; margin-bottom: 0.75rem;">
        Dynamic Navigation
      </div>
      <nav>
        <ul style="list-style: none; display: flex; gap: 0.75rem;">
          <li><a href="/" style="color: white;">Home</a></li>
          <li><a href="/journal" style="color: white;">Journal</a></li>
        </ul>
      </nav>
    </div>
  \`;
  navContainer.innerHTML = navHTML;
}`}
          </pre>
        </div>

        {/* SCREENSHOTS SECTION */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">5. Screenshots</h2>
          
          <p className="text-gray-700 mb-6">
            The following screenshots demonstrate each feature in action.
          </p>

          <div className="space-y-8">
            {[
              "Live Date/Time Display",
              "Page in Light Mode", 
              "Page in Dark Mode",
              "Form Validation - Invalid (Red)",
              "Form Validation - Valid (Green)",
              "Success Message",
              "Collapsible Sections - Collapsed",
              "Collapsible Sections - Expanded",
              "Browser Console Output",
              "Dynamic Navigation Menu"
            ].map((title, i) => (
              <div key={i} className="page-avoid-break">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Screenshot {i + 1}: {title}</h3>
                <div className="border-2 border-dashed border-gray-400 rounded p-16 bg-gray-50 text-center">
                  <p className="text-gray-500 text-sm">[Paste screenshot here]</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONCLUSION */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">6. Conclusion</h2>
          
          <p className="text-gray-800 leading-relaxed mb-4">
            This Lab 3 demonstration successfully implements five interactive features using vanilla JavaScript 
            DOM manipulation techniques. Each feature showcases different aspects of DOM interaction, from 
            selecting elements to handling events and dynamically updating content.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Achievements</h3>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Category</th>
                <th className="border border-gray-300 p-3 text-left">Skills Demonstrated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">DOM Selection</td>
                <td className="border border-gray-300 p-3">getElementById(), querySelector(), querySelectorAll()</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Event Handling</td>
                <td className="border border-gray-300 p-3">addEventListener() for click, input, submit events</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">DOM Manipulation</td>
                <td className="border border-gray-300 p-3">textContent, innerHTML, style properties, classList</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Validation</td>
                <td className="border border-gray-300 p-3">Real-time form validation with visual feedback</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 font-semibold">Dynamic Content</td>
                <td className="border border-gray-300 p-3">Programmatic HTML generation and injection</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Learning Outcomes</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-800 ml-4 mb-6">
            <li>Understanding of DOM structure and element selection methods</li>
            <li>Proficiency in event-driven programming patterns</li>
            <li>Ability to validate user input and provide real-time feedback</li>
            <li>Skills in dynamic content generation and manipulation</li>
            <li>Experience debugging JavaScript with browser developer tools</li>
          </ul>

          <div className="mt-8 border-t-2 border-gray-800 pt-6">
            <p className="text-center text-gray-800 font-semibold text-lg">
              This project demonstrates comprehensive understanding of vanilla JavaScript DOM manipulation 
              techniques as required for FGCT6021 Lab 3.
            </p>
          </div>

          <div className="mt-12 text-center text-sm text-gray-600">
            <p className="font-semibold">— End of Report —</p>
            <p className="mt-2">Total Pages: 16</p>
          </div>
        </div>

      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 1.5cm;
          }
          
          body {
            background: white !important;
          }
          
          .page-break {
            page-break-after: always;
          }
          
          .page-avoid-break {
            page-break-inside: avoid;
          }
          
          * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
