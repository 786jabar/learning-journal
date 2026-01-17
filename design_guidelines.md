# Learning Journal PWA - Design Guidelines

## Design Approach
**Reference-Based**: Drawing from Notion's content organization + Duolingo's gamified engagement + iOS Notes' clean journaling interface, adapted with requested purple/pink gradient aesthetic and glassmorphism treatment.

## Typography System
- **Primary**: Inter (Google Fonts) - clean, modern readability
- **Heading Scale**: text-3xl (32px) for page titles, text-xl (20px) for sections, text-base (16px) for body
- **Weights**: 600 (semibold) for headings, 400 (regular) for body, 500 (medium) for labels

## Layout & Spacing
**Spacing Primitives**: Tailwind units 2, 4, 6, 8, 12 (e.g., p-4, gap-6, mb-8)
- Mobile: 16px (p-4) container padding, 24px (gap-6) between sections
- Desktop: 32px (p-8) max container, max-w-6xl centered
- Bottom navigation: 64px height (h-16) with safe-area-inset-bottom for iOS

## Component Architecture

### Core Navigation
**Bottom Tab Bar** (mobile-primary):
- 5 tabs: Journal, Projects, Games, Canvas, Labs
- Icon + label layout, 56px touch targets
- Active state: purple gradient indicator, icons filled
- Backdrop blur (backdrop-blur-lg) with semi-transparent background

### Dashboard/Home (Journal Hub)
**Hero Section** (no large image):
- Greeting header with current streak badge
- Quick stats cards (3-column grid): Total Entries, Learning Hours, Completed Projects
- Each stat card uses glassmorphism: backdrop-blur-md, white/10 background, subtle border

**Recent Entries List**:
- Card-based layout with subtle gradient borders (purple/pink)
- Entry preview: Title, date, 2-line excerpt, tags
- Swipe actions on mobile: Edit (left), Delete (right)

### Journal Entry Creation
**Full-screen Modal** (mobile):
- Floating header with gradient backdrop blur
- Rich text editor area (markdown support)
- Toolbar: Format options, image upload, voice note
- Bottom action bar: Save (gradient button), Cancel

### Projects Management
**Kanban Board View**:
- Horizontal scroll columns: To Learn, In Progress, Mastered
- Project cards with glassmorphism, progress rings
- Drag-and-drop on desktop, swipe gestures mobile

### Memory Games Hub
**Grid Layout** (2-column mobile, 3-column desktop):
- Game cards with frosted glass effect
- Icon, title, best score, "Play" button
- Games: Flashcards, Quiz, Match Pairs, Word Scramble

### Canvas Drawing
**Full-screen Canvas**:
- Minimal UI overlay with backdrop blur
- Floating toolbar (top): Brush, Eraser, Color picker, Undo/Redo
- Bottom: Save to entry, Clear, Share
- Color picker shows purple/pink gradient preset

### Lab Demonstrations
**Scrollable Feed**:
- Video/interactive demo cards
- Category filters (top sticky bar with glassmorphism)
- Bookmark icon, completion checkmark
- Expandable details panel

## Visual Treatment

### Glassmorphism Implementation
- Primary glass: `backdrop-blur-lg bg-white/10 border border-white/20`
- Secondary glass: `backdrop-blur-md bg-white/5 border border-white/10`
- Apply to: Cards, modals, navigation, floating buttons

### Gradient System
- **Primary Gradient**: Purple (#8B5CF6) to Pink (#EC4899) - 45deg angle
- **Accent Gradient**: Lighter purple (#A78BFA) to pink (#F472B6)
- Use on: Buttons, progress indicators, active states, card borders

### Buttons
**Primary Button**: Gradient background with white text, rounded-xl
**Secondary Button**: Glassmorphism with gradient border, no background
**Floating Action Button** (FAB): Gradient with drop shadow, bottom-right placement

## Animations (Minimal)
- Page transitions: 200ms slide animations
- Button interactions: Scale 0.98 on press
- Card hover: Subtle lift with shadow increase (desktop only)
- NO scroll-triggered or continuous animations

## Images

### Dashboard Header Background
**Type**: Abstract gradient mesh or subtle geometric pattern
**Placement**: Top 30% of screen behind greeting/stats
**Style**: Blurred purple/pink organic shapes, low opacity (20%)

### Empty States
**Journal Empty**: Illustration of notebook/pen, 200x200px, centered
**Projects Empty**: Illustration of checklist, similar size
**Games Empty**: Playful brain/puzzle icon illustration

### Lab Demo Thumbnails
**Format**: 16:9 aspect ratio preview images
**Treatment**: Subtle overlay with play icon, glassmorphism frame
**Size**: Full card width, ~180px height on mobile

## Offline State Indicators
**Connection Banner**: Top toast with glassmorphism, shows "Offline" with sync icon when disconnected, auto-hides when online

## Accessibility
- High contrast text on glass elements (white text with subtle shadow)
- Touch targets minimum 44x44px
- Focus states with gradient outline rings
- Semantic HTML maintained throughout