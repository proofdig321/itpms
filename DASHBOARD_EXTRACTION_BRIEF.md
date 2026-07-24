# Dashboard Extraction Brief
## From: ITPMS → Reusable Dashboard Design System

---

## Purpose

This document defines the extraction of the ITPMS dashboard shell into a
reusable UI foundation for a new ecommerce operations platform built on a
pnpm Turborepo monorepo.

We are not copying the ITPMS application.
We are extracting its presentation architecture as a design system.

---

## What Gets Extracted (Presentation Only)

### Application Shell
- App layout (sidebar + header + content)
- Collapsible sidebar
- Header (search, notifications, user menu, breadcrumbs)
- Mobile navigation
- Theme system (light/dark, color presets)
- Spacing and typography scale

### Component Inventory

| Component | Description |
|-----------|-------------|
| `AppShell` | Root layout wrapper — sidebar + header + content |
| `Sidebar` | Collapsible nav with icon + label items, grouped sections |
| `Header` | Top bar — search, notifications, user menu |
| `PageHeader` | Per-page title + description + actions slot |
| `MetricCard` | Single KPI — title, value, trend indicator |
| `KPIGrid` | Responsive grid of MetricCards |
| `AnalyticsCard` | Chart wrapper — title + chart + optional legend |
| `DataTable` | TanStack Table wrapper — sorting, filtering, pagination |
| `FilterBar` | Search + filter controls above a table |
| `ActivityFeed` | Timestamped event list |
| `QuickActions` | Action button group |
| `StatusBadge` | Colour-coded status pill |
| `EmptyState` | Icon + message + optional CTA |
| `LoadingCard` | Skeleton placeholder |
| `SectionTitle` | Section heading with optional subtitle |
| `PageShell` | PageHeader + content area wrapper |

### Interaction Patterns
- Loading: Suspense + skeleton components
- Error: error.tsx boundary + retry
- Empty: inline EmptyState with icon and message
- Responsive: sidebar collapses on mobile, content reflows

### Theme System
- Light/dark mode toggle
- Color preset support (CSS variables)
- Consistent status colour mapping:
  - Green → healthy / active / on-track
  - Amber → warning / at-risk
  - Red → critical / delayed / error
  - Gray → neutral / inactive / completed

---

## What Does NOT Get Extracted

- Project management modules
- Planning, WBS, Gantt logic
- Municipal terminology or domain language
- API integrations, auth, service layer
- Business rules or validation logic
- Data models or TypeScript domain types
- Any ITPMS-specific routing

---

## Target Architecture

### Monorepo Structure (pnpm Turborepo)

```
/
├── apps/
│   └── operations/               # Ecommerce operations Next.js app
│       └── src/
│           ├── app/
│           │   └── (dashboard)/
│           │       ├── layout.tsx
│           │       ├── page.tsx
│           │       ├── orders/
│           │       ├── products/
│           │       ├── customers/
│           │       ├── inventory/
│           │       ├── reports/
│           │       └── settings/
│           ├── components/
│           │   └── shell/        # App-specific shell config
│           └── lib/
│               └── services/     # API integrations (Spree, Laravel)
│
└── packages/
    └── ui/
        └── dashboard/
            ├── shell/
            │   ├── AppShell
            │   ├── Sidebar
            │   ├── Header
            │   └── MobileNav
            ├── cards/
            │   ├── MetricCard
            │   ├── AnalyticsCard
            │   └── LoadingCard
            ├── navigation/
            │   ├── PageHeader
            │   ├── SectionTitle
            │   └── Breadcrumbs
            ├── tables/
            │   ├── DataTable
            │   └── FilterBar
            ├── feedback/
            │   ├── EmptyState
            │   ├── StatusBadge
            │   └── ActivityFeed
            └── actions/
                └── QuickActions
```

### Each App Supplies Only
- Sidebar navigation config (links, icons, sections)
- Branding (logo, app name, color preset)
- Permission/role context
- Module pages
- API service layer

