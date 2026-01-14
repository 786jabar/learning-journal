# Learning Journal PWA Design Guidelines

## Design Approach
**Reference-Based Strategy**: Inspired by Notion's clean productivity focus + Apple's glassmorphic design language + Duolingo's educational journey visualization. Custom glassmorphic component system with educational progress theming.

## Typography System
**Font Families**: 
- Primary: Inter or DM Sans (clean, modern sans-serif via Google Fonts)
- Accent: Space Grotesk for headings and emphasis

**Hierarchy**:
- Hero Headlines: 4xl-6xl, bold weight, tight leading
- Section Headings: 2xl-3xl, semibold
- Body Text: base-lg, regular weight, relaxed leading (1.7)
- Labels/Meta: sm-xs, medium weight, uppercase tracking

## Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20 for consistency (p-4, gap-8, mt-12, py-20)

**Grid Framework**:
- Desktop container: max-w-7xl with px-8
- Content regions: max-w-4xl for reading comfort
- Card grids: 2-3 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

## Landing/Login Page Structure

**Hero Section** (full viewport, 100vh):
- Large hero image: Abstract educational imagery - student studying with glowing holographic learning elements, soft bokeh, inspirational atmosphere
- Glassmorphic overlay card (centered, max-w-md): Login form with frosted background blur, subtle border, shadow-2xl
- Headline + tagline above/within card
- Primary CTA button with backdrop-blur effect
- Trust indicators below: "Join 50K+ learners" with small avatars

**Features Section** (py-20):
- 3-column grid showcasing core features
- Each card: Icon (top), heading, description, micro-illustration
- Glassmorphic card treatment with hover lift effect

**Progress Visualization Section** (py-20):
- 2-column layout: Left side shows animated progress dashboard mockup (image), right side has benefit list
- Dashboard image: Screenshot of app showing learning streaks, progress graphs, achievement badges

**Testimonials** (py-16):
- 2-column grid with student testimonials
- Each card includes avatar, quote, name, learning achievement
- Subtle glassmorphic cards

**Final CTA Section** (py-24):
- Centered content with secondary hero image background (blurred student collaboration scene)
- Large CTA button with blurred background
- Supporting text about starting educational journey

## Core Components

**Glassmorphic Cards**:
- Backdrop blur (blur-xl to blur-2xl)
- Semi-transparent backgrounds
- Subtle borders (border border-white/20)
- Layered shadows (shadow-lg to shadow-2xl)
- Rounded corners (rounded-2xl to rounded-3xl)

**Navigation**:
- Sticky glassmorphic header with backdrop-blur
- Logo left, nav links center, profile/settings right
- Minimal height (h-16), full-width with inner max-w-7xl container

**Form Inputs**:
- Glassmorphic treatment matching card aesthetics
- Floating labels with smooth transitions
- Focus states with subtle glow (not color-dependent)
- Consistent padding (px-4 py-3), rounded-xl

**Progress Indicators**:
- Circular progress rings for skill levels
- Linear progress bars for course completion
- Achievement badges with glassmorphic frames
- Streak counters with number emphasis

**Journal Entry Cards**:
- Full glassmorphic treatment
- Date badge (top-left corner)
- Title, preview text, tags
- Action menu (top-right)
- Hover state with slight scale and shadow increase

**Dashboard Widgets**:
- Stat cards: Large number, label, trend indicator
- Calendar heatmap: GitHub-style contribution grid
- Recent activity feed: Timeline layout with icons

**Buttons**:
- Primary: Bold, filled with backdrop-blur when on images
- Secondary: Outline style with glassmorphic hover
- Icon buttons: Circular with subtle background
- Padding: px-8 py-3 for primary, adjust for context

## Image Guidelines

**Hero Image** (Required):
- Full-width background: Inspirational education scene with soft gradient overlays
- Should depict modern learning environment with warm, focused lighting
- Aspect ratio: 16:9, optimized for various viewports

**Feature Section Images** (3 images):
- Icon-style illustrations for each feature
- Style: Line art with subtle gradients, consistent visual language
- Size: 200x200px, centered in cards

**Dashboard Mockup**:
- High-fidelity screenshot showing actual app interface
- Display: Progress graphs, learning streaks, achievement system
- Placement: Progress visualization section, left column
- Frame with subtle device mockup (optional)

**Background Textures**:
- Subtle gradient meshes for section backgrounds
- Low opacity, non-distracting patterns

## Animations
Use sparingly - only for meaningful interactions:
- Smooth transitions on card hovers (scale, shadow)
- Progress bar fill animations on scroll trigger
- Gentle float effect on glassmorphic elements
- Page transitions with fade

## Accessibility
- All glassmorphic overlays maintain readable contrast
- Form inputs have visible focus indicators
- Interactive elements minimum 44px touch target
- Skip navigation link for keyboard users

**Key Principle**: Every glassmorphic element should enhance, not obscure. Maintain clarity through careful opacity balancing and strategic blur application.