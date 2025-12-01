# Design Guidelines for ደብተરLink – Smart Education Hub

## Design Approach

**Selected Framework**: Linear + Notion hybrid with Stripe's sophistication
- Linear's clean dashboard aesthetics and data visualization
- Notion's intuitive content organization and hierarchy
- Stripe's premium polish and attention to detail

This enterprise education platform demands clarity, data density, and visual elegance to serve diverse user roles effectively.

---

## Typography System

**Primary Font**: Inter (Google Fonts)
- Headings: 600-700 weight
- Body: 400-500 weight
- Data/Numbers: 500-600 weight (tabular figures)

**Secondary Font**: Space Grotesk (for brand elements, Ethiopian calendar)

**Scale**:
- Hero/Page Titles: text-4xl to text-5xl
- Section Headers: text-2xl to text-3xl
- Card Titles: text-lg to text-xl
- Body Text: text-base
- Captions/Labels: text-sm
- Micro-text: text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Compact spacing: gap-2, p-4
- Standard spacing: gap-4, p-6, p-8
- Generous spacing: gap-8, p-12, p-16, py-24

**Container Strategy**:
- Dashboard layouts: max-w-7xl with full-width sidebar
- Content areas: max-w-6xl
- Forms: max-w-2xl
- Modals: max-w-3xl

---

## Dashboard Architecture

### Navigation Structure

**Sidebar Navigation** (all role dashboards):
- Fixed left sidebar, w-64 on desktop
- Collapsible on tablet/mobile
- Logo at top (80px height)
- Primary nav items with icons (Heroicons)
- Role badge indicator
- School switcher (for multi-tenant users)
- User profile at bottom

**Top Bar**:
- Fixed header with backdrop blur
- Breadcrumb navigation
- Global search (⌘K shortcut)
- Notification bell with badge counter
- Quick actions dropdown
- Language/calendar toggle
- User avatar with dropdown

### Grid Layouts

**Dashboard Cards**: 
- 3-column grid on desktop (grid-cols-3)
- 2-column on tablet (md:grid-cols-2)
- Single column on mobile
- Gap-6 between cards

**Data Tables**:
- Full-width with horizontal scroll
- Sticky headers
- Alternating row treatment
- Inline actions on hover
- Sortable columns with indicators

**Stat Cards**:
- 4-column layout (grid-cols-4) for metrics
- Large numbers (text-3xl, font-semibold)
- Small trend indicators
- Icon in top-right corner
- Compact padding (p-6)

---

## Component Library

### Cards
- Rounded corners: rounded-lg
- Subtle elevation: shadow-sm with hover:shadow-md
- Border treatment for separation
- Header area with title and actions
- Content padding: p-6
- Footer for supplementary info

### Buttons
**Primary Actions**:
- Prominent size: px-6 py-3
- Medium weight text: font-medium
- Rounded: rounded-md
- Shadow on hover

**Secondary Actions**:
- Border treatment
- px-4 py-2
- Subtle hover state

**Icon Buttons**:
- Square: p-2
- Circular for floating actions
- Hover state with background

**Button Groups**:
- Segmented controls for toggles
- Connected buttons for related actions

### Forms
- Label above input (text-sm, font-medium)
- Input height: h-10 to h-12
- Consistent padding: px-4
- Rounded: rounded-md
- Border focus states
- Error states with text-sm helper text
- Success validation indicators
- Required field asterisks

### Data Visualization
- Chart.js or Recharts for graphs
- Clean axis labels (text-xs)
- Grid lines for readability
- Tooltips on hover
- Legend positioning (top-right or bottom)
- Responsive sizing

### Messaging Interface
- Chat bubble design (rounded-2xl)
- Sent messages align right
- Received messages align left
- Timestamp (text-xs, opacity-70)
- Read receipts with checkmarks
- File attachment preview cards
- Voice note waveforms

### Tables
- Header: font-medium, text-sm, uppercase tracking
- Cells: p-4 padding
- Zebra striping for rows
- Hover state for entire row
- Action column (right-aligned)
- Pagination controls at bottom
- Rows per page selector

