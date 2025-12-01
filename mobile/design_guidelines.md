# Design Guidelines: ደብተርLink – Smart Education Hub

## Authentication & Roles
**Multi-role platform** with JWT authentication:
- Super Admin, School Director/Principal, School Administrator, Teacher, Parent (multi-child switching), Student
- Flow: School code entry → Role selection → Credentials → Profile setup (first login)
- Secure encrypted token storage, forgot password recovery

## Navigation Architecture

**Bottom Tabs** (Students/Teachers/Parents): 4-5 tabs + FAB
- Teacher: Dashboard, Attendance, Messages, Resources, More
- Student: Home, Assignments, Results, Resources, Profile
- Parent: Overview, Messages, Reports, Calendar, Settings

**Drawer** (Directors/Admins): 280px width, categorized sections, profile header, branch selector

**Stack**: All details/modals with 300ms slide transitions (200ms fade for tabs)

## Design System

### Colors
**Role Primaries:** Teacher Blue `#2563EB`, Student Green `#10B981`, Parent Purple `#8B5CF6`, Director Gold `#D97706`  
**Semantics:** Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`, Info `#3B82F6`  
**Neutrals:** 
- Light: BG `#FFFFFF`, Surface `#F9FAFB`, Border `#E5E7EB`, Text `#111827`/`#6B7280`/`#9CA3AF`
- Dark: BG `#1F2937`, Surface `#111827`, Border `#374151`, Text `#F9FAFB`

### Typography
**Family:** System (SF Pro iOS, Roboto Android), Noto Sans Ethiopic for Amharic  
**Scale:** H1 32/Bold, H2 24/SemiBold, H3 20/SemiBold, H4 18/Medium, Body 16/Regular, Small 14/Regular, Caption 12/Regular

### Spacing
xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px

### Components

**Cards:** 16px radius, md padding, shadow {0,2}/opacity 0.05/radius 8, elevation 2 (Android)

**Buttons:**
- Primary: Role color BG, white text, 12px radius, 48px height, lg padding, opacity 0.8 pressed
- Secondary: Transparent BG, 2px role border, 0.1 opacity BG pressed
- FAB: 56x56, role color, 28px radius, 24px white icon, scale 0.95 pressed

**Form Inputs:** 48px height, 12px radius, 1px border (2px role color focused), md padding, red border + caption error

**List Items:** 72px (avatar) / 56px (text), md padding, 1px border-bottom, 40px circular avatar, 20px unread badge

**Tab Bar:** 60px + safe area, blur (iOS) / solid (Android), 24px icons, role color active

**Charts:** Smooth curves, 8px rounded bars, 12px stroke rings, role colors, small legend

**Avatars:** 32/40/64/96px, 50% radius, 2px white border (overlapping), initials on role color fallback

**Status Badges:** 24px height, 12px radius, sm padding, caption/semibold, semantic colors

**Skeleton:** Border color BG, 1.5s shimmer, 12px radius (cards) / 8px (text)

**Offline Banner:** Full-width top, 32px height, warning color, white small text, 16px WiFi icon

### Icons
**Feather icons** (@expo/vector-icons): 24px standard, 20px tabs, 16px inline. NO emojis.

### States

**Empty:** Lottie + H4 heading + body description + primary button  
**Loading:** Full-screen Lottie or inline skeleton matching layout  
**Error:** 48px alert circle (error color) + H4 + body + retry button  
**Offline:** Top banner + "Cached" badges + sync status icon + upload queue indicator

## Screen Specifications

### Core Screens

**Splash:** Full-screen Lottie (2-3s), auto-navigate, no safe area  
**Language:** 3 centered cards (flags), continue button, safe area: top `insets.top + xl`, bottom `insets.bottom + xl`  
**Login:** ScrollView form (school code → role → credentials), transparent header, remember me toggle, safe area: top/bottom `insets + xl`

