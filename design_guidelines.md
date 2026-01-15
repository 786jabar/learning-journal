# Learning Journal PWA - Design Guidelines

## Design Approach: Glassmorphism with Gaming Elements

**Primary Direction**: Modern glassmorphism aesthetic inspired by iOS design language and gaming UI (Candy Crush, Duolingo) for playful engagement while maintaining productivity app clarity.

**Key Principles**:
- Frosted glass cards with backdrop blur effects throughout
- Vibrant purple/violet gradients (deep plum to bright lavender spectrum)
- Playful game-inspired micro-interactions for puzzle section
- Clean, distraction-free journal interface
- Distinct visual identity for each major feature

---

## Typography System

**Font Stack** (Google Fonts):
- Primary: Inter (400, 500, 600, 700) - UI, body text, journal entries
- Accent: Outfit (600, 700) - Game titles, section headers, achievements

**Hierarchy**:
- H1: 2.5rem/3rem (mobile/desktop), font-bold, Outfit
- H2: 2rem/2.25rem, font-semibold, Outfit
- H3: 1.5rem/1.75rem, font-semibold, Inter
- Body: 1rem, font-normal, Inter, leading-relaxed
- Small/Meta: 0.875rem, font-medium, Inter

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6 (mobile), p-8 (desktop)
- Section spacing: mb-8 between major sections
- Card gaps: gap-6 for grids
- Button padding: px-6 py-3

**Container Strategy**:
- Max-width: max-w-6xl for main content
- Journal entries: max-w-3xl for optimal reading
- Game area: Centered, responsive square/rectangle based on viewport
- Canvas: Full available width with max-w-4xl

---

## Core Components

### Navigation
**Top App Bar** (Glassmorphic):
- Fixed position with frosted background (backdrop-blur-xl)
- Logo/app name left, navigation center, theme toggle + user avatar right
- Nav items: Journal | Puzzle Game | Canvas | Achievements
- Mobile: Hamburger menu with slide-out glass drawer
- Height: h-16, subtle bottom border

### Journal Interface
**Entry List View**:
- Masonry/card grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: Frosted glass container with rounded-2xl, hover lift effect
- Card content: Date badge (top-right), title (font-semibold), excerpt (2-3 lines), mood indicator icon
- FAB (Floating Action Button): Bottom-right, glowing purple gradient, "+" icon for new entry

**Entry Detail/Editor**:
- Full-screen overlay with centered glass card (max-w-3xl)
- Header: Date selector, mood picker, tags input
- Rich text area with toolbar (bold, italic, lists, headings)
- Auto-save indicator, word count bottom-left
- Action buttons: Save, Delete (destructive), Close

### Match-3 Puzzle Game
**Game Board**:
- Centered 8x8 grid with glassmorphic tiles
- Candy-style gems: Vibrant purple, violet, pink, blue, amber gradient circles/shapes
- Each tile: Rounded squares with subtle shadows, smooth swap animations
- Score display: Top glass panel with current score, moves left, level progress bar
- Side panels: Next level preview (right), achievements/streak (left)

**Game UI Elements**:
- Power-ups bar below board (shuffle, hint, bomb icons)
- Level complete modal: Full-screen celebration with confetti particle effect
- Pause menu: Frosted overlay with Resume/Restart/Quit buttons

### Drawing Canvas
**Canvas Area**:
- Central white/dark canvas with thin border
- Toolbar: Left sidebar glass panel
  - Tools: Pen, eraser, shapes, text, color picker
  - Brush size slider
  - Undo/redo buttons
- Top controls: Clear canvas, save drawing, export (PNG/SVG)
- Gallery view: Thumbnail grid of saved drawings (grid-cols-3 md:grid-cols-4)

**Canvas Interactions**:
- Touch/mouse drawing with smooth paths
- Layer system for advanced users
- Color palette: Purple theme colors + full spectrum picker

### Achievements/Progress
**Dashboard Cards**:
- 3-column grid (1 on mobile)
- Stats: Total entries, writing streak, puzzle levels completed, drawings saved
- Each stat card: Large number, icon, descriptive label, progress indicator
- Recent achievements: Timeline with milestone badges

---

## Images

**Hero Section** (Homepage/Dashboard):
- **Large Hero Image**: Abstract purple/violet gradient artwork with floating glass shapes and study/creativity motifs (books, pencils, game pieces rendered in soft 3D style)
- Dimensions: Full viewport width, 60vh height
- Overlay: Frosted glass welcome card centered with app title, tagline ("Track. Play. Create."), primary CTA button with blurred purple background
- Image style: Modern, dreamy, gradient-heavy with depth

**Journal Section**:
- No hero image, focus on entry cards
- Entry cards can include user-uploaded images (optional per entry)

**Game Section**:
- No background image, purple gradient background
- Game board is the visual focus

**Canvas Section**:
- No background image, clean workspace priority

---

## Dark/Light Mode

**Light Mode**:
- Background: Light lavender gradient (from white to purple-50)
- Glass cards: white with 20% opacity, backdrop-blur-lg
- Text: gray-900 for primary, gray-600 for secondary

**Dark Mode**:
- Background: Deep purple/black gradient (from purple-950 to black)
- Glass cards: purple-900/white with 10% opacity, stronger blur
- Text: white for primary, gray-300 for secondary
- Elevated contrast for game pieces and canvas tools

**Transition**: Smooth 200ms transition on theme toggle

---

## Component Library

**Buttons**:
- Primary: Gradient purple-600 to violet-600, white text, rounded-full, px-6 py-3, shadow-lg
- Secondary: Glass background, purple text, border border-purple-400
- Icon buttons: Circular, glass background, single icon

**Cards**: Rounded-2xl, backdrop-blur-xl, border border-white/20, shadow-2xl, p-6

**Inputs**: Glass background, rounded-lg, border border-purple-300, focus ring-2 ring-purple-500

**Modals**: Full-screen overlay with centered glass container, dismiss on backdrop click

**Icons**: Heroicons via CDN, consistent 20px/24px sizes