# Learning Journal PWA - Design Guidelines

## Design Approach
**Selected Approach:** Design System - Material Design 3 + Notion-inspired productivity aesthetics

This productivity-focused learning journal requires clean information hierarchy, excellent readability, and efficient task completion. Drawing inspiration from Notion's calm productivity interface and Linear's modern typography, combined with Material Design 3's component system for consistency.

---

## Core Design Elements

### Typography
- **Primary Font:** Inter (Google Fonts) - exceptional readability for long-form content
- **Monospace Font:** JetBrains Mono - for code snippets and technical tags
- **Hierarchy:**
  - Page Titles: text-4xl (36px), font-bold
  - Section Headers: text-2xl (24px), font-semibold
  - Card Titles: text-lg (18px), font-medium
  - Body Text: text-base (16px), font-normal
  - Metadata/Tags: text-sm (14px), font-medium

### Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Card padding: p-6
- Section spacing: py-12 or py-16
- Component gaps: gap-4 or gap-6
- Inline elements: space-x-2
- Consistent max-width container: max-w-7xl mx-auto px-4

---

## Page-Specific Layouts

### Home Page (Dashboard)
**Analytics-First Layout:**
- Hero welcome section with user greeting and offline status indicator (h-32)
- Two-column grid for analytics charts (grid-cols-1 lg:grid-cols-2, gap-6)
- Chart cards with headers showing: Weekly entries count, Tag distribution, Streak visualization
- Recent entries preview (last 3-5) in card grid below analytics
- Quick action floating button (bottom-right) for new entry

### Journal Page
**Content-Focused List:**
- Search bar and filter chips at top (sticky position)
- Masonry-style card grid for entries (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card shows: title, date, truncated content preview (3 lines), tag pills
- Empty state: centered illustration with "Start your learning journey" prompt

### Projects Page
**Portfolio Grid:**
- Two-column grid layout (grid-cols-1 lg:grid-cols-2)
- Project cards with tech stack badges prominently displayed
- Each card: project name, description, stack icons/badges, edit/delete actions

### About Page
**Simple Single Column:**
- Centered content (max-w-3xl)
- App description and feature highlights
- Attribution and version info

### 404 Page
**Centered Error State:**
- Large "404" typography
- Brief message with navigation link back to home

---

## Component Library

### Navigation
**Top Navbar:**
- Horizontal layout with logo left, nav links center, theme toggle right
- Mobile: hamburger menu with slide-out drawer
- Subtle border-bottom, backdrop-blur effect when scrolling
- Active page indicator with border-b-2 accent

### Cards (Primary Component)
- Rounded corners (rounded-lg)
- Subtle shadow (shadow-md)
- Padding: p-6
- Hover state: slight lift with shadow-lg transition
- Dark mode: elevated surface treatment

### Forms & Inputs
**Markdown Editor:**
- Split view: editor left, preview right on desktop (grid-cols-2)
- Stacked on mobile
- Toolbar with common markdown actions
- Character count footer

**Input Fields:**
- Rounded borders (rounded-md)
- Clear focus states with ring-2
- Label above input (text-sm, mb-2)
- Tag input with chip display

### Buttons
**Primary Action:** Solid fill, medium rounded (rounded-md), px-6 py-3
**Secondary:** Outline style, same padding
**Icon Buttons:** Circular (rounded-full), p-2 for toolbar actions
**Floating Action Button:** Fixed bottom-right, rounded-full, large size (w-14 h-14)

### Status Indicators
**Offline Badge:** 
- Pill shape in top-right corner of navbar
- Amber for offline, green for online
- Subtle pulse animation when syncing

### Charts
- Clean, minimal design with grid lines
- Rounded bars/lines
- Height: h-64 for dashboard widgets
- Interactive tooltips on hover

### Tags/Chips
- Small rounded pills (rounded-full, px-3 py-1)
- Text size: text-xs
- Multiple colors for different tag categories
- Inline-flex layout with gap-2

---

## Animations
**Minimal, Purposeful Transitions:**
- Page transitions: subtle fade (duration-200)
- Card hover: transform scale-[1.02] with shadow elevation
- Modal/drawer: slide-in animations (duration-300)
- Loading states: subtle skeleton shimmer
- **Do not** overuse motion - maintain productivity focus

---

## Dark/Light Theme
Implement robust theme toggle:
- Light: Clean white backgrounds, dark text, subtle gray borders
- Dark: Deep surface colors, elevated cards, high contrast text
- Smooth transition between modes (transition-colors duration-200)
- Persist preference in localStorage

---

## Images

### Home Page Hero Section
**No large hero image** - instead, use minimalist greeting section with:
- Gradient background treatment (subtle)
- Welcome text with current date
- Offline status indicator integrated
- Quick stats summary (total entries, current streak)

### About Page
**Optional mascot/illustration:** Simple line art or abstract shapes representing learning/growth
- Placement: centered, max-w-sm
- Style: Modern, minimal, brand-aligned

### Empty States
Use simple SVG illustrations for:
- No journal entries yet
- No projects created
- Search returns no results
Style: Friendly, minimal line art

---

## Accessibility
- All interactive elements keyboard navigable
- Focus indicators with ring-2 offset-2
- Sufficient contrast ratios in both themes
- Semantic HTML throughout
- ARIA labels for icon-only buttons
- Screen reader friendly status announcements

---

## Special Considerations
- **Offline-first UI:** Clear visual feedback for sync status, queued actions
- **PWA Install Prompt:** Subtle banner or button in navbar (dismissible)
- **Responsive breakpoints:** Mobile-first, thoughtful touch targets (min 44x44px)
- **Loading states:** Skeleton screens for data fetching, not spinners
- **Performance:** Lazy load chart libraries, optimize images

This design creates a calm, focused environment for reflection and learning while maintaining modern web app polish.