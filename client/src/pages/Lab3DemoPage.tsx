import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Code2, FileEdit, ChevronRight, CheckCircle2 } from "lucide-react";

export default function Lab3DemoPage() {
  useEffect(() => {
    // Lab 3 Requirement: Vanilla JavaScript DOM Manipulation
    console.log("🚀 Lab 3: DOM Selection Methods Initialized");

    let dateInterval: NodeJS.Timeout | null = null;

    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      console.log("🔍 Starting element search...");

      // 1. Live Date/Time Feature
      function updateDateTime() {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        };
        const dateElement = document.getElementById("live-date");
        if (dateElement) {
          dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
      }
      
      updateDateTime();
      dateInterval = setInterval(updateDateTime, 1000);
      console.log("✅ Live Date/Time: Initialized");

      // 2. Theme Switcher
      const themeSwitcher = document.getElementById("vanilla-theme-toggle");
      const demoContainer = document.getElementById("demo-container");
      
      console.log("🔍 Theme Switcher button:", themeSwitcher ? "FOUND" : "NOT FOUND");
      console.log("🔍 Demo Container:", demoContainer ? "FOUND" : "NOT FOUND");
      
      if (themeSwitcher && demoContainer) {
        themeSwitcher.addEventListener("click", function(e) {
          console.log("🎨 Theme Toggle CLICKED!");
          e.preventDefault();
          e.stopPropagation();
          
          demoContainer.classList.toggle("dark-theme");
          const isDark = demoContainer.classList.contains("dark-theme");
          themeSwitcher.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
          
          if (isDark) {
            demoContainer.style.backgroundColor = "#1a1a2e";
            demoContainer.style.color = "#eee";
            console.log("🌙 Switched to DARK mode");
          } else {
            demoContainer.style.backgroundColor = "transparent";
            demoContainer.style.color = "inherit";
            console.log("☀️ Switched to LIGHT mode");
          }
        }, true);
        console.log("✅ Theme Switcher: Event listener attached");
      } else {
        console.error("❌ Theme Switcher: Failed to attach event listener");
      }

      // 3. Form Validation
      const journalForm = document.getElementById("lab3-journal-form") as HTMLFormElement;
      const journalInput = document.getElementById("journal-entry") as HTMLTextAreaElement;
      const validationMsg = document.querySelector(".validation-message") as HTMLElement;
      const wordCount = document.getElementById("word-count") as HTMLElement;

      console.log("🔍 Form:", journalForm ? "FOUND" : "NOT FOUND");
      console.log("🔍 Textarea:", journalInput ? "FOUND" : "NOT FOUND");
      console.log("🔍 Word Count:", wordCount ? "FOUND" : "NOT FOUND");

      if (journalInput && wordCount) {
        journalInput.addEventListener("input", function() {
          const text = journalInput.value.trim();
          const words = text.split(/\s+/).filter(word => word.length > 0);
          const count = words.length;
          
          wordCount.textContent = `${count} words`;
          console.log(`📝 Word count: ${count}`);
          
          if (count < 10 && text.length > 0) {
            wordCount.style.color = "#ef4444";
            wordCount.style.fontWeight = "600";
          } else if (count >= 10) {
            wordCount.style.color = "#22c55e";
            wordCount.style.fontWeight = "600";
          } else {
            wordCount.style.color = "#94a3b8";
            wordCount.style.fontWeight = "400";
          }
        });
        console.log("✅ Form: Input event listener attached");
      }

      if (journalForm && journalInput && validationMsg) {
        journalForm.addEventListener("submit", function(event) {
          event.preventDefault();
          console.log("📤 Form SUBMITTED!");
          
          const text = journalInput.value.trim();
          const words = text.split(/\s+/).filter(word => word.length > 0);
          
          if (words.length < 10) {
            validationMsg.textContent = `Entry must contain at least 10 words. Currently: ${words.length} words`;
            validationMsg.style.color = "#ef4444";
            validationMsg.style.display = "block";
            validationMsg.style.padding = "0.75rem";
            validationMsg.style.borderRadius = "0.5rem";
            validationMsg.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
            console.log("❌ Validation failed:", words.length, "words");
          } else {
            validationMsg.textContent = `Success! Entry saved (${words.length} words)`;
            validationMsg.style.color = "#22c55e";
            validationMsg.style.display = "block";
            validationMsg.style.padding = "0.75rem";
            validationMsg.style.borderRadius = "0.5rem";
            validationMsg.style.backgroundColor = "rgba(34, 197, 94, 0.1)";
            console.log("✅ Validation passed:", words.length, "words");
            
            setTimeout(() => {
              journalInput.value = "";
              wordCount.textContent = "0 words";
              wordCount.style.color = "#94a3b8";
              validationMsg.style.display = "none";
              console.log("🧹 Form cleared");
            }, 2000);
          }
        });
        console.log("✅ Form: Submit event listener attached");
      }

      // 4. Collapsible Sections - Define global toggle function
      // @ts-ignore - Attach to window for onclick handlers
      window.toggleCollapsible = function(buttonId: string, targetId: string) {
        console.log(`📂 Collapsible button clicked! Target: ${targetId}`);
        
        const content = document.getElementById(targetId);
        const button = document.getElementById(buttonId);
        const icon = button?.querySelector(".collapse-icon");
        
        console.log(`   Content element: ${content ? 'FOUND' : 'NOT FOUND'}`);
        console.log(`   Icon element: ${icon ? 'FOUND' : 'NOT FOUND'}`);
        
        if (content && icon) {
          const isHidden = content.style.display === "none" || !content.style.display;
          content.style.display = isHidden ? "block" : "none";
          icon.textContent = isHidden ? "▼" : "▶";
          console.log(`   ${isHidden ? '📖 EXPANDED' : '📕 COLLAPSED'}`);
        }
      };
      
      const collapsibleButtons = document.querySelectorAll(".collapsible-btn");
      console.log(`🔍 Found ${collapsibleButtons.length} collapsible buttons`);
      console.log("✅ Collapsible: Toggle function attached to window.toggleCollapsible()");

      // 5. Dynamic Navigation Menu
      const navContainer = document.getElementById("dynamic-nav");
      if (navContainer) {
        const navHTML = `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.25rem 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <div style="color: white; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; opacity: 0.9;">Dynamic Navigation (Inserted via JavaScript)</div>
            <nav>
              <ul style="list-style: none; display: flex; gap: 0.75rem; margin: 0; padding: 0; flex-wrap: wrap;">
                <li><a href="/" style="color: white; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.15); transition: all 0.2s; display: inline-block;">Home</a></li>
                <li><a href="/journal" style="color: white; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.15); transition: all 0.2s; display: inline-block;">Journal</a></li>
                <li><a href="/projects" style="color: white; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.15); transition: all 0.2s; display: inline-block;">Projects</a></li>
                <li><a href="/analytics" style="color: white; text-decoration: none; font-weight: 500; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.15); transition: all 0.2s; display: inline-block;">Analytics</a></li>
                <li><a href="/lab3-demo" style="color: white; text-decoration: none; font-weight: 600; padding: 0.5rem 1rem; border-radius: 6px; background: rgba(255,255,255,0.3); transition: all 0.2s; display: inline-block;">Lab 3 Demo ✓</a></li>
              </ul>
            </nav>
          </div>
        `;
        navContainer.innerHTML = navHTML;
        console.log("✅ Dynamic Navigation: Inserted");
      }

      console.log("🎉 All Lab 3 features initialized successfully!");
    }, 100); // 100ms delay to ensure DOM is ready

    // Cleanup function
    return () => {
      if (dateInterval) {
        clearInterval(dateInterval);
      }
    };
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30">
              FGCT6021 Mobile Application Development
            </Badge>
            <h1 className="text-5xl font-bold mb-4">
              Lab 3: JavaScript & DOM
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Demonstrating vanilla JavaScript DOM manipulation, event handling, and interactive features
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Badge variant="secondary" className="bg-white/90 text-purple-700">
                <Code2 className="w-3 h-3 mr-1" />
                getElementById()
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-purple-700">
                <Code2 className="w-3 h-3 mr-1" />
                querySelector()
              </Badge>
              <Badge variant="secondary" className="bg-white/90 text-purple-700">
                <Code2 className="w-3 h-3 mr-1" />
                addEventListener()
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 max-w-6xl">
        {/* Dynamic Navigation */}
        <div id="dynamic-nav" data-testid="dynamic-nav"></div>

        {/* Demo Container */}
        <div id="demo-container" className="transition-all duration-300 rounded-xl p-6">
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Feature 1: Live Date/Time */}
            <Card className="hover-elevate border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-xl">Live Date & Time</CardTitle>
                </div>
                <CardDescription>Real-time updates using setInterval() and Date()</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg">
                  <div id="live-date" data-testid="live-date" className="text-xl font-semibold text-white text-center">
                    Loading...
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Method:</span> <code className="bg-background px-1.5 py-0.5 rounded text-xs">getElementById()</code>
                    <br />
                    <span className="font-semibold text-foreground">Updates:</span> Every 1000ms
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: Theme Switcher */}
            <Card className="hover-elevate border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-xl">Theme Switcher</CardTitle>
                </div>
                <CardDescription>Dynamic CSS manipulation with classList.toggle()</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <button 
                  id="vanilla-theme-toggle" 
                  data-testid="vanilla-theme-toggle"
                  className="w-full h-12 px-4 rounded-md bg-primary text-primary-foreground font-semibold hover-elevate active-elevate-2 transition-colors"
                >
                  Switch to Dark Mode
                </button>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Event:</span> click listener
                    <br />
                    <span className="font-semibold text-foreground">Action:</span> Toggle classes & inline styles
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature 3: Form Validation */}
          <Card className="mb-6 hover-elevate border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <FileEdit className="w-5 h-5 text-green-600" />
                <CardTitle className="text-xl">Form Validation with Real-time Feedback</CardTitle>
              </div>
              <CardDescription>10-word minimum validation using input event handling</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="lab3-journal-form" data-testid="lab3-journal-form" className="space-y-4">
                <div>
                  <textarea
                    id="journal-entry"
                    data-testid="journal-entry"
                    className="w-full min-h-[140px] p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Write your journal entry here... (minimum 10 words required)"
                  ></textarea>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span id="word-count" data-testid="word-count" className="text-sm font-medium text-muted-foreground">
                      0 words
                    </span>
                  </div>
                  <button 
                    type="submit" 
                    data-testid="submit-entry"
                    className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold hover-elevate active-elevate-2 transition-colors"
                  >
                    Submit Entry
                  </button>
                </div>
                <div className="validation-message" data-testid="validation-message" style={{ display: "none" }}></div>
              </form>
              <div className="mt-4 bg-muted/50 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Methods:</span> <code className="bg-background px-1.5 py-0.5 rounded text-xs">querySelector()</code>, <code className="bg-background px-1.5 py-0.5 rounded text-xs">getElementById()</code>
                  <br />
                  <span className="font-semibold text-foreground">Events:</span> input (real-time), submit (validation)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: Collapsible Sections */}
          <Card className="mb-6 hover-elevate border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                <ChevronRight className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-xl">Collapsible Sections</CardTitle>
              </div>
              <CardDescription>Click to expand/collapse using querySelectorAll() and forEach()</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Section 1 */}
              <div>
                <button 
                  id="collapse-btn-1"
                  className="collapsible-btn w-full flex justify-between items-center px-4 py-2 rounded-md border-2 bg-background hover-elevate active-elevate-2 transition-colors" 
                  data-target="section1"
                  data-testid="collapse-btn-1"
                  onClick={() => (window as any).toggleCollapsible('collapse-btn-1', 'section1')}
                >
                  <span className="font-medium">DOM Selection Methods</span>
                  <span className="collapse-icon text-lg">▶</span>
                </button>
                <div id="section1" data-testid="section1" style={{ display: "none" }} className="mt-2 p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-semibold mb-3 text-foreground">DOM Selection Methods Used:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">getElementById()</code> - Direct element selection by ID</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">querySelector()</code> - CSS selector-based selection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">querySelectorAll()</code> - Multiple elements selection</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <button 
                  id="collapse-btn-2"
                  className="collapsible-btn w-full flex justify-between items-center px-4 py-2 rounded-md border-2 bg-background hover-elevate active-elevate-2 transition-colors" 
                  data-target="section2"
                  data-testid="collapse-btn-2"
                  onClick={() => (window as any).toggleCollapsible('collapse-btn-2', 'section2')}
                >
                  <span className="font-medium">Event Handling</span>
                  <span className="collapse-icon text-lg">▶</span>
                </button>
                <div id="section2" data-testid="section2" style={{ display: "none" }} className="mt-2 p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-semibold mb-3 text-foreground">Event Handling Techniques:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">addEventListener("click")</code> - Button interactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">addEventListener("input")</code> - Real-time validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">addEventListener("submit")</code> - Form submission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">event.preventDefault()</code> - Prevent default behavior</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <button 
                  id="collapse-btn-3"
                  className="collapsible-btn w-full flex justify-between items-center px-4 py-2 rounded-md border-2 bg-background hover-elevate active-elevate-2 transition-colors" 
                  data-target="section3"
                  data-testid="collapse-btn-3"
                  onClick={() => (window as any).toggleCollapsible('collapse-btn-3', 'section3')}
                >
                  <span className="font-medium">Dynamic Content Updates</span>
                  <span className="collapse-icon text-lg">▶</span>
                </button>
                <div id="section3" data-testid="section3" style={{ display: "none" }} className="mt-2 p-4 bg-muted/50 rounded-lg border">
                  <h4 className="font-semibold mb-3 text-foreground">DOM Manipulation Methods:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">element.textContent</code> - Update text dynamically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">element.innerHTML</code> - Insert HTML structure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">element.style.property</code> - Modify CSS styles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span><code className="bg-background px-1.5 py-0.5 rounded text-xs">element.classList.toggle()</code> - Toggle CSS classes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-6 h-6" />
                Lab 3 Requirements Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Interactive Features</h4>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      Live Date/Time Display
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      Theme Switcher
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      Form Validation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                      Collapsible Sections
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">DOM Methods</h4>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      getElementById()
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      querySelector()
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      querySelectorAll()
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Event Handling</h4>
                  <ul className="text-sm space-y-1.5">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      click events
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      input events
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600"></div>
                      submit events
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
