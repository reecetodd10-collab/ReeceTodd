# Next.js Migration Quick Reference
## Aviera Vite → Next.js 14 App Router

---

## 📊 Project Stats

- **Routes:** 18+ routes (11 marketing, 8 dashboard)
- **Components:** 40+ components
- **Pages:** 18 pages
- **Features:** 10+ major features
- **Lines of Code:** ~5,000+ lines (estimated)
- **Dependencies:** 6 production, 4 dev

---

## 🗺️ Route Mapping

### Marketing Routes (Public)
```
/                    → app/(marketing)/page.jsx
/smartstack-ai       → app/(marketing)/smartstack-ai/page.jsx
/smartfitt           → app/(marketing)/smartfitt/page.jsx
/shop                → app/(marketing)/shop/page.jsx
/learn               → app/(marketing)/learn/page.jsx
/reviews             → app/(marketing)/reviews/page.jsx
/about               → app/(marketing)/about/page.jsx
/faq                 → app/(marketing)/faq/page.jsx
/contact             → app/(marketing)/contact/page.jsx
/pricing             → app/(marketing)/pricing/page.jsx
```

### Dashboard Routes (Protected)
```
/dashboard           → app/dashboard/page.jsx
/dashboard/stack     → app/dashboard/stack/page.jsx (Premium)
/dashboard/fit       → app/dashboard/fit/page.jsx (Premium)
/dashboard/nutrition → app/dashboard/nutrition/page.jsx
/dashboard/progress  → app/dashboard/progress/page.jsx
/dashboard/achievements → app/dashboard/achievements/page.jsx
/dashboard/settings  → app/dashboard/settings/page.jsx
/dashboard/billing   → app/dashboard/billing/page.jsx
/dashboard/welcome   → app/dashboard/welcome/page.jsx
```

### Auth Routes (New)
```
/sign-in             → app/sign-in/[[...sign-in]]/page.jsx
/sign-up             → app/sign-up/[[...sign-up]]/page.jsx
```

---

## 🔄 Component Changes

### React Router → Next.js
```javascript
// OLD (React Router)
import { Link, useNavigate, useLocation } from 'react-router-dom';
const navigate = useNavigate();
const location = useLocation();
<Link to="/dashboard">Dashboard</Link>

// NEW (Next.js)
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
const router = useRouter();
const pathname = usePathname();
<Link href="/dashboard">Dashboard</Link>
```

### Client Components
Add `'use client'` directive to:
- All interactive components (buttons, forms, modals)
- Components using hooks (useState, useEffect, etc.)
- Components using Framer Motion
- Components accessing localStorage
- Dashboard components
- Gamification components

### Server Components (Default)
- Marketing pages (static content)
- Layouts (mostly)
- Static sections

---

## 🎨 Styling

### No Changes Needed
- ✅ Tailwind CSS (same config, update content paths)
- ✅ CSS Variables (move to `app/globals.css`)
- ✅ Global Styles (move to `app/globals.css`)
- ✅ Component Styles (same Tailwind classes)

### Content Paths Update
```javascript
// tailwind.config.js
content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
]
```

---

## 💾 Data Persistence

### localStorage Keys (Keep)
- `aviera_gamification` - Gamification data
- `aviera_user_stack` - User's supplement stack
- `aviera_checked_today` - Daily supplement checkboxes
- `aviera_workout_plan` - Workout plan data
- `aviera_notes` - Personal notes

### Future Migration
- Move to database (tied to Clerk user ID)
- API routes for data sync
- User-specific data per Clerk user

---

## 🔐 Authentication (Clerk)

### Setup Steps
1. Create `.env.local` with Clerk keys
2. Wrap app with `ClerkProvider` in root layout
3. Create sign-in/sign-up pages
4. Protect dashboard routes with middleware
5. Update navigation to show `UserButton`
6. Replace premium check with Clerk user data

### Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Middleware
```javascript
// middleware.js
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/about", "/pricing"],
  protectedRoutes: ["/dashboard"],
});
```

---

## 📦 Dependencies

### Keep
- ✅ `framer-motion` - Animations
- ✅ `lucide-react` - Icons
- ✅ `tailwindcss` - Styling
- ✅ `@clerk/nextjs` - Auth (already installed)

### Remove
- ❌ `react-router-dom` - Use Next.js routing
- ❌ `@vitejs/plugin-react` - Vite-specific
- ❌ `vite` - Using Next.js

### Add
- ⬆️ `next` - Next.js framework

---

## 🚀 Migration Phases

### Phase 1: Setup (2-4 hours)
- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Setup Tailwind CSS
- [ ] Create `.env.local`
- [ ] Setup ClerkProvider
- [ ] Migrate global styles

