# ARCHITECTURE_GUIDE.md

## Module Structure Pattern

Every feature module follows this structure:

```
src/
├── app/(main)/dashboard/{module}/
│   ├── page.tsx                          # Server component, composes content
│   ├── error.tsx                         # Error boundary (client component)
│   └── _components/
│       ├── {module}-table.tsx            # Client component, renders data
│       ├── {module}-table-skeleton.tsx   # Loading placeholder
│       └── columns.tsx                   # TanStack Table column definitions
├── data/
│   └── {module}.ts                       # Mock data + TypeScript interface
└── lib/services/
    └── {module}.ts                       # Service abstraction layer
```

---

## Data Flow

```
data/{module}.ts  →  lib/services/{module}.ts  →  page.tsx  →  _components/
```

- **data/**: Raw mock data and type definitions. Never imported by UI directly.
- **lib/services/**: Async functions with try/catch. Only point of contact for data. Swap internals for `fetch()` when Laravel is ready.
- **page.tsx**: Server component. Calls service, passes data to client components.
- **_components/**: Client components. Receive data via props. No data fetching.

---

## Service Layer Contract

```typescript
// All functions are async
// Live API is called first, mock data is the fallback
// UI only imports from lib/services/, never from data/

export async function getItems(): Promise<Item[]> {
  const data = await fetchApi("/items");
  if (data) return data.map(mapApiItem);
  return mockItems; // fallback
}

export async function createItem(values: ItemFormValues): Promise<Item> {
  // No try/catch — errors propagate to the calling component
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(values),
  });
  const raw = await response.json();
  if (response.ok) return mapApiItem(raw.data ?? raw);
  throw new Error(raw.message ?? "Request failed");
}
```

> Note: Services call `fetch()` directly. `src/lib/api/client.ts` exists but is not yet used — migration planned when auth token injection is needed.

---

## UI State Handling

Every module must handle three states:

| State   | Implementation                          |
|---------|-----------------------------------------|
| Loading | `<Suspense fallback={<Skeleton />}>`    |
| Error   | `error.tsx` with retry button           |
| Empty   | Inline empty state with icon + message  |

### Page pattern:

```tsx
import { Suspense } from "react";

async function Content() {
  const data = await getItems();
  return <ItemTable data={data} />;
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>...</h1>
        <p>...</p>
      </div>
      <Suspense fallback={<Skeleton />}>
        <Content />
      </Suspense>
    </div>
  );
}
```

### Error boundary pattern:

```tsx
"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
```

### Empty state pattern:

```tsx
if (data.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
      <Icon className="mb-3 h-10 w-10 text-muted-foreground" />
      <h3>No items found</h3>
      <p>Get started by creating your first item.</p>
    </div>
  );
}
```

---

## Status Indicators

All modules displaying status must use this colour mapping:

| Status      | Colour | Usage              |
|-------------|--------|--------------------|
| on-track    | GREEN  | Active, healthy    |
| at-risk     | AMBER  | Needs attention    |
| delayed     | RED    | Behind schedule    |
| completed   | GRAY   | Finished           |
| not-started | GRAY   | Not yet initiated  |

Badge styles use explicit `border + bg + text` for light/dark theme consistency.

---

## Server vs Client Rule

- `page.tsx` is a **Server Component** by default (no `"use client"` directive)
- Data fetching must happen in Server Components via the service layer
- Client components must NOT fetch data directly — they receive data via props only

### Correct pattern:

```
page.tsx (server)
  → calls service (async)
  → passes data to client table component (via props)
```

### Server Components:
- pages
- async data-fetching wrappers

### Client Components (`"use client"`):
- tables
- forms
- interactive UI logic
- error boundaries

### Suspense Rule:

Suspense only triggers correctly when wrapping an **async Server Component**:

```tsx
// ✅ Correct — Content is a server component (no "use client")
async function Content() {
  const data = await getItems();
  return <ClientTable data={data} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content />
    </Suspense>
  );
}
```

```tsx
// ❌ Wrong — fetching inside a client component
"use client";
export function Table() {
  const data = await getItems(); // Will not work
}
```

---

## Responsive Handling

- Table containers use `overflow-x-auto`
- Table cells use `whitespace-nowrap` to prevent awkward wrapping
- Layout relies on the dashboard shell's responsive sidebar behaviour

---

## Naming Conventions

- Route folders: kebab-case (`/dashboard/projects`)
- Component files: kebab-case (`projects-table.tsx`)
- Interfaces: PascalCase (`Project`)
- Service functions: camelCase (`getProjects`)
- Mock data files match module name (`projects.ts`)

---

## Modules Using This Pattern

- [x] Projects (full CRUD + detail + delete)
- [x] Planning (WBS tree + Gantt + milestones + tasks)
- [x] Monitoring (aggregation dashboard)
- [x] Resources (table view)
- [x] Costs (table with ZAR formatting)
- [x] Procurement (SCM stage tracking)
- [x] Risks (probability/impact register)
- [x] Baselines (read-only with status)
- [x] EVM + Forecasting (metric cards)
- [x] Critical Path (task table with highlighting)
- [x] Change Impact (baseline comparison)
- [x] Scenarios (what-if cards)
- [x] Calendars (working days + shutdowns)
- [x] Planning Dashboards (PM + Director views)
- [x] Reports (export trigger page)
- [x] Notifications (notification center)
- [x] Audit History (immutable log)
- [x] Profile (read-only AD user info)
- [x] Login (Azure AD authentication)

---

## Form Pattern (Phase 2)

CRUD modules use a shared form component:

```
lib/schemas/{module}.ts       → Zod schema + FormValues type
_components/{module}-form.tsx → Shared form (presentation-only)
create/page.tsx               → Create page (owns submission)
[id]/edit/page.tsx            → Edit page (reuses form)
[id]/(view)/page.tsx          → Detail page (read-only)
```

Rules:
- Form component accepts `defaultValues` + `onSubmit` callback
- Form never imports from `lib/services`
- Form never performs navigation
- Form never edits backend-managed fields (id, projectCode, timestamps)
- Validation lives in the Zod schema (including cross-field rules via `superRefine`)

---

## WBS Pattern (Phase 2B)

Hierarchical modules use a flat-data tree pattern:

```
data/wbs.ts               → Flat WbsNode[] with parentId references
lib/services/wbs.ts       → Service returns flat array
_components/wbs-tree.tsx  → Client builds tree from flat data, renders recursively
```

Rules:
- Data is always flat (mirrors API response shape)
- For mock data and moderate datasets, tree construction may occur in the client via `useMemo`
- For large production datasets, the tree should be precomputed in a Server Component before being passed to interactive client components
- No scheduling, dependency, or critical path logic in frontend
- Backend will own computation; frontend owns visualization

---

## RBAC & Authentication Pattern

Permission-aware UI with Azure AD authentication:

```
lib/auth/msal-config.ts        → Azure AD OAuth configuration
lib/auth/auth-service.ts       → Token exchange, session management
lib/auth/permissions.ts        → Types, roles, can() helper, mock context
components/permission-gate.tsx → Show/hide wrapper component
app/(external)/login/page.tsx  → Login with Microsoft page
```

Authentication flow:
```
/login → MSAL popup → Microsoft → access_token
    → POST /api/v1/auth/azure-login (Laravel)
    → app token + user → cookie session
    → redirect to /dashboard/monitoring
```

Rules:
- RBAC is UI visibility only — never data filtering
- `PermissionGate` wraps actions (buttons, links)
- Backend (Laravel + Azure AD) is the security authority
- Session stored in cookies (accessible by server components via `cookies()`)
- API client automatically injects Bearer token from cookies
- System works without authentication (mock context fallback for development)
- Service layer must NEVER branch on permissions

---

## Cross-Module State (Zustand)

For state that must persist across route navigations, use Zustand with `localStorage` persistence:

```
src/stores/
├── preferences/
│   └── preferences-store.ts   # Theme, layout, sidebar preferences
└── planning/
    └── planning-store.ts      # Selected project code (persists across planning modules)
```

### Pattern

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set) => ({ selectedProjectCode: "", setSelectedProjectCode: (code) => set({ selectedProjectCode: code }) }),
    { name: "planning-project" }, // localStorage key
  ),
);
```

### ProjectSync Component

When a page loads without a `?project=` URL param, `ProjectSync` reads the store and redirects automatically:

```
src/app/(main)/dashboard/planning/_components/project-sync.tsx
```

This ensures the selected project persists when navigating between Planning, Tasks, WBS, and Timeline tabs.

---

## HTTP Methods

The Laravel backend uses `PUT` for updates (not `PATCH`). All frontend services must use `PUT` for update operations.

| Operation | Method |
|-----------|--------|
| Create | POST |
| Update | PUT |
| Delete | DELETE |

---

## Rules

- UI never imports from `data/` directly
- Services are the only abstraction for backend swap
- No speculative abstractions — build only what's needed
- Keep components focused and modular
- Preserve this pattern across all modules

---

## Backend Authority Principle

The Laravel backend is the system of record for:

- Authentication
- Authorization
- Validation
- Business rules
- Persistence
- Identifier generation
- Scheduling calculations
- Audit history

The Next.js frontend is responsible only for:

- Presentation
- User interaction
- Client-side validation for UX
- Visualization
- Temporary local UI state

Any frontend validation or permission checks are advisory and must never be relied upon for security.

---

## Immutable Fields

The following backend-managed fields must never be editable through frontend forms:

- `id`
- `projectCode`
- `createdAt`
- `updatedAt`
- audit fields
- backend-generated reference numbers

---

## List Views

Large datasets should support:

- Pagination
- Searching
- Sorting
- Filtering

When backend APIs become available, these operations should be performed server-side. The frontend should render the returned results rather than filtering complete datasets in memory.

---

## API Versioning

Frontend services should target versioned endpoints:

```
/api/v1/projects
/api/v1/planning
/api/v1/monitoring
/api/v1/wbs
/api/v1/auth/me
```

Version changes should be isolated within `lib/api/client.ts` and the service layer without affecting UI components.

---

## Server-Only Enforcement

Files under `src/data/` and `src/lib/services/` that are read-only (no client-side mutations) must include:

```typescript
import "server-only";
```

This prevents accidental imports into client components at build time.

**Exception:** Services that expose mutation functions called from client components (e.g., `createProject`) cannot use `server-only` until mutations are converted to Server Actions in a future phase.

---

## Domain Types

Shared TypeScript interfaces live in `src/types/`:

```
src/types/
├── project.ts
├── planning.ts
├── monitoring.ts
├── wbs.ts
├── task.ts
├── dependency.ts
├── resource.ts
├── cost.ts
├── procurement.ts
├── risk.ts
├── analytics.ts
└── system.ts
```

Rules:
- Types are importable by both server and client components
- Data files (`src/data/`) re-export types from `src/types/` for backward compatibility
- Client components must import types from `@/types/`, never from `@/data/`

---

## Known Template Exceptions

`src/app/(main)/dashboard/layout.tsx` and `src/app/(main)/dashboard/_components/sidebar/app-sidebar.tsx` import from `@/data/users` directly. This is **template infrastructure code** that predates our architecture. It was intentionally left unmodified per our "template is immutable infrastructure" rule. When authentication is implemented, user data will come from the Laravel `/api/v1/auth/me` endpoint instead.

---

## API Client

When replacing mock data with Laravel endpoints, services must use `src/lib/api/client.ts`:

```typescript
import { apiClient } from "@/lib/api/client";

export async function getProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>("/projects");
}
```

The API client provides:
- Centralized base URL configuration
- Default headers (Content-Type, Accept)
- Future bearer token injection (AD integration)
- Consistent error handling
- Single point of change for all API configuration

Do NOT call `fetch()` directly in service files.
