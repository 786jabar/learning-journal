# Design Guidelines: Learning Journal PWA with Academic Portfolio

## Design Approach

**System Selected**: Material Design with academic formalization
- Justification: Information-dense content, utility-focused functionality, formal academic context requiring stability and readability
- Core principles: Clear hierarchy, structured layouts, professional restraint, document-like formality for portfolio

## Typography System

**Font Families** (Google Fonts):
- Primary: "Libre Baskerville" (serif) - academic formality for portfolio headings
- Body: "Inter" (sans-serif) - optimal readability for journal entries
- Monospace: "JetBrains Mono" - code snippets or technical content

**Hierarchy**:
- Portfolio H1: 48px, Libre Baskerville, bold
- Portfolio H2/H3: 32px/24px, Libre Baskerville, numbered (1.0, 1.1)
- Journal titles: 28px, Inter, semi-bold
- Body text: 16px, Inter, regular, line-height 1.7
- Captions/metadata: 14px, Inter, medium

## Layout System

**Spacing Units**: Tailwind 4, 6, 8, 12, 16 (consistent vertical rhythm)
- Section padding: py-16 (desktop), py-12 (mobile)
- Card padding: p-6 to p-8
- Element gaps: gap-6 to gap-8

**Container Widths**:
- Portfolio document: max-w-4xl (academic paper width ~800px)
- Journal feed: max-w-6xl
- Full-width headers/footers

## Component Library

### Navigation (PWA)
- Fixed top bar with tabs: "Journal" | "Portfolio" | "Profile"
- Minimal elevation, clear active states
- Mobile: Bottom navigation bar

### Journal Components
1. **Entry Cards**: Elevated cards with date badges, tags, excerpt preview
2. **Editor Interface**: Clean text editor with formatting toolbar, markdown support
3. **Search & Filters**: Tag-based filtering, date range selector
4. **Calendar View**: Monthly grid showing entry frequency

### Portfolio Components (Document-Style)

**Table of Contents**:
- Sticky sidebar (desktop) with anchor links
- Numbered outline matching document structure
- Current section indicator

**Content Sections**:
- Numbered headings (e.g., "1. Education", "1.1 Academic Achievements")
- Publication lists with citation formatting
- Skills matrix with proficiency indicators
- Experience timeline with clear date formatting

**Export Controls**:
- Print/PDF button (sticky top-right)
- Page break indicators for print optimization

### Supporting Elements
- Breadcrumbs for navigation context
- Progress indicators for learning goals
- Tag clouds for topic exploration
- Achievement badges for milestones

## Images

**Hero Image**: Full-width hero on Portfolio page
- Professional academic setting: modern library, study environment, or abstract knowledge visualization
- Height: 60vh with gradient overlay for text readability
- Overlay text: Name, title, academic credentials centered
- Buttons with backdrop blur (rgba background)

**Journal Hero**: Minimal banner (30vh)
- Inspirational workspace or learning-themed abstract
- Tagline: "Document Your Learning Journey"

**Supporting Images**:
- Profile photo (circular, 200px) in portfolio header
- Project thumbnails in portfolio sections
- Optional: Institution logos in education section

## Page-Specific Layouts

### Portfolio Page
**Document Structure**:
1. Hero with credentials overlay
2. Two-column layout (desktop): TOC sidebar (25%) + content (75%)
3. Sequential sections with numbered hierarchy
4. Footer with last updated date, export options

**Print Optimization**:
- Hide navigation and interactive elements
- Ensure proper page breaks between major sections
- Render TOC as static list at beginning

### Journal Page
**Feed Layout**:
1. Search/filter bar
2. Grid layout: 2 columns (desktop), 1 column (mobile)
3. Entry cards with hover elevation
4. Infinite scroll or pagination
5. Floating "New Entry" action button

### Editor Page
- Distraction-free writing interface
- Side-by-side markdown preview (desktop)
- Auto-save indicator
- Word count, reading time metadata

## Interactions

**Minimal Animations**:
- Card hover: subtle elevation increase
- Page transitions: gentle fade
- Scroll-triggered TOC highlighting
- Loading states: skeleton screens

**Focus States**:
- Clear keyboard navigation indicators
- High-contrast focus rings
- Skip-to-content links

## Accessibility
- WCAG AA compliant contrast ratios
- Semantic HTML throughout
- ARIA labels for all interactive elements
- Keyboard shortcuts for common actions
- Screen reader optimized document structure

## PWA Features
- Offline entry drafts
- Background sync for submissions
- Install prompt with app icon
- Responsive across all devices