Everything else comes from `packages/ui/dashboard`.

---

## Ecommerce Sidebar Navigation

```
Dashboard
Orders
Products
Inventory
Customers
Reports
Notifications
Content
Settings

── Phase 2 ──
Vendors
Marketplace
```

---

## Dashboard Page Layout (Operations)

```
┌────────────────────────────────────────────┐
│ Header (search, notifications, user)       │
├──────────────┬─────────────────────────────┤
│              │ PageHeader                  │
│ Sidebar      │ "Operations Dashboard"      │
│              ├─────────────────────────────┤
│ Dashboard    │ KPIGrid                     │
│ Orders       │  Today's Orders             │
│ Products     │  Revenue                    │
│ Inventory    │  Inventory Alerts           │
│ Customers    │  Active Customers           │
│ Reports      ├─────────────────────────────┤
│ Notifications│ AnalyticsCard               │
│ Content      │  Sales Trend (7 days)       │
│ Settings     ├─────────────────────────────┤
│              │ ActivityFeed                │
│              │  Recent Orders              │
└──────────────┴─────────────────────────────┘
```

---

## KPI Mapping (ITPMS → Ecommerce)

| ITPMS Metric | Ecommerce Equivalent |
|--------------|----------------------|
| Total Projects | Today's Orders |
| Active Projects | Revenue (MTD) |
| Delayed Projects | Inventory Alerts |
| Completed Projects | Active Customers |
| Portfolio Health | Fulfilment Rate |

Same `MetricCard` component. Different data.

---

## Page Template (Every Module Page)

Every page in the operations app follows this pattern:

```
PageHeader (title + description + action buttons)
FilterBar (search + filters)
DataTable (sortable, paginated)
```

No redesign per page. Only data and columns change.

---

## Tech Stack (Target)

| Concern | Choice |
|---------|--------|
| Framework | Next.js (App Router), TypeScript |
| Monorepo | pnpm Turborepo |
| UI Components | Shadcn UI (same as ITPMS) |
| Styling | Tailwind CSS v4 |
| Tables | TanStack Table |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Linting | Biome |
| Deployment | Vercel |

---

## Implementation Sequence

### Sprint 1 — Shell Only
1. Scaffold Turborepo with `apps/operations` and `packages/ui`
2. Build `AppShell`, `Sidebar`, `Header` in `packages/ui/dashboard/shell`
3. Wire sidebar navigation config
4. Verify responsive behaviour (mobile collapse)
5. Apply theme system (light/dark + color preset)

### Sprint 2 — Dashboard Page
1. Build `MetricCard`, `KPIGrid` in `packages/ui/dashboard/cards`
2. Build `AnalyticsCard` (chart wrapper)
3. Build `ActivityFeed`
4. Assemble Operations Dashboard page with static/mock data
5. Verify layout matches design

### Sprint 3 — Module Pages
1. Build `DataTable`, `FilterBar` in `packages/ui/dashboard/tables`
2. Build `PageHeader`, `EmptyState`, `StatusBadge`
3. Scaffold Orders, Products, Customers, Inventory pages
4. Each page: PageHeader + FilterBar + DataTable pattern

### Sprint 4 — API Integration
1. Wire Spree API for orders, products, inventory
2. Wire Laravel API for auth, users, permissions
3. Replace mock data with live data
4. Add loading and error states

---

## Architecture Rules (Carried Over from ITPMS)

- `packages/ui` components know nothing about business domain
- Each app owns its service layer — never shared
- Server components fetch data, client components render it
- No mock data in production — empty state on API failure
- `server-only` enforced on all server-side query files
- camelCase field names in all API responses
- ISO 8601 dates everywhere
- Bearer token injected via auth helpers — never hardcoded
- Build must pass before every commit

---

## New Chat Context

When starting the new project thread, provide this document as context.
The new repo is separate from ITPMS — do not mix codebases.

---

END OF BRIEF
