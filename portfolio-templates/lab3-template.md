# Lab 3: JavaScript and DOM Manipulation

## Question 1: DOM Selection Methods (200-300 words)

I strategically employed multiple DOM selection methods based on their specific strengths and use cases. I primarily used document.getElementById() for accessing unique elements such as the theme toggle button, date display containers, and modal roots, as it provides the fastest, most direct access to specific elements with O(1) lookup time. For collections of similar elements like journal entry cards, navigation links, and form inputs, I used document.querySelectorAll() which returns a static NodeList that I could iterate over using forEach(), map with Array.from(), or for...of loops. I also extensively used querySelector() for CSS selector-based selection when I needed more complex targeting with attribute selectors, pseudo-classes, or descendant combinators (e.g., 'button[data-action="save"]', '.card:not(.archived)'). In React components, I leveraged useRef hooks for direct DOM access when needed (e.g., for canvas elements, focus management, and scroll position), which provides a stable reference across re-renders. These methods were chosen deliberately for their clarity, performance characteristics, and efficiency - getElementById for unique elements with known IDs, querySelectorAll for collections with shared CSS characteristics, and useRef for React-managed component references.

---

## Question 2: Event Handling Challenges (200-300 words)

The most challenging part was managing event listeners and ensuring they were properly attached after DOM elements were rendered in React's virtual DOM lifecycle. Initially, my JavaScript event handlers executed before the HTML fully loaded, causing frustrating null reference errors that were difficult to debug. In vanilla JavaScript contexts, I solved this by either placing scripts at the end of the body element or wrapping initialization code in DOMContentLoaded event listeners to ensure the DOM was fully parsed. In React, I learned to use useEffect hooks with proper dependency arrays to attach event listeners after component mounting, and crucially, to implement cleanup functions to remove listeners on unmount to prevent memory leaks. Another significant challenge was understanding event propagation (bubbling and capturing phases) when implementing click handlers on nested elements like cards containing buttons. Clicking a button inside a card would trigger both handlers unintentionally. I used event.stopPropagation() strategically to prevent unwanted bubbling, and implemented event delegation patterns where parent elements handle events for multiple children through event.target inspection, improving performance with dynamic lists and reducing the number of attached listeners.

---

## Question 3: Testing and Debugging (200-300 words)

I employed a comprehensive testing and debugging strategy using browser developer tools, primarily Chrome DevTools which offers an extensive suite of debugging capabilities. The Console tab served as my primary output for logging variable values, tracking execution flow with console.group() for organized output, and catching runtime errors with detailed stack traces. I used console.log(), console.table() for array/object visualization, and console.time()/timeEnd() for performance measurement extensively. For complex debugging scenarios, I set breakpoints in the Sources tab to pause execution and step through code line by line, inspecting the call stack, local variables, and closure scopes at each step. The watch expressions feature helped monitor specific variables across steps. I implemented robust try-catch blocks throughout the codebase to handle potential errors gracefully and display meaningful, user-friendly error messages through the toast notification system rather than exposing technical errors. Chrome DevTools' Network tab was essential for verifying API calls - I could inspect request headers, payloads, response status codes, and response bodies to ensure frontend-backend communication worked correctly. The Application tab helped me debug IndexedDB storage, service worker registration, and cache contents. The Elements tab confirmed DOM manipulations were applied as expected, allowing real-time CSS modifications for rapid iteration.

## Key Topics Covered
- DOM selection methods (getElementById, querySelector, querySelectorAll)
- Event handling and propagation
- React useRef and useEffect hooks
- Chrome DevTools debugging
- Error handling with try-catch

## Word Count Target
Each question: 200-300 words
