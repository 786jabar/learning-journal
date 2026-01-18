# Lab 2: Mobile-First Design and CSS

## Question 1: Mobile-First Approach (200-300 words)

I approached mobile-first design methodology by systematically starting with the smallest viewport (320px mobile) and progressively enhancing the interface for larger screens. This approach ensures that the core functionality and content are accessible on all devices, with enhanced layouts unlocked as screen real estate increases. Using Tailwind CSS, I implemented a comprehensive responsive breakpoint system (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px) to adjust layouts dynamically. For example, the main navigation implements horizontal scroll with touch-friendly swipe gestures on mobile devices, transitioning to a full horizontal navbar with hover states on desktop viewports. Content cards stack vertically in a single column on mobile for optimal readability, then display in responsive grids (2 columns on tablet, 3-4 columns on desktop) on larger screens using Tailwind's grid utilities. Following WCAG accessibility guidelines, I ensured all touch targets were at least 44x44 pixels for comfortable finger tapping, with adequate spacing between interactive elements to prevent accidental taps. The layout system leverages both Flexbox for one-dimensional layouts (navigation, card contents) and CSS Grid for two-dimensional layouts (dashboard, gallery views), allowing content to adapt fluidly to any screen size while maintaining visual hierarchy and readability.

---

## Question 2: CSS Concepts Applied (200-300 words)

The most transformative CSS concepts I applied were Flexbox combined with CSS Grid for creating sophisticated responsive layouts that adapt seamlessly across devices. Flexbox proved invaluable for easily centering content both horizontally and vertically, distributing space between elements with justify-content and align-items properties, and creating flexible navigation bars that wrap gracefully. I extensively used "flex-wrap: wrap" to handle content overflow gracefully on smaller screens, preventing horizontal scrolling issues. For the complex dashboard layout featuring statistics cards, charts, and activity feeds, CSS Grid enabled me to create intricate multi-column layouts with varying row heights that automatically adjust based on content and viewport. The grid-template-columns with auto-fill and minmax() functions allowed cards to flow naturally without explicit breakpoint adjustments. The "gap" property simplified spacing management significantly compared to traditional margin-based approaches, eliminating issues with first/last child margins and providing consistent gutters. I also leveraged CSS custom properties (variables) defined in index.css to maintain a consistent design system with reusable spacing values, colors, and typography scales that could be adjusted globally.

---

## Question 3: Challenges and Solutions (200-300 words)

The most challenging aspect was achieving pixel-perfect consistent styling across different browsers (Chrome, Firefox, Safari, Edge) and understanding the nuanced rules of CSS specificity and cascade. Initially, I struggled significantly with z-index stacking contexts, especially for sticky headers that needed to overlay content while modal overlays needed to overlay everything including the header. Understanding that z-index only works within stacking contexts, and that certain CSS properties (transform, opacity, filters) create new stacking contexts, was a breakthrough moment. I also found it confusing to manage responsive images that maintain their intrinsic aspect ratios while fitting their parent containers without distortion or overflow. The object-fit property (cover, contain) and aspect-ratio CSS property became essential tools. Another challenge was managing component-scoped styles in React while ensuring global resets and utilities applied correctly. I overcame these challenges by leveraging Tailwind's utility classes which abstract away many browser inconsistencies with built-in prefixes and normalizations, carefully planning my component hierarchy to minimize z-index values needed, using the 'isolation: isolate' property to contain stacking contexts, and implementing a consistent naming convention for custom utility classes in my global CSS file.

## Key Topics Covered
- Mobile-first responsive design
- Flexbox and CSS Grid layouts
- Tailwind CSS breakpoint system
- Cross-browser compatibility
- Z-index and stacking contexts

## Word Count Target
Each question: 200-300 words
