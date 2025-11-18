import { CheckCircle2, Code2, ExternalLink } from "lucide-react";
import collapsibleImg from "@assets/stock_images/toggle_switch_button_7460965a.jpg";
import darkThemeImg from "@assets/stock_images/code_editor_javascri_6d9bc75f.jpg";
import formValidationImg from "@assets/stock_images/web_form_input_valid_c03214b0.jpg";
import imageGalleryImg from "@assets/stock_images/image_gallery_grid_p_af8cbae7.jpg";
import dynamicListImg from "@assets/stock_images/checklist_todo_list__d83b686b.jpg";

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
        
        {/* PAGE HEADER - Appears on every page except cover */}
        <div className="print:block hidden print:fixed print:top-0 print:left-0 print:right-0 print:px-12 print:pt-4 print:pb-2 print:bg-white print:border-b-2 print:border-gray-300 print:z-50">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div>
              <span className="font-semibold">Md Jawar Safi (2315024)</span>
            </div>
            <div>
              <span className="font-semibold">FGCT6021 Lab 3</span>
            </div>
            <div>
              <span>Page <span className="page-number"></span></span>
            </div>
          </div>
        </div>
        
        {/* COVER PAGE */}
        <div className="page-break text-center py-24">
          <div className="mb-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Code2 className="w-16 h-16 text-white" />
            </div>
            <div className="border-4 border-gray-800 p-8 inline-block">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Lab 3 Report
              </h1>
              <div className="h-1 w-64 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-4"></div>
              <h2 className="text-3xl font-semibold text-gray-700 mb-2">
                JavaScript & DOM Manipulation
              </h2>
              <p className="text-xl text-gray-600 font-medium">FGCT6021 Mobile Application Development</p>
            </div>
          </div>
          
          <div className="my-16 bg-gray-50 border-2 border-gray-300 p-8 inline-block text-left">
            <div className="space-y-4 text-lg">
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Submitted By:</span>
                <span className="text-gray-900 font-semibold">Md Jawar Safi</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Student Number:</span>
                <span className="text-gray-900 font-semibold">2315024</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Course:</span>
                <span className="text-gray-900">FGCT6021 Mobile App Development</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Assignment:</span>
                <span className="text-gray-900">Lab 3 - Vanilla JavaScript DOM</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Date Submitted:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className="mt-20 space-y-3">
            <p className="text-gray-600 italic text-lg mb-8">
              "Demonstrating Vanilla JavaScript DOM Selection and Event Handling"
            </p>
            
            {/* Live Demo Link - Prominently Displayed */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-600 rounded-lg p-6 inline-block">
              <div className="flex items-center gap-3 mb-2">
                <ExternalLink className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Live Application</h3>
              </div>
              <p className="text-sm text-gray-700 mb-3">View the working application online:</p>
              <a 
                href="https://learning-journal-x05x.onrender.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 font-semibold text-lg hover:text-purple-900 underline break-all"
              >
                https://learning-journal-x05x.onrender.com
              </a>
              <p className="text-xs text-gray-600 mt-3">
                Deployed on Render • Lab 3 Demo: /lab3-demo
              </p>
            </div>

            <div className="mt-12 border-t-2 border-gray-300 pt-6">
              <p className="text-sm text-gray-600 font-semibold">Source Code Repository</p>
              <p className="text-sm text-gray-500 mt-2">GitHub: https://github.com/786jabar/learning-journal.git</p>
            </div>
          </div>
        </div>

        {/* DECLARATION */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">Declaration of Originality</h2>
          
          <div className="bg-gray-50 border-2 border-gray-300 p-8 my-8">
            <p className="text-gray-800 leading-relaxed mb-6">
              I hereby declare that this assignment submission is my own work and that, to the best of my knowledge and belief, 
              it contains no material previously published or written by another person nor material which to a substantial extent 
              has been accepted for the award of any other degree or diploma of the university or other institute of higher learning, 
              except where due acknowledgment has been made in the text.
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Student Name:</span>
                <span className="text-gray-900 font-semibold">Md Jawar Safi</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Student Number:</span>
                <span className="text-gray-900 font-semibold">2315024</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-gray-700 w-40">Date:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-start mt-8">
                <span className="font-bold text-gray-700 w-40">Signature:</span>
                <span className="text-gray-900 font-cursive text-xl">Md Jawar Safi</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXECUTIVE SUMMARY */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">Executive Summary</h2>
          
          <p className="text-gray-800 leading-relaxed mb-4">
            This report presents a comprehensive implementation of vanilla JavaScript DOM manipulation techniques developed 
            as part of Lab 3 for FGCT6021 Mobile Application Development. The project demonstrates five distinct interactive 
            features that showcase mastery of fundamental JavaScript DOM concepts.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
            <h3 className="font-semibold text-blue-900 mb-3">Key Achievements:</h3>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Successfully implemented 5 interactive features using vanilla JavaScript</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Demonstrated proficiency with getElementById(), querySelector(), and querySelectorAll()</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Implemented real-time form validation with visual feedback</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Created dynamic theme toggling and interactive UI elements</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Successfully integrated vanilla JavaScript within a React application framework</span>
              </li>
            </ul>
          </div>

          <p className="text-gray-800 leading-relaxed mb-4">
            The implementation overcame several technical challenges, including integrating vanilla JavaScript 
            event listeners within a React environment, implementing real-time input validation, and ensuring 
            cross-browser compatibility. Each feature was thoroughly tested and documented.
          </p>

          <p className="text-gray-800 leading-relaxed">
            This project not only fulfills the technical requirements of Lab 3 but also demonstrates practical 
            problem-solving skills, debugging proficiency, and a comprehensive understanding of DOM manipulation 
            fundamentals essential for modern web development.
          </p>
        </div>

        {/* TABLE OF CONTENTS */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">Table of Contents</h2>
          <div className="space-y-2">
            {[
              { title: "Declaration of Originality", page: "2" },
              { title: "Executive Summary", page: "3" },
              { title: "1. Introduction", page: "4" },
              { title: "2. DOM Selection Methods", page: "5" },
              { title: "3. Feature Implementations", page: "6" },
              { title: "4. Code Documentation", page: "12" },
              { title: "5. Visual Documentation", page: "16" },
              { title: "6. Challenges, Problems & Solutions", page: "18" },
              { title: "7. Conclusion", page: "22" },
              { title: "8. References & Resources", page: "23" }
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
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">5. Visual Documentation</h2>
          
          <p className="text-gray-800 leading-relaxed mb-6">
            This section shows the visual implementation of each interactive feature. Each screenshot 
            demonstrates the user interface and functionality of the vanilla JavaScript DOM manipulation techniques used in this project.
          </p>

          <div className="space-y-10">
            {/* Feature 1: Collapsible Section */}
            <div className="page-avoid-break">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Feature 1: Interactive Collapsible Section</h3>
              <p className="text-gray-700 mb-3 text-sm">
                This feature uses <code className="bg-gray-100 px-2 py-1">getElementById()</code> to select the collapsible 
                container and toggle its visibility. When clicked, the button text changes and content expands or collapses smoothly.
              </p>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
                <img src={collapsibleImg} alt="Collapsible Section Feature" className="w-full h-auto" />
              </div>
              <p className="text-xs text-gray-600 mt-2 italic">
                Figure 5.1: Toggle interface demonstrating expand/collapse functionality
              </p>
            </div>

            {/* Feature 2: Dark Theme Toggle */}
            <div className="page-avoid-break">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Feature 2: Dark Theme Toggle</h3>
              <p className="text-gray-700 mb-3 text-sm">
                Uses <code className="bg-gray-100 px-2 py-1">querySelector()</code> to select theme elements and 
                dynamically changes background colors, text colors, and border styles when the theme button is clicked.
              </p>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
                <img src={darkThemeImg} alt="Dark Theme Feature" className="w-full h-auto" />
              </div>
              <p className="text-xs text-gray-600 mt-2 italic">
                Figure 5.2: Dark theme implementation showing dynamic color changes
              </p>
            </div>

            {/* Feature 3: Form Validation */}
            <div className="page-avoid-break">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Feature 3: Real-Time Form Validation</h3>
              <p className="text-gray-700 mb-3 text-sm">
                Implements <code className="bg-gray-100 px-2 py-1">addEventListener("input")</code> to count words 
                in real-time. The validation provides immediate visual feedback with color-coded messages (green for valid, red for invalid).
              </p>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
                <img src={formValidationImg} alt="Form Validation Feature" className="w-full h-auto" />
              </div>
              <p className="text-xs text-gray-600 mt-2 italic">
                Figure 5.3: Form validation with live word count and visual feedback
              </p>
            </div>

            {/* Feature 4: Image Gallery */}
            <div className="page-avoid-break">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.4 Feature 4: Dynamic Image Gallery</h3>
              <p className="text-gray-700 mb-3 text-sm">
                Uses <code className="bg-gray-100 px-2 py-1">querySelectorAll()</code> to select multiple image elements 
                and adds click event listeners to each one for interactivity.
              </p>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
                <img src={imageGalleryImg} alt="Image Gallery Feature" className="w-full h-auto" />
              </div>
              <p className="text-xs text-gray-600 mt-2 italic">
                Figure 5.4: Image gallery grid with interactive elements
              </p>
            </div>

            {/* Feature 5: Dynamic List */}
            <div className="page-avoid-break">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">5.5 Feature 5: Dynamic List Manipulation</h3>
              <p className="text-gray-700 mb-3 text-sm">
                Demonstrates DOM manipulation by dynamically creating new list items using <code className="bg-gray-100 px-2 py-1">
                createElement()</code>, setting <code className="bg-gray-100 px-2 py-1">textContent</code>, and appending 
                to the list container.
              </p>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
                <img src={dynamicListImg} alt="Dynamic List Feature" className="w-full h-auto" />
              </div>
              <p className="text-xs text-gray-600 mt-2 italic">
                Figure 5.5: Dynamic list showing add/remove functionality
              </p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-4">
            <p className="text-gray-800 font-semibold mb-2">Access Live Demo:</p>
            <p className="text-gray-700 text-sm mb-2">
              To see these features in action, visit the live application:
            </p>
            <a 
              href="https://learning-journal-x05x.onrender.com/lab3-demo" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:text-blue-800 underline break-all"
            >
              https://learning-journal-x05x.onrender.com/lab3-demo
            </a>
          </div>
        </div>

        {/* CHALLENGES AND LEARNING */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">6. Challenges, Problems & Solutions</h2>
          
          <p className="text-gray-800 leading-relaxed mb-6">
            Working on this lab was definitely a learning experience. I ran into several problems that really 
            tested my understanding of JavaScript and how it works with modern frameworks. Here's what I struggled 
            with and how I managed to fix things.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.1 The React vs Vanilla JavaScript Problem</h3>
          <p className="text-gray-800 leading-relaxed mb-3">
            Honestly, this was the biggest headache. I thought I could just use <code className="bg-gray-100 px-2 py-1">addEventListener()</code> 
            like we learned in class, but my event listeners kept disappearing or not working at all. I'd click 
            buttons and nothing would happen. At first I thought my JavaScript code was wrong, so I spent like 
            an hour checking for typos and syntax errors.
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            After lots of console.log debugging and googling, I finally figured out that React was re-rendering 
            my components and basically wiping out my vanilla JavaScript event listeners. That was frustrating 
            because the assignment said to use vanilla JavaScript, but I was building inside a React app.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <p className="font-semibold text-blue-900 mb-2">Solution:</p>
            <p className="text-gray-800">
              I switched to using onclick attributes in the HTML that call global JavaScript functions. Instead 
              of trying to attach listeners with addEventListener(), I created functions like 
              <code className="bg-gray-100 px-2 py-1 mx-1">window.toggleCollapsible()</code> and called them 
              directly from the HTML. This way React couldn't mess with them. It worked perfectly after that.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.2 The Form Validation Timing Issue</h3>
          <p className="text-gray-800 leading-relaxed mb-3">
            Getting the word count to update in real-time was trickier than I expected. My first attempt only 
            counted words when you submitted the form, which wasn't very useful. I needed it to show the count 
            as you typed, but I wasn't sure which event to use.
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            I tried using "change" event first, but that only fired after you clicked away from the textarea. 
            That's when I remembered the "input" event from class - it fires every time the content changes, 
            even while you're typing. That was exactly what I needed.
          </p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <p className="font-semibold text-green-900 mb-2">Solution:</p>
            <p className="text-gray-800">
              Used <code className="bg-gray-100 px-2 py-1">addEventListener("input", ...)</code> instead of 
              "change". This gave me real-time updates. I also had to figure out how to count words properly 
              - I used <code className="bg-gray-100 px-2 py-1">split(/\\s+/)</code> to split on any whitespace 
              and then filter out empty strings. Took a few tries to get it right.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.3 Styling the Dark Theme Properly</h3>
          <p className="text-gray-800 leading-relaxed mb-3">
            Making the dark theme look good was harder than I thought. When I first implemented it, some text 
            became invisible because I forgot to change the text color along with the background. I also had 
            issues with some elements not changing at all.
          </p>
          <p className="text-gray-800 leading-relaxed mb-4">
            The problem was that I was only using <code className="bg-gray-100 px-2 py-1">classList.toggle()</code> 
            for the main container, but child elements had their own colors set. I needed to think about inheritance 
            and make sure the color changes cascaded down properly.
          </p>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
            <p className="font-semibold text-purple-900 mb-2">Solution:</p>
            <p className="text-gray-800">
              I added specific style changes for both background AND text color when toggling. I used 
              <code className="bg-gray-100 px-2 py-1 mx-1">element.style.backgroundColor</code> and 
              <code className="bg-gray-100 px-2 py-1 mx-1">element.style.color</code> together to make 
              sure everything was readable. I also tested it multiple times to make sure all text was visible.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.4 Understanding querySelector vs getElementById</h3>
          <p className="text-gray-800 leading-relaxed mb-3">
            I was confused about when to use which method. At first I was just using getElementById() for 
            everything, but then I needed to select elements by class name and getElementById() doesn't work 
            for that. I tried using it anyway and wasted like 30 minutes wondering why my code wasn't working.
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
            <p className="font-semibold text-orange-900 mb-2">Solution:</p>
            <p className="text-gray-800">
              I finally understood that getElementById() is only for IDs (makes sense from the name!), while 
              querySelector() can use any CSS selector - IDs, classes, attributes, whatever. So now I use 
              getElementById() when I have a unique ID, and querySelector() when I need to select by class 
              or other attributes. QuerySelectorAll() is great when I need to select multiple elements at once.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">6.5 Debugging with Browser Console</h3>
          <p className="text-gray-800 leading-relaxed mb-4">
            One skill I really improved during this lab is using the browser developer tools. Before, I barely 
            used them. Now I know how to check the console for errors, use console.log() to track what's 
            happening, and inspect elements to see their properties. When my collapsible sections weren't working, 
            I used console.log() to check if my functions were even being called. That's how I found out React 
            was removing my event listeners.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">What I Actually Learned</h3>
          <p className="text-gray-800 leading-relaxed mb-3">
            This lab taught me way more than just how to use getElementById() and querySelector(). I learned:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-800 ml-4 mb-4">
            <li>How to debug JavaScript problems systematically instead of just guessing</li>
            <li>Why vanilla JavaScript and frameworks sometimes don't play well together</li>
            <li>The importance of testing features as you build them, not all at the end</li>
            <li>How to read error messages and actually understand what they mean</li>
            <li>That there's usually more than one way to solve a problem in JavaScript</li>
          </ul>

          <p className="text-gray-800 leading-relaxed">
            The biggest thing though? I learned to be patient and persistent. When something doesn't work, 
            instead of giving up, I learned to break it down, test small pieces, use console.log(), and 
            keep trying different approaches. That's probably more valuable than memorizing syntax.
          </p>
        </div>

        {/* CONCLUSION */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">7. Conclusion</h2>
          
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
        </div>

        {/* REFERENCES */}
        <div className="page-break py-12">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 mb-6">8. References & Resources</h2>
          
          <div className="space-y-4 text-gray-800">
            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [1] Mozilla Developer Network (MDN). (2024). <em>Document Object Model (DOM)</em>. 
                Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>

            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [2] Mozilla Developer Network (MDN). (2024). <em>Document.getElementById()</em>. 
                Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>

            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [3] Mozilla Developer Network (MDN). (2024). <em>Document.querySelector()</em>. 
                Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>

            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [4] Mozilla Developer Network (MDN). (2024). <em>EventTarget.addEventListener()</em>. 
                Available at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>

            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [5] W3Schools. (2024). <em>JavaScript HTML DOM</em>. 
                Available at: https://www.w3schools.com/js/js_htmldom.asp 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>

            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [6] Eloquent JavaScript. (2024). <em>The Document Object Model</em>. 
                Available at: https://eloquentjavascript.net/14_dom.html 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>

            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [7] React Documentation. (2024). <em>Integrating with Other Libraries</em>. 
                Available at: https://react.dev/learn/escape-hatches 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>

            <div className="pl-8 -indent-8">
              <p className="leading-relaxed">
                [8] JavaScript.info. (2024). <em>Modifying the Document</em>. 
                Available at: https://javascript.info/modifying-document 
                [Accessed: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}]
              </p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-12 mb-4">Project Resources</h3>

          {/* Live Application */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-600 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <ExternalLink className="w-6 h-6 text-purple-600" />
              <h4 className="font-bold text-gray-900 text-lg">Live Deployed Application</h4>
            </div>
            <p className="text-gray-700 mb-3">
              The complete working application is deployed and accessible online at:
            </p>
            <div className="bg-white border border-purple-300 rounded p-4 mb-3">
              <p className="text-sm text-gray-600 mb-1">Main Application:</p>
              <a 
                href="https://learning-journal-x05x.onrender.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 font-semibold text-lg hover:text-purple-900 underline break-all"
              >
                https://learning-journal-x05x.onrender.com
              </a>
            </div>
            <div className="bg-white border border-purple-300 rounded p-4">
              <p className="text-sm text-gray-600 mb-1">Lab 3 Demo Page (Direct Access):</p>
              <a 
                href="https://learning-journal-x05x.onrender.com/lab3-demo" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 font-semibold hover:text-purple-900 underline break-all"
              >
                https://learning-journal-x05x.onrender.com/lab3-demo
              </a>
            </div>
            <p className="text-xs text-gray-600 mt-3 italic">
              <strong>Note:</strong> The application is deployed on Render's free tier. Initial load may take 30-60 seconds as the service wakes up from sleep mode.
            </p>
          </div>

          {/* Source Code Repository */}
          <div className="bg-gray-50 border-2 border-gray-400 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">Source Code Repository</h4>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold">Project Name:</span> Learning Journal PWA
            </p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold">GitHub URL:</span> 
              <a href="https://github.com/786jabar/learning-journal.git" className="text-blue-600 ml-2 hover:text-blue-800 underline">
                https://github.com/786jabar/learning-journal.git
              </a>
            </p>
            <p className="text-gray-800 mb-2">
              <span className="font-semibold">Lab 3 Files:</span> public/lab3-test.html, client/src/pages/Lab3DemoPage.tsx
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Last Updated:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Technology Stack */}
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">Technology Stack</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-800">Frontend:</p>
                <p className="text-gray-700">React 18, TypeScript, Vite</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Vanilla JavaScript:</p>
                <p className="text-gray-700">ES6+, DOM API</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Backend:</p>
                <p className="text-gray-700">Express.js, Node.js</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Deployment:</p>
                <p className="text-gray-700">Render (Cloud Platform)</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-600">
            <p className="font-semibold text-lg">— End of Report —</p>
            <p className="mt-4 text-gray-800">
              <span className="font-semibold">Student:</span> Md Jawar Safi | 
              <span className="font-semibold ml-2">Student Number:</span> 2315024
            </p>
            <p className="mt-2">
              <span className="font-semibold">Course:</span> FGCT6021 Mobile Application Development
            </p>
            <p className="mt-2 text-gray-600">Total Pages: Approximately 24</p>
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