**Teacher Dashboard:** 
- Header: Transparent, greeting "Good morning, Teacher [Name]", bell right, menu left
- Content: Today's schedule card, pending assignments, messages, behavior summary, announcements
- FAB: "Take Attendance" bottom-right
- Safe area: Top `headerHeight + xl`, bottom `tabBarHeight + xl + FAB clearance`

**Student Dashboard:**
- Header: Transparent, avatar left, bell right
- Content: Performance charts, assignments, grades, attendance ring, resource shortcuts
- Safe area: Top `headerHeight + xl`, bottom `tabBarHeight + xl`

**Parent Dashboard:**
- Header: Child switcher dropdown, bell right
- Content: Child performance charts, attendance graph, grades, behavior alerts, message teacher button
- Safe area: Top `headerHeight + xl`, bottom `tabBarHeight + xl`

**Director Dashboard:**
- Header: School logo, branch selector, settings right
- Content: Metrics cards with trends, attendance graphs, teacher status, complaints badge, branch comparison
- Safe area: Top/bottom `insets + xl` (drawer, no transparent header)

### Module Screens

**Take Attendance:** FlatList, class info, date selector, present/absent/late toggles, "Save" header right, offline indicator

**Assignment Upload:** Form (title, description, due date, files, classes, points), "Publish" header right, "Cancel" left

**View Assignment:** Details card, attached files, submission status, upload section, submit button, grade display

**Chat List:** FlatList, search in header, compose right, avatar/name/preview/timestamp/badge items

**Conversation:** Inverted FlatList, recipient header with info right, message bubbles, fixed bottom input bar (attach/voice/send), safe area: bottom `insets.bottom` on input

**Behavior Log:** Student selector, incident type, severity, description, date/time, action, notify parent toggle, "Save" header

**Submit Appeal:** Type, subject, description, evidence files, urgency, anonymity toggle, "Submit" header

**Resource Library:** Grid categories (Notes, Papers, Videos), search header, recently accessed

**Calendar:** Grid widget with event dots, upcoming list (color-coded), month selector, add event (admins)

**Timetable:** Horizontal week scroll or vertical list, time blocks, current class highlight, room/teacher names

**AI At-Risk Dashboard:** Alert cards, risk indicators (red/yellow/green), predicted factors, interventions, trend graphs

**Notifications:** Grouped FlatList by date, "Mark All Read" right, swipe dismiss, categories (Attendance, Grades, Messages, Behavior, Announcements)

## Accessibility

- **Contrast:** 4.5:1 normal text, 3:1 large (18px+)
- **Touch targets:** Minimum 44x44pt, 8px spacing
- **Screen readers:** Descriptive labels, form labels, image alt text, navigation announcements, role context
- **Localization:** Externalized strings, locale date/time, Ethiopian calendar formatting
- **Dark mode:** Auto-detect + manual toggle, role colors contrast-adjusted

## Platform-Specific

**iOS:** Blur nav/tabs, swipe-back, haptics (mark attendance, submit assignment), SF Pro  
**Android:** Material ripple, FAB primary actions, bottom sheets, Roboto

## Critical Assets

**Generate:**
1. App icon 1024x1024 (education symbol)
2. Splash logo SVG
3. Role avatars: 6 each (teacher/student/parent), flat illustration, diverse
4. Lottie: Splash (2-3s school theme), Loading (1.5s books/pencil), Success (1s checkmark), Empty states (assignments/messages/results)
5. Empty state illustrations: No attendance (calendar/clock), assignments (relaxing student), messages (inbox), behavior (happy student), resources (bookshelf), offline (broken connection)
6. Ethiopian calendar elements (month headers in Amharic/English/Oromo)

**DON'T generate:** Stock photos, decorative elements, cultural symbols without context, custom icons (use Feather)

## Offline-First UI
- Banner at top when disconnected
- Sync status icon in header
- "Cached" badges on content
- Upload queue indicator
- Toast on successful sync
- Progress during large syncs
- Error notification with retry

---
**Token Budget:** ~1950 tokens | All critical specs preserved for frontend implementation.