### Phase 2: Routes (4-6 hours)
- [ ] Create marketing route group
- [ ] Create dashboard route group
- [ ] Migrate all pages
- [ ] Create auth pages
- [ ] Setup middleware

### Phase 3: Components (6-8 hours)
- [ ] Update Navigation
- [ ] Update all Links
- [ ] Add `'use client'` directives
- [ ] Update hooks (useRouter, usePathname)
- [ ] Migrate all components

### Phase 4: Features (8-12 hours)
- [ ] Migrate gamification
- [ ] Migrate stack builder
- [ ] Migrate workout planner
- [ ] Migrate nutrition tracking
- [ ] Update premium gating
- [ ] Test all features

### Phase 5: Styling (2-4 hours)
- [ ] Verify Tailwind CSS
- [ ] Verify CSS variables
- [ ] Verify animations
- [ ] Test responsive design

### Phase 6: Testing (4-6 hours)
- [ ] Test all routes
- [ ] Test authentication
- [ ] Test premium gating
- [ ] Test localStorage
- [ ] Deploy to staging

**Total:** 26-40 hours (3-5 days)

---

## 🎯 Key Files to Migrate

### High Priority
1. `src/App.jsx` → `app/layout.jsx` + route structure
2. `src/pages/Dashboard.jsx` → `app/dashboard/layout.jsx` + `page.jsx`
3. `src/components/Navigation.jsx` → Update for Next.js
4. `src/components/premium/StackBuilder.jsx` → Add `'use client'`
5. `src/components/premium/WorkoutPlanner.jsx` → Add `'use client'`

### Medium Priority
6. All marketing pages → `app/(marketing)/**/page.jsx`
7. All dashboard pages → `app/dashboard/**/page.jsx`
8. All shared components → Update Links and hooks
9. All gamification components → Add `'use client'`

### Low Priority
10. Static data files → No changes needed
11. Utility functions → No changes needed
12. Custom hooks → No changes needed (mostly)

---

## ⚠️ Breaking Changes

### 1. Routing
- React Router → Next.js App Router
- `Link` component API changes
- `useNavigate` → `useRouter`
- `useLocation` → `usePathname`

### 2. Client Components
- Must add `'use client'` directive
- Cannot use server-only APIs in client components
- localStorage only works in client components

### 3. Image Optimization
- Should use Next.js `Image` component
- Better performance and optimization

### 4. Build Process
- Vite → Next.js build system
- Different output structure
- Server + static files

---

## ✅ Compatibility Checklist

### Works As-Is
- ✅ React hooks (useState, useEffect, etc.)
- ✅ Framer Motion animations
- ✅ Tailwind CSS classes
- ✅ CSS Variables
- ✅ localStorage (client components)
- ✅ Custom hooks
- ✅ Component logic
- ✅ Event handlers

### Needs Updates
- ⚠️ Routing (React Router → Next.js)
- ⚠️ Navigation (Link, useNavigate, useLocation)
- ⚠️ Client components (`'use client'` directive)
- ⚠️ Image tags (use Next.js Image)
- ⚠️ Environment variables (different syntax)

### New Features
- 🆕 Server components (static content)
- 🆕 API routes (future backend)
- 🆕 Server-side rendering (SEO)
- 🆕 Automatic code splitting
- 🆕 Image optimization

---

## 🔍 Testing Checklist

### Routes
- [ ] All marketing routes work
- [ ] All dashboard routes work
- [ ] Auth routes work (sign-in/sign-up)
- [ ] Redirects work
- [ ] 404 page works

### Authentication
- [ ] Sign-in works
- [ ] Sign-up works
- [ ] Protected routes require auth
- [ ] User button shows in navigation
- [ ] Logout works

### Features
- [ ] Gamification works
- [ ] Stack builder works
- [ ] Workout planner works
- [ ] Nutrition tracking works
- [ ] Water/sleep tracking works
- [ ] Notes system works
- [ ] Premium gating works

### Styling
- [ ] Dark theme works
- [ ] Responsive design works
- [ ] Animations work
- [ ] Glass morphism works
- [ ] CSS variables work

### Data
- [ ] localStorage persists
- [ ] Data loads correctly
- [ ] Data saves correctly
- [ ] No data loss

---

## 📝 Notes

### Current State
- **TESTING_MODE:** `true` (bypasses premium gates)
- **Auth:** None (preparing for Clerk)
- **Data:** All client-side (localStorage)
- **API:** None (static data only)

### Future Enhancements
- Backend API for user data
- Stripe integration for subscriptions
- Database for persistent storage
- Real-time sync for multi-device
- Server-side rendering for SEO

---

**Quick Reference End**

