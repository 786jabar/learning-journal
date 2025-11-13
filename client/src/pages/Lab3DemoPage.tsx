import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Lab3DemoPage() {
  useEffect(() => {
    // Lab 3 Requirement: Vanilla JavaScript DOM Manipulation
    // This demonstrates getElementById, querySelector, event handling, and dynamic content

    // 1. DOM Selection Methods Demo
    console.log("Lab 3: DOM Selection Methods");
    const dateElement = document.getElementById("live-date");
    const validationMessage = document.querySelector(".validation-message");
    console.log("Selected elements:", { dateElement, validationMessage });

    // 2. Live Date/Time Feature
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
      if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', options);
      }
    }
    
    // Update date immediately and every second
    updateDateTime();
    const dateInterval = setInterval(updateDateTime, 1000);

    // 3. Theme Switcher (Vanilla JS Toggle)
    const themeSwitcher = document.getElementById("vanilla-theme-toggle");
    const demoContainer = document.getElementById("demo-container");
    
    if (themeSwitcher && demoContainer) {
      themeSwitcher.addEventListener("click", function() {
        demoContainer.classList.toggle("dark-theme");
        const isDark = demoContainer.classList.contains("dark-theme");
        themeSwitcher.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
        
        // Change CSS styles dynamically
        if (isDark) {
          demoContainer.style.backgroundColor = "#1a1a1a";
          demoContainer.style.color = "#ffffff";
        } else {
          demoContainer.style.backgroundColor = "#ffffff";
          demoContainer.style.color = "#000000";
        }
      });
    }

    // 4. Form Validation (10 word minimum)
    const journalForm = document.getElementById("lab3-journal-form") as HTMLFormElement;
    const journalInput = document.getElementById("journal-entry") as HTMLTextAreaElement;
    const validationMsg = document.querySelector(".validation-message") as HTMLElement;
    const wordCount = document.getElementById("word-count") as HTMLElement;

    if (journalInput && wordCount) {
      journalInput.addEventListener("input", function() {
        const text = journalInput.value.trim();
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const count = words.length;
        
        wordCount.textContent = `${count} words`;
        
        if (count < 10 && text.length > 0) {
          wordCount.style.color = "#ef4444";
        } else if (count >= 10) {
          wordCount.style.color = "#22c55e";
        } else {
          wordCount.style.color = "#64748b";
        }
      });
    }

    if (journalForm && journalInput && validationMsg) {
      journalForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const text = journalInput.value.trim();
        const words = text.split(/\s+/).filter(word => word.length > 0);
        
        if (words.length < 10) {
          validationMsg.textContent = `Entry must contain at least 10 words. You have ${words.length}.`;
          validationMsg.style.color = "#ef4444";
          validationMsg.style.display = "block";
        } else {
          validationMsg.textContent = `Success! Entry saved (${words.length} words)`;
          validationMsg.style.color = "#22c55e";
          validationMsg.style.display = "block";
          
          // Clear form after 2 seconds
          setTimeout(() => {
            journalInput.value = "";
            wordCount.textContent = "0 words";
            validationMsg.style.display = "none";
          }, 2000);
        }
      });
    }

    // 5. Collapsible Sections
    const collapsibleButtons = document.querySelectorAll(".collapsible-btn");
    
    collapsibleButtons.forEach(button => {
      button.addEventListener("click", function() {
        const targetId = (button as HTMLElement).dataset.target;
        const content = document.getElementById(targetId!);
        
        if (content) {
          const isHidden = content.style.display === "none";
          content.style.display = isHidden ? "block" : "none";
          button.textContent = isHidden ? "Click to Collapse" : "Click to Expand";
        }
      });
    });

    // 6. Dynamic Navigation Menu Insertion (Lab 3 Requirement)
    const navContainer = document.getElementById("dynamic-nav");
    if (navContainer) {
      const navHTML = `
        <nav style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <ul style="list-style: none; display: flex; gap: 1rem; margin: 0; padding: 0; flex-wrap: wrap;">
            <li><a href="/" style="color: white; text-decoration: none; font-weight: 500;">Home</a></li>
            <li><a href="/journal" style="color: white; text-decoration: none; font-weight: 500;">Journal</a></li>
            <li><a href="/projects" style="color: white; text-decoration: none; font-weight: 500;">Projects</a></li>
            <li><a href="/analytics" style="color: white; text-decoration: none; font-weight: 500;">Analytics</a></li>
            <li><a href="/lab3-demo" style="color: white; text-decoration: none; font-weight: 500; background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 4px;">Lab 3 Demo</a></li>
          </ul>
        </nav>
      `;
      navContainer.innerHTML = navHTML;
    }

    // Cleanup interval on unmount
    return () => {
      clearInterval(dateInterval);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Dynamic Navigation Menu (inserted via JavaScript) */}
      <div id="dynamic-nav" data-testid="dynamic-nav"></div>

      <div id="demo-container" className="transition-colors duration-300" style={{ padding: "2rem", borderRadius: "12px" }}>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Lab 3: JavaScript & DOM Manipulation
          </h1>
          <p className="text-lg text-muted-foreground">
            Demonstrating vanilla JavaScript DOM methods, event handling, and dynamic content updates
          </p>
        </div>

        <div className="grid gap-6">
          {/* Feature 1: Live Date/Time */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>1. Live Date & Time Display</CardTitle>
              <CardDescription>Using JavaScript Date() object and setInterval()</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                <div id="live-date" data-testid="live-date">Loading...</div>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-mono text-muted-foreground">
                  <strong>DOM Method:</strong> document.getElementById("live-date")<br />
                  <strong>Updates:</strong> Every second using setInterval()
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 2: Theme Switcher */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>2. Vanilla JS Theme Switcher</CardTitle>
              <CardDescription>Toggle dark/light mode by changing CSS classes and styles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                id="vanilla-theme-toggle" 
                data-testid="vanilla-theme-toggle"
                className="w-full text-lg"
                variant="default"
              >
                Switch to Dark Mode
              </Button>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-mono text-muted-foreground">
                  <strong>DOM Method:</strong> document.getElementById()<br />
                  <strong>Event:</strong> click event listener<br />
                  <strong>Action:</strong> classList.toggle() + style modifications
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3: Form Validation */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>3. Form Validation (10 Word Minimum)</CardTitle>
              <CardDescription>Validate journal entries must have at least 10 words</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="lab3-journal-form" data-testid="lab3-journal-form">
                <textarea
                  id="journal-entry"
                  data-testid="journal-entry"
                  className="w-full min-h-[120px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Write your journal entry here (minimum 10 words)..."
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                  <span id="word-count" data-testid="word-count" className="text-sm text-muted-foreground">0 words</span>
                  <Button type="submit" data-testid="submit-entry">Submit Entry</Button>
                </div>
                <div className="validation-message mt-2 hidden" data-testid="validation-message" style={{ display: "none" }}></div>
              </form>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-mono text-muted-foreground">
                  <strong>DOM Methods:</strong> querySelector(), getElementById()<br />
                  <strong>Events:</strong> input, submit<br />
                  <strong>Validation:</strong> Word count using split() and filter()
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 4: Collapsible Sections */}
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle>4. Collapsible Sections</CardTitle>
              <CardDescription>Click to expand/collapse content dynamically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Button 
                    className="collapsible-btn w-full justify-start" 
                    variant="outline"
                    data-target="section1"
                    data-testid="collapse-btn-1"
                  >
                    Click to Expand
                  </Button>
                  <div id="section1" data-testid="section1" style={{ display: "none" }} className="mt-2 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">DOM Selection Methods Used:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><code>document.getElementById()</code> - Fast, direct element selection</li>
                      <li><code>document.querySelector()</code> - CSS selector-based selection</li>
                      <li><code>document.querySelectorAll()</code> - Multiple elements selection</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <Button 
                    className="collapsible-btn w-full justify-start" 
                    variant="outline"
                    data-target="section2"
                    data-testid="collapse-btn-2"
                  >
                    Click to Expand
                  </Button>
                  <div id="section2" data-testid="section2" style={{ display: "none" }} className="mt-2 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Event Handling Techniques:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><code>addEventListener("click")</code> - Button interactions</li>
                      <li><code>addEventListener("input")</code> - Real-time form validation</li>
                      <li><code>addEventListener("submit")</code> - Form submission handling</li>
                      <li><code>event.preventDefault()</code> - Prevent default form behavior</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <Button 
                    className="collapsible-btn w-full justify-start" 
                    variant="outline"
                    data-target="section3"
                    data-testid="collapse-btn-3"
                  >
                    Click to Expand
                  </Button>
                  <div id="section3" data-testid="section3" style={{ display: "none" }} className="mt-2 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Dynamic Content Manipulation:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><code>element.textContent</code> - Update text content</li>
                      <li><code>element.innerHTML</code> - Insert HTML dynamically</li>
                      <li><code>element.style.property</code> - Modify CSS styles</li>
                      <li><code>element.classList.toggle()</code> - Add/remove CSS classes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-mono text-muted-foreground">
                  <strong>DOM Methods:</strong> querySelectorAll(), forEach()<br />
                  <strong>Event:</strong> click with data attributes<br />
                  <strong>Action:</strong> Toggle display property
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lab 3 Summary */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-300 dark:border-purple-700">
            <CardHeader>
              <CardTitle>✅ Lab 3 Requirements Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">DOM Selection Methods:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ document.getElementById()</li>
                    <li>✓ document.querySelector()</li>
                    <li>✓ document.querySelectorAll()</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Event Handling:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ click events</li>
                    <li>✓ input events</li>
                    <li>✓ submit events</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Interactive Features:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ Live Date/Time</li>
                    <li>✓ Theme Switcher</li>
                    <li>✓ Form Validation</li>
                    <li>✓ Collapsible Sections</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">DOM Manipulation:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✓ Dynamic Navigation Menu</li>
                    <li>✓ Text Content Changes</li>
                    <li>✓ CSS Style Modifications</li>
                    <li>✓ Class Toggle</li>
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
