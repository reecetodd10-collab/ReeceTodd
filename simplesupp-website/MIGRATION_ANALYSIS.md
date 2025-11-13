# Next.js 14 Migration Analysis
## Aviera Vite + React → Next.js 14 App Router

**Date:** 2024-11-04  
**Current Stack:** Vite + React 18 + React Router v6  
**Target Stack:** Next.js 14 + App Router + Clerk Auth

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Routes & Pages](#routes--pages)
3. [Components](#components)
4. [Features](#features)
5. [Styling & Design System](#styling--design-system)
6. [State Management](#state-management)
7. [Data Persistence](#data-persistence)
8. [Dependencies](#dependencies)
9. [Migration Mapping](#migration-mapping)
10. [Key Considerations](#key-considerations)

---

## 1. Project Overview

### Current Architecture
- **Build Tool:** Vite 5.0.8
- **Framework:** React 18.2.0
- **Routing:** React Router DOM v6.20.0
- **Styling:** Tailwind CSS 3.4.0 + Custom CSS Variables
- **Animations:** Framer Motion 10.16.16
- **Icons:** Lucide React 0.294.0
- **Auth:** None (preparing for Clerk)
- **State:** React hooks + localStorage

### Project Structure
```
src/
├── main.jsx              # Entry point (ReactDOM.createRoot)
├── App.jsx               # Root router component
├── index.css             # Global styles + design system
├── components/           # Reusable components
├── pages/                # Route pages
├── hooks/                # Custom React hooks
├── lib/                  # Utilities & data
└── data/                 # Static data files
```

---

## 2. Routes & Pages

### Marketing Routes (Public)
These routes use `<MarketingLayout>` wrapper with Navigation + Footer:

| Route | Page Component | Description |
|-------|----------------|-------------|
| `/` | `Home.jsx` | Landing page with hero, features, CTA |
| `/smartstack-ai` | `SmartStackAI.jsx` | Stack builder marketing page |
| `/smartfitt` | `SmartFitt.jsx` | Workout planner marketing page |
| `/shop` | `Shop.jsx` | Product shop page |
| `/learn` | `Learn.jsx` | Educational content |
| `/reviews` | `Reviews.jsx` | User testimonials |
| `/about` | `About.jsx` | About page |
| `/faq` | `FAQ.jsx` | FAQ accordion |
| `/contact` | `Contact.jsx` | Contact form |
| `/pricing` | `Pricing.jsx` | Pricing plans |
| `/suppstack-ai` | Redirect to `/smartstack-ai` | Legacy route redirect |

### Dashboard Routes (Protected)
These routes are nested under `/dashboard/*` and use the Dashboard layout:

| Route | Page Component | Description | Premium? |
|-------|----------------|-------------|----------|
| `/dashboard` | `Dashboard.jsx` (Overview) | Dashboard overview with habit rings | No |
| `/dashboard/stack` | `StackBuilder.jsx` | Supplement stack builder | **Yes** |
| `/dashboard/fit` | `WorkoutPlanner.jsx` | Workout planner | **Yes** |
| `/dashboard/nutrition` | `Nutrition.jsx` | Nutrition tracking | No |
| `/dashboard/progress` | `Progress.jsx` | Progress stats & charts | No |
| `/dashboard/achievements` | `Achievements.jsx` | Achievement badges | No |
| `/dashboard/settings` | `Settings.jsx` | User settings | No |
| `/dashboard/billing` | `Billing.jsx` | Billing & subscription | No |
| `/dashboard/welcome` | `Welcome.jsx` | Welcome/onboarding | No |

### Next.js App Router Mapping
```
app/
├── layout.jsx                    # Root layout (ClerkProvider)
├── page.jsx                      # Home page (/)
├── (marketing)/                  # Marketing route group
│   ├── layout.jsx                # MarketingLayout (Nav + Footer)
│   ├── smartstack-ai/
│   │   └── page.jsx
│   ├── smartfitt/
│   │   └── page.jsx
│   ├── shop/
│   │   └── page.jsx
│   ├── learn/
│   │   └── page.jsx
│   ├── reviews/
│   │   └── page.jsx
│   ├── about/
│   │   └── page.jsx
│   ├── faq/
│   │   └── page.jsx
│   ├── contact/
│   │   └── page.jsx
│   └── pricing/
│       └── page.jsx
├── dashboard/
│   ├── layout.jsx                # Dashboard layout (Sidebar)
│   ├── page.jsx                  # Overview
│   ├── stack/
│   │   └── page.jsx              # Stack Builder
│   ├── fit/
│   │   └── page.jsx              # Workout Planner
│   ├── nutrition/
│   │   └── page.jsx
│   ├── progress/
│   │   └── page.jsx
│   ├── achievements/
│   │   └── page.jsx
│   ├── settings/
│   │   └── page.jsx
│   ├── billing/
│   │   └── page.jsx
│   └── welcome/
│       └── page.jsx
├── sign-in/
│   └── [[...sign-in]]/
│       └── page.jsx              # Clerk sign-in
└── sign-up/
    └── [[...sign-up]]/
        └── page.jsx              # Clerk sign-up
```

---

## 3. Components

### Shared Components (`src/components/shared/`)
- **Button.jsx** - Primary, secondary, tertiary, icon variants
- **GlassCard.jsx** - Glass morphism card with hover effects
- **Modal.jsx** - Reusable modal with animations
- **Tooltip.jsx** - Hover tooltip component
- **UpgradePrompt.jsx** - Premium upgrade modal

### Navigation Components
- **Navigation.jsx** - Main navigation (marketing pages)
- **Footer.jsx** - Footer component
- **PillLogo.jsx** - Brand logo component

### Dashboard Components (`src/components/dashboard/`)
- **NotesWidget.jsx** - Dashboard notes widget
- **AddNoteModal.jsx** - Add note modal

### Gamification Components (`src/components/gamification/`)
- **HabitRings.jsx** - Circular progress rings (Apple Watch style)
- **StreakCounter.jsx** - Streak tracking display
- **XPDisplay.jsx** - XP & level display
- **LevelBadge.jsx** - Level badge component
- **AchievementCard.jsx** - Achievement badge card
- **WeeklySummary.jsx** - Weekly stats summary
- **WeeklyInsightsExpanded.jsx** - Expanded weekly insights
- **EnhancedGoalsChecklist.jsx** - Daily goals checklist

### Nutrition Components (`src/components/nutrition/`)
- **MacroRings.jsx** - Macro tracking rings
- **MacroInput.jsx** - Macro input form
- **MealChecklist.jsx** - Meal check-in component
- **WeeklyNutritionInsights.jsx** - Nutrition insights

### Tracking Components (`src/components/tracking/`)
- **WaterTracker.jsx** - Water intake tracker
- **SleepTracker.jsx** - Sleep quality tracker

### Premium Components (`src/components/premium/`)
- **StackBuilder.jsx** - Supplement stack builder (952 lines)
- **WorkoutPlanner.jsx** - Workout planner (1283 lines)
- **AIChat.jsx** - AI chat widget
- **Reassessment.jsx** - Goal reassessment modal
- **ReassessmentForm.jsx** - Reassessment form

### Marketing Components
- **GoalCards.jsx** - Goal selection cards
- **ContactForm.jsx** - Contact form
- **EmailCapture.jsx** - Email capture form
- **FAQAccordion.jsx** - FAQ accordion
- **PromoBanner.jsx** - Promotional banner
- **SectionIndicators.jsx** - Section navigation indicators
- **StackedBlocks.jsx** - Decorative stacked blocks
- **ParallaxLayer.jsx** - Parallax effect component

### Workout Components (`src/components/workout/`)
- **WorkoutFeedbackModal.jsx** - Post-workout feedback modal

### Special Components
- **SupplementQuiz.jsx** - Quiz component (root level)

---

## 4. Features

### Core Features

#### 1. **Gamification System**
- **XP System:** Earn XP for actions (supplements, workouts, PRs, streaks)
- **Level System:** 30+ levels with tiers (Beginner, Novice, Intermediate, Advanced, Elite)
- **Achievement Badges:** Unlockable badges for milestones
- **Streak Tracking:** Daily streak counter with history
- **Habit Rings:** Apple Watch-style progress rings
- **Data Storage:** `localStorage` key: `aviera_gamification`

#### 2. **Stack Builder** (Premium)
- Drag-and-drop supplement stack
- Daily supplement tracking (checkboxes)
- Notification settings (reminders)
- AI stack optimization (placeholder)
- Supplement tooltips (benefits, dosage, research)
- XP rewards for taking supplements
- Data Storage: `localStorage` keys: `aviera_user_stack`, `aviera_checked_today`

#### 3. **Workout Planner** (Premium)
- Custom workout plans
- Exercise tracking (sets, reps, weight)
- Progressive overload tracking
- PR detection
- Workout completion tracking
- Exercise tooltips (muscles, type, difficulty, form tips)
- Post-workout feedback modal
- XP rewards for completing workouts
- Data Storage: `localStorage` key: `aviera_workout_plan`

#### 4. **Nutrition Tracking**
- Macro rings (protein, carbs, fats)
- Daily macro goals
- Meal check-ins (breakfast, lunch, dinner, pre/post workout)
- Weekly nutrition insights
- XP rewards for hitting macros
- Data Storage: `localStorage` (within `aviera_gamification.nutrition`)

#### 5. **Water & Sleep Tracking**
- Water intake tracker (8 glasses goal)
- Sleep quality tracker (yes/no)
- XP rewards for goals
- Data Storage: `localStorage` (within `aviera_gamification`)

#### 6. **Daily Goals & Insights**
- Enhanced daily goals checklist
- Weekly insights expanded view
- Consistency score calculation
- Progress visualization
- Data Storage: `localStorage` (within `aviera_gamification`)

#### 7. **Notes System**
- Personal notes widget
- Tag-based organization
- Quick add modal
- Data Storage: `localStorage` key: `aviera_notes`

#### 8. **AI Chat Widget** (Premium)
- AI chat interface (placeholder)
- Available on all dashboard pages
- Data Storage: N/A (future API integration)

#### 9. **Premium Gating**
- Testing mode (`TESTING_MODE` in `config.js`)
- Premium access check (`hasPremiumAccess()`)
- Upgrade prompts for non-premium users
- Feature gates for Stack Builder and Workout Planner

#### 10. **Reassessment Flow**
- Goal reassessment modal
- Update user goals
- Data Storage: `localStorage` (within user data)

### Marketing Features
- Hero section with CTA
- Feature sections (Aviera Stack, Aviera Fit, Aviera Shop)
- Goals selection
- Reviews/testimonials
- FAQ accordion
- Contact form
- Pricing page
- Email capture

---

## 5. Styling & Design System

### Tailwind CSS Configuration
- **Config File:** `tailwind.config.js`
- **Custom Colors:**
  - Charcoal: `#0a0a0a`, `#1a1a1a`
  - Accent: `#3b82f6` (blue), `#ef4444` (red), `#10b981` (green)
  - Gray scale: `#f5f5f5`, `#e5e5e5`, `#a0a0a0`
- **Custom Font:** Inter (Google Fonts)
- **Content Paths:** `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`

### CSS Variables (Design System)
Defined in `src/index.css`:

#### Colors
- `--bg`: `#0a0a0a` (dark canvas)
- `--bg-elev-1`: `#1a1a1a` (elevated background)
- `--bg-elev-2`: `#242424` (higher elevation)
- `--txt`: `#ffffff` (primary text)
- `--txt-secondary`: `#e5e5e5` (secondary text)
- `--txt-muted`: `#a0a0a0` (muted text)
- `--acc`: `#06b6d4` (primary cyan - **updated from blue**)
- `--acc-hover`: `#0891b2` (hover state)
- `--success`: `#10b981` (success green)
- `--warning`: `#f59e0b` (warning orange)
- `--error`: `#ef4444` (error red)

#### Glass Morphism
- `--glass-bg`: `rgba(255, 255, 255, 0.05)`
- `--glass-blur`: `12px`
- `--glass-saturate`: `180%`
- `--glass-border`: `rgba(255, 255, 255, 0.1)`
- `--glass-shadow`: `0 8px 32px rgba(0, 0, 0, 0.2)`

#### Border Radius
- `--radius-sm`: `8px` (small elements)
- `--radius-md`: `12px` (medium cards)
- `--radius-lg`: `16px` (large cards)
- `--radius-xl`: `20px` (modals)

#### Spacing (8px Grid)
- `--space-1`: `8px`
- `--space-2`: `16px`
- `--space-3`: `24px`
- `--space-4`: `32px`
- `--space-5`: `40px`
- `--space-6`: `48px`

#### Shadows
- `--shadow-sm`: `0 2px 8px rgba(0, 0, 0, 0.1)`
- `--shadow-md`: `0 4px 16px rgba(0, 0, 0, 0.15)`
- `--shadow-lg`: `0 8px 32px rgba(0, 0, 0, 0.2)`
- `--shadow-xl`: `0 16px 48px rgba(0, 0, 0, 0.3)`

### Global Styles
- Button styles (`.btn-primary`, `.btn-secondary`, `.btn-tertiary`, `.btn-icon`)
- Form input styles
- Glass card styles (`.glass-card`)
- Skeleton loading styles
- Toast notification styles
- Badge styles
- Status dot styles
- Mobile optimizations
- Accessibility enhancements (`prefers-reduced-motion`)

### Animations
- **Framer Motion:** Used throughout for animations
- Page transitions (fade-in)
- Button interactions (hover, active, ripple)
- Card hover states (lift, shadow)
- Modal animations (scale + fade)
- Loading states (skeleton screens)
- Success animations (checkmark, confetti)
- Scroll animations (fade-in elements)

---

## 6. State Management

### React Hooks
- **useState:** Component-level state
- **useEffect:** Side effects, data loading
- **useRef:** DOM references, drag-and-drop
- **useCallback:** Memoized callbacks
- **useLocation:** React Router location (needs Next.js `usePathname`)
- **useNavigate:** React Router navigation (needs Next.js `useRouter`)

### Custom Hooks
- **useGamification.js:** Gamification logic (XP, achievements)
- **useParallax.js:** Parallax scrolling effects
- **useScrollAnimation.js:** Scroll-triggered animations

### Global State
- **No Context API:** Currently using prop drilling and localStorage
- **No Redux/Zustand:** Local state + localStorage only

### Data Flow
1. **Component State:** `useState` for UI state
2. **localStorage:** Persistent data (gamification, stack, workouts, notes)
3. **Props:** Data passing between components
4. **Custom Hooks:** Shared logic (gamification)

---

## 7. Data Persistence

### localStorage Keys
- `aviera_gamification` - Gamification data (XP, levels, streaks, achievements, water, sleep, nutrition)
- `aviera_user_stack` - User's supplement stack
- `aviera_checked_today` - Daily supplement checkboxes
- `aviera_workout_plan` - Workout plan data
- `aviera_notes` - Personal notes

### Data Structures

#### Gamification Data
```javascript
{
  totalXP: 847,
  currentLevel: 8,
  xpToNextLevel: 153,
  currentStreak: 7,
  longestStreak: 14,
  lastCompletionDate: "2024-11-04",
  today: {
    date: "2024-11-04",
    supplementsTaken: 5,
    supplementsTotal: 6,
    workoutComplete: true,
    xpEarned: 85
  },
  history: [...],
  unlockedBadges: [...],
  personalRecords: [...],
  water: {...},
  sleep: {...},
  nutrition: {...},
  workoutFeedback: [...]
}
```

#### User Stack
```javascript
{
  supplements: [
    {
      id: "...",
      name: "...",
      dosage: "...",
      time: "...",
      notifications: {...}
    }
  ]
}
```

#### Workout Plan
```javascript
{
  weeks: [
    {
      days: [
        {
          day: "Monday",
          exercises: [...],
          completed: false
        }
      ]
    }
  ],
  currentWeekIndex: 0
}
```

### Migration Considerations
- **Client-side only:** All data in localStorage
- **No API calls:** Static data only (supplements, exercises)
- **Future:** Will need backend API for user data sync
- **Clerk Integration:** User data will be tied to Clerk user ID

---

## 8. Dependencies

### Production Dependencies
```json
{
  "@clerk/nextjs": "^6.34.5",        // ⚠️ Already installed (for Next.js)
  "framer-motion": "^10.16.16",      // ✅ Keep (animations)
  "lucide-react": "^0.294.0",        // ✅ Keep (icons)
  "react": "^18.2.0",                // ✅ Keep (Next.js uses React)
  "react-dom": "^18.2.0",            // ✅ Keep (Next.js uses React DOM)
  "react-router-dom": "^6.20.0"      // ❌ Remove (Next.js has routing)
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.1",  // ❌ Remove (Vite-specific)
  "autoprefixer": "^10.4.16",        // ✅ Keep (Tailwind)
  "postcss": "^8.4.32",              // ✅ Keep (Tailwind)
  "tailwindcss": "^3.4.0",           // ✅ Keep (styling)
  "vite": "^5.0.8"                   // ❌ Remove (using Next.js)
}
```

### Next.js Dependencies to Add
```json
{
  "next": "^14.0.0",                 // ⬆️ Add (Next.js framework)
  "@clerk/nextjs": "^6.34.5",        // ✅ Already installed
  "react": "^18.2.0",                // ✅ Keep
  "react-dom": "^18.2.0"             // ✅ Keep
}
```

---

## 9. Migration Mapping

### File Structure Mapping

#### Current (Vite) → Next.js (App Router)
```
src/main.jsx                    → app/layout.jsx (root layout)
src/App.jsx                     → app/ (route structure)
src/index.css                   → app/globals.css
src/pages/*.jsx                 → app/**/page.jsx
src/components/**/*.jsx         → components/**/*.jsx (no change)
src/hooks/**/*.js               → hooks/**/*.js (no change)
src/lib/**/*.js                 → lib/**/*.js (no change)
src/data/**/*.js                → data/**/*.js (no change)
index.html                      → app/layout.jsx (metadata)
vite.config.js                  → next.config.js
tailwind.config.js              → tailwind.config.js (update paths)
postcss.config.js               → postcss.config.js (no change)
```

### Component Changes

#### Navigation Components
- **React Router `Link`** → **Next.js `Link`** (from `next/link`)
- **React Router `useNavigate`** → **Next.js `useRouter`** (from `next/navigation`)
- **React Router `useLocation`** → **Next.js `usePathname`** (from `next/navigation`)

#### Page Components
- **Functional components** → **Same** (React components work in Next.js)
- **Client components** → **Add `'use client'` directive** (for interactivity)
- **Server components** → **Default** (static content can be server components)

#### Layout Components
- **MarketingLayout** → **app/(marketing)/layout.jsx**
- **Dashboard Layout** → **app/dashboard/layout.jsx**
- **Root Layout** → **app/layout.jsx** (with ClerkProvider)

### Route Changes

#### React Router → Next.js App Router
```javascript
// Current (React Router)
<Routes>
  <Route path="/dashboard/*" element={<Dashboard />} />
  <Route path="/" element={<MarketingLayout><Home /></MarketingLayout>} />
</Routes>

// Next.js (App Router)
app/
  dashboard/
    layout.jsx    # Dashboard layout
    page.jsx      # Dashboard overview
  (marketing)/
    layout.jsx    # Marketing layout
    page.jsx      # Home page
```

### State Management Changes
- **No changes needed:** React hooks work the same
- **localStorage:** Still works (client-side only)
- **Custom hooks:** No changes needed
- **Future:** Consider adding Context API or Zustand for global state

### Styling Changes
- **Tailwind CSS:** Same configuration (update content paths)
- **CSS Variables:** Move to `app/globals.css`
- **Global Styles:** Move to `app/globals.css`
- **Component Styles:** Same (Tailwind classes)

### Data Fetching Changes
- **Currently:** Client-side only (localStorage, static data)
- **Next.js:** Can add server components for static data
- **Future:** API routes for backend integration

---

## 10. Key Considerations

### Authentication (Clerk)
- **Already installed:** `@clerk/nextjs` v6.34.5
- **Need to:**
  - Create `.env.local` with API keys
  - Wrap app with `ClerkProvider`
  - Create sign-in/sign-up pages
  - Protect dashboard routes with middleware
  - Update navigation to show user button
  - Replace premium check with Clerk user data

### Premium Gating
- **Current:** `TESTING_MODE` in `config.js`
- **Migration:** Keep testing mode, add Clerk user check
- **Future:** Stripe integration for subscriptions
- **Logic:** `hasPremiumAccess(userIsPremium)` → Check Clerk user metadata

### localStorage Migration
- **Current:** Client-side only
- **Migration:** Keep localStorage for now (client components)
- **Future:** Move to database (tied to Clerk user ID)
- **Consideration:** User data will be per-user (Clerk user ID)

### Client vs Server Components
- **Client Components:** Interactive components (buttons, forms, animations)
  - Add `'use client'` directive
  - Stack Builder, Workout Planner, Gamification components
- **Server Components:** Static content (marketing pages)
  - No directive needed (default)
  - Home, About, FAQ, Pricing pages

### Performance Optimizations
- **Code Splitting:** Next.js handles automatically
- **Image Optimization:** Use Next.js `Image` component
- **Font Optimization:** Use Next.js `next/font` for Inter
- **Static Generation:** Marketing pages can be statically generated
- **Dynamic Routes:** Dashboard pages are dynamic (require auth)

### Environment Variables
- **Current:** None (all client-side)
- **Next.js:** `.env.local` for Clerk keys
- **Future:** API keys, database URLs, Stripe keys

### Build & Deployment
- **Current:** Vite build → static files
- **Next.js:** Next.js build → server + static files
- **Deployment:** Vercel (recommended for Next.js) or custom server

### Testing Mode
- **Keep:** `TESTING_MODE` flag for development
- **Location:** `lib/config.js` → Move to environment variable or keep in config
- **Purpose:** Bypass premium gates during development

### Breaking Changes
1. **React Router → Next.js Router:** All navigation needs updating
2. **BrowserRouter:** Not needed (Next.js handles routing)
3. **Route Components:** Need to be page components or layouts
4. **Client Components:** Need `'use client'` directive
5. **Image Tags:** Should use Next.js `Image` component
6. **Link Components:** Need to use Next.js `Link`

### Non-Breaking (Compatible)
1. **React Hooks:** Work the same
2. **Framer Motion:** Works the same
3. **Tailwind CSS:** Works the same
4. **CSS Variables:** Work the same
5. **localStorage:** Works the same (client-side)
6. **Custom Hooks:** Work the same
7. **Component Logic:** Mostly the same

---

## 11. Migration Checklist

### Phase 1: Setup
- [ ] Create Next.js 14 project
- [ ] Install dependencies (framer-motion, lucide-react, tailwindcss)
- [ ] Setup Tailwind CSS configuration
- [ ] Create `.env.local` with Clerk keys
- [ ] Setup ClerkProvider in root layout
- [ ] Migrate global styles to `app/globals.css`

### Phase 2: Routes & Pages
- [ ] Create marketing route group `(marketing)/`
- [ ] Create marketing layout with Navigation + Footer
- [ ] Migrate all marketing pages (Home, About, FAQ, etc.)
- [ ] Create dashboard route group `dashboard/`
- [ ] Create dashboard layout with Sidebar
- [ ] Migrate all dashboard pages
- [ ] Create sign-in/sign-up pages
- [ ] Setup middleware for route protection

### Phase 3: Components
- [ ] Update Navigation component (Next.js Link, usePathname)
- [ ] Update all Link components to Next.js Link
- [ ] Add `'use client'` to interactive components
- [ ] Update useNavigate → useRouter
- [ ] Update useLocation → usePathname
- [ ] Migrate all shared components
- [ ] Migrate all feature components

### Phase 4: Features
- [ ] Migrate gamification system
- [ ] Migrate stack builder
- [ ] Migrate workout planner
- [ ] Migrate nutrition tracking
- [ ] Migrate water & sleep tracking
- [ ] Migrate notes system
- [ ] Update premium gating with Clerk
- [ ] Test all features

### Phase 5: Styling & Polish
- [ ] Verify Tailwind CSS works
- [ ] Verify CSS variables work
- [ ] Verify animations work
- [ ] Test responsive design
- [ ] Test dark theme
- [ ] Verify accessibility

### Phase 6: Testing & Deployment
- [ ] Test all routes
- [ ] Test authentication flow
- [ ] Test premium gating
- [ ] Test localStorage persistence
- [ ] Test mobile responsiveness
- [ ] Deploy to Vercel (or custom server)
- [ ] Verify production build

---

## 12. Estimated Migration Time

### Quick Estimate
- **Phase 1 (Setup):** 2-4 hours
- **Phase 2 (Routes):** 4-6 hours
- **Phase 3 (Components):** 6-8 hours
- **Phase 4 (Features):** 8-12 hours
- **Phase 5 (Styling):** 2-4 hours
- **Phase 6 (Testing):** 4-6 hours

**Total:** 26-40 hours (3-5 days)

### Complexity Factors
- **Large Components:** StackBuilder (952 lines), WorkoutPlanner (1283 lines)
- **Many Routes:** 18+ routes to migrate
- **localStorage:** Need to ensure data persistence
- **Premium Gating:** Need to integrate with Clerk
- **Animations:** Framer Motion should work, but need to test
- **Testing Mode:** Need to preserve during migration

---

## 13. Next Steps

1. **Review this analysis** with the team
2. **Create Next.js project** in a new branch
3. **Start with Phase 1** (setup)
4. **Migrate incrementally** (one route at a time)
5. **Test thoroughly** after each phase
6. **Deploy to staging** before production

---

## 14. Questions & Notes

### Questions to Resolve
1. **Database:** When will backend API be ready?
2. **Stripe:** When will Stripe integration be added?
3. **User Data:** How will we migrate existing localStorage data?
4. **Testing:** Do we need to preserve TESTING_MODE?
5. **Deployment:** Vercel or custom server?

### Notes
- **Clerk is already installed** but not configured
- **All data is client-side** (localStorage)
- **No API calls** currently (all static data)
- **Premium features** are gated but not enforced (TESTING_MODE = true)
- **Design system** is well-defined and should transfer easily
- **Animations** are extensive (Framer Motion throughout)

---

**End of Migration Analysis**