### Modals & Overlays
- Backdrop with opacity-50
- Modal: rounded-lg, max-w-2xl
- Header with close button (top-right)
- Content padding: p-6
- Footer with action buttons (right-aligned)
- Smooth enter/exit transitions

### Status Indicators
- Badge components: px-3 py-1, rounded-full, text-xs
- Status dots (w-2 h-2, rounded-full) next to text
- Progress bars for loading states
- Notification badges on icons

### Calendar Components
- Dual calendar view (Ethiopian/Gregorian)
- Month grid with proper spacing
- Event indicators as dots
- Today highlighting
- Selected date treatment
- Date picker modal

---

## Role-Specific Dashboard Designs

### Super Admin Dashboard
- 4-column metric grid at top (schools, users, revenue, activity)
- School list with status cards below
- Global analytics charts (2-column layout)
- Recent activity feed (sidebar panel)
- Quick action buttons (prominently placed)

### Director/Principal Dashboard
- School overview hero card (full-width)
- 3-column key metrics (attendance %, grades, behavior)
- Charts row: Attendance trends + Grade distribution
- Recent appeals/complaints panel
- Upcoming events calendar widget
- Teacher performance table

### Teacher Dashboard
- Today's schedule card (prominent)
- Class-wise attendance widgets (grid-cols-3)
- Pending assignments counter
- Recent student submissions list
- Quick messaging access
- Resource upload zone

### Student Dashboard
- Welcome card with student photo
- 2-column layout: Assignments + Grades
- Calendar with exam dates
- Behavior score widget
- Recent announcements
- Learning resources grid

### Parent Dashboard
- Child selector dropdown (top)
- Child attendance card with chart
- Grades overview (subject-wise)
- Behavior updates timeline
- Messaging with teachers
- Upcoming parent-teacher meetings

### Administrator Dashboard
- User management table (full-width)
- Class/Section quick stats (grid-cols-4)
- Timetable management interface
- Data import/export tools
- System logs viewer

---

## Special Features Design

### AI Prediction Alerts
- Alert card with warning icon
- Student name and prediction type
- Confidence score (percentage)
- Suggested actions list
- "Take Action" button
- Dismissible design

### Appeal Workflow
- Stepper component showing stages
- Status badge (color-coded)
- Timeline view with comments
- Document attachments section
- Escalation button
- Resolution form

### Offline Mode Indicator
- Floating notification banner (top)
- Sync status icon
- Queued items counter
- Manual sync trigger button

### Multi-School Switcher
- Dropdown menu with school logos
- Current school highlighted
- Search filter for many schools
- "View All Schools" link

---

## Animations & Interactions

**Minimal, Purposeful Motion**:
- Smooth page transitions (200ms)
- Card hover elevation (300ms ease)
- Dropdown menus: slide + fade
- Modal entrance: scale(0.95) to scale(1)
- Loading states: subtle pulse
- Chart animations: stagger on load
- NO parallax, NO scroll-triggered reveals

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, stacked)
- Tablet: 768px - 1024px (2-column grids, collapsed sidebar)
- Desktop: > 1024px (full layout)

**Mobile Adaptations**:
- Bottom tab navigation replacing sidebar
- Hamburger menu for secondary nav
- Single-column cards
- Swipeable tables
- Fullscreen modals
- Floating action button for primary actions

---

## Images

**Landing/Marketing Pages** (if applicable):
- Hero Section: Large hero image (1920x1080) showing Ethiopian students using technology in classroom, 60vh height, subtle overlay for text readability
- Feature Section: 3 supporting images (600x400) showing dashboard interfaces, teachers using app, parent-student interaction
- Testimonial Section: Circular headshots (120x120) of school directors/teachers with names and schools

**Dashboard Areas**:
- User avatars throughout (40x40 for list views, 96x96 for profiles)
- School logos in multi-tenant switcher (64x64)
- Empty states with illustrations (400x300)
- Document preview thumbnails (80x80)

All images use rounded corners (rounded-lg for cards, rounded-full for avatars).