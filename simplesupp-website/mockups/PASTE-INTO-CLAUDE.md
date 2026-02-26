# Aviera Codebase Context - Paste This Into Claude

I'm uploading my full codebase zip (aviera-codebase.zip). Here's everything you need to know:

## Repo & Deployment
- **Repo:** https://github.com/reecetodd10-collab/ReeceTodd
- **Project path:** `simplesupp-website/nextjs/`
- **Deploys:** Auto-deploy to Vercel on push to main
- **Live site:** avierafit.com

## Tech Stack
- Next.js 14 (App Router) - all pages in `/app`
- React 18 - client components use `'use client'`
- Tailwind CSS + CSS custom properties in `globals.css`
- Framer Motion for animations
- Lucide React for icons

## Services & Integrations
- **Shopify Storefront API** (GraphQL) + Buy SDK for cart/checkout
  - Key file: `lib/shopify.js`
  - Functions: `addToCart()`, `addMultipleToCart()`, `getCheckoutUrl()`, `fetchShopifyProducts()`, `fuzzyMatchProduct()`
- **Clerk** for user auth (sign-up/sign-in)
- **Supabase** (PostgreSQL) for data
  - Tables: `supplement_optimization_results`, `newsletters`, `newsletter_subscribers`, `promo_subscribers`, `pro_waitlist`, `users`, `user_progress`, `user_stacks`, `workouts`
- **OpenAI GPT-4.1** for AI features (uses `max_completion_tokens` param)
- **Stripe** for billing/subscriptions
- **Resend** for transactional emails

## All Routes (Pages)

### Public Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `page.js` | Root redirect |
| `/home` | `home/page.js` | Main landing page - hero, products, trust badges |
| `/about` | `about/page.js` | Company about page |
| `/shop` | `shop/page.js` | Product catalog with category filters from Shopify |
| `/news` | `news/page.js` | Newsletter hub - 3 sections: Fitness, Supplements, Health |
| `/news/[id]` | `news/[id]/page.js` | Individual newsletter article |
| `/nitric` | `nitric/page.js` | Nitric Oxide product landing page |
| `/supplement-optimization-score` | Multi-step quiz with AI scoring |
| `/smartstack-ai` | AI-powered supplement stack builder |
| `/smartfitt` | Fitness features page |
| `/landing` | Landing/splash page |
| `/pricing` | Pricing/plans page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/shipping` | Shipping policy |
| `/returns` | Returns & refunds policy |

### Auth Pages
| Route | Description |
|-------|-------------|
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |

### Dashboard (Auth Required)
| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `dashboard/page.js` | Main dashboard overview |
| `/dashboard/stack` | User's supplement stack |
| `/dashboard/progress` | Progress tracking |
| `/dashboard/nutrition` | Nutrition/macro tracking |
| `/dashboard/achievements` | Gamification badges/XP |
| `/dashboard/fit` | Fitness tracking |
| `/dashboard/billing` | Stripe billing/subscription |
| `/dashboard/settings` | User settings |
| `/dashboard/optimization-history` | Quiz result history |

### API Routes
| Route | Description |
|-------|-------------|
| `/api/ai/chat` | AI chat endpoint |
| `/api/ai/quiz-chat` | Quiz AI integration |
| `/api/ai/supplement-recommendation` | AI stack recommendations |
| `/api/ai/workout-plan` | AI workout generation |
| `/api/newsletters` | Fetch newsletters from Supabase |
| `/api/newsletter/subscribe` | Email subscription |
| `/api/optimization-results` | Quiz results CRUD |
| `/api/stacks` | User supplement stacks |
| `/api/progress` | User progress data |
| `/api/workouts` | Workout data |
| `/api/stripe/*` | Stripe checkout/portal |
| `/api/webhooks/clerk` | Clerk webhook |
| `/api/webhooks/stripe` | Stripe webhook |
| `/api/webhooks/shopify/order` | Shopify order webhook |

## All Components

### Core UI
| Component | Description |
|-----------|-------------|
| `Navigation.jsx` | Main nav bar (missing from zip - lives at root of components) |
| `Footer.jsx` | Site footer with links |
| `MarketingLayout.jsx` | Wraps public pages (nav + footer + cookie consent) |
| `CookieConsent.jsx` | Cookie consent banner (ready for GA/pixels) |
| `NitricPopup.jsx` | Side popup promoting Nitric Oxide page |
| `OptimizationScorePopup.jsx` | Popup promoting quiz |

### Feature Components
| Component | Description |
|-----------|-------------|
| `SupplementQuiz.jsx` | Multi-step quiz with fuzzy product matching to Shopify |
| `AvieraAIWidget.jsx` | Floating AI chat widget (bottom right) |
| `ShopifyProductCard.jsx` | Product card with add-to-cart |
| `PillLogo.jsx` | Animated pill logo |
| `FAQAccordion.jsx` | Expandable FAQ |
| `ContactForm.jsx` | Contact form |
| `EmailCapture.jsx` | Email signup |
| `PromoBanner.jsx` | Promotional banner |

### Dashboard Components
| Component | Description |
|-----------|-------------|
| `gamification/*` | AchievementCard, StreakCounter, HabitRings, XPDisplay, WeeklySummary |
| `nutrition/*` | MacroInput, MacroRings, MealChecklist, WeeklyNutritionInsights |
| `tracking/*` | SleepTracker, WaterTracker |
| `premium/*` | AIChat, Reassessment |
| `dashboard/*` | AddNoteModal, NotesWidget |
| `shared/*` | Button, GlassCard, Modal, Tooltip, UpgradePrompt |

## Design Tokens (globals.css)
```css
--acc: #00d9ff        /* Primary cyan accent */
--acc-hover: #00b8d4  /* Hover state */
--bg: #0a0a0f         /* Dark background */
--bg-elevated: #12121a /* Elevated cards */
--txt: #ffffff        /* Primary text */
--txt-muted: #a0a0a0  /* Secondary text */
--border: rgba(255,255,255,0.1)
```

Light pages use: bg `#ffffff`→`#f5f5f5`, text `#1a1a1a`, muted `#4a4a4a`

## Current Problems / What Needs Work
1. **Mix of inline styles and Tailwind** - inconsistent, hard to maintain
2. **No mobile-first design** - needs bottom nav bar, better touch targets
3. **Light mode on some pages, dark on others** - needs unified dark mode
4. **No analytics** - Cookie consent exists but no GA/Meta/TikTok pixels yet
5. **Heavy animations** - Some Framer Motion animations cause mobile lag

## What I Want From You
Create accurate HTML mockups (like the mobile phone frame ones you already showed me) for ALL pages listed above. The mockups must:
1. Reflect our ACTUAL features and functionality (not placeholder generic stuff)
2. Use dark mode with our cyan accent #00d9ff
3. Be mobile-first with a bottom navigation bar
4. Be modern and minimalistic (shadcn/ui style)
5. Show me each page in a phone frame I can preview
6. Include the AI chat widget floating button
7. Keep all existing functionality - just restyle it

Priority pages for mockups:
1. Home (with real product cards, quiz CTA, newsletter signup)
2. Shop (with our category filters: Performance, Focus, Health, Recovery, Beauty)
3. Quiz flow (multi-step with progress bar)
4. Product page / Nitric (with Add to Cart + View Cart)
5. Newsletter hub (3 tabs: Fitness, Supplements, Health)
6. Dashboard (score card, stack, progress, nutrition)
7. About page
8. Pricing page

DO NOT write actual React/Next.js code yet. Only HTML mockups for preview.
