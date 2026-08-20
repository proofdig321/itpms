# ITPMS Engineering Constitution

> This document is the authoritative engineering memory for the ITPMS frontend.
> It is served by the ITPMS MCP server and must be consulted before any code change.
> It is not aspirational. Every statement here is confirmed ground truth.

---

## 1. What This System Is

ITPMS is the IT Project Management System for a South African municipality (Newcastle).
It is a production frontend for municipal ICT project governance.

It is NOT:
- A SaaS product
- A demo or template showcase
- A general-purpose project management tool
- A Filament admin panel

---

## 2. Architecture (Locked — Does Not Change)

```
Next.js 16 + React + TypeScript + Tailwind CSS v4 + shadcn/ui
    ↓  (REST API calls)
Laravel /api/v1/*  (Mzo's backend, exposed via ngrok)
    ↓
MySQL database
```

### What the frontend owns
- Presentation
- User interaction
- Client-side UX validation (advisory only)
- Visualization
- Temporary local UI state

### What the backend owns (never compute in frontend)
- Authentication and authorization
- Validation (authoritative)
- Business rules
- Persistence
- Identifier generation (projectCode, taskCode, WBS code)
- Scheduling calculations
- Critical path (CPM)
- Earned Value Management (EVM)
- Forecasting
- Audit history

### Filament PHP — role and hard limits

Filament is the Laravel backend admin UI. It uses backend services directly, bypassing the REST API.

**Filament IS:**
- A behavioral reference — shows what the backend considers valid
- Useful for discovering field names, enums, domain shape, relationships

**Filament IS NOT:**
- The ITPMS frontend
- A source of Next.js architectural decisions
- A replacement for live API testing
- An authority on what the REST API returns

When Filament and the live API disagree → live API wins.

---

## 3. Evidence Hierarchy

Every API question must be answered by consulting evidence in this order:

```
1. Live API          — what is actually running right now (ground truth)
2. Backend mirror    — what Mzo implemented (optional, when available)
3. API_CONTRACT.md   — our documented integration boundary (update to match reality)
```

When sources disagree:
- Live API overrides everything
- Backend mirror explains WHY the live API behaves as it does
- `API_CONTRACT.md` is updated to match — never the other way

### Three adapter architecture

```
                 ITPMS MCP
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   OUR REPO     BACKEND REPO   LIVE API
        │           │           │
        ▼           ▼           ▼
 Constitution   Implementation Runtime
 Decisions      Evidence        Evidence
 State
```

### Backend mirror — optional external evidence adapter

Path: `/workspaces/itpms-backend-mirror`
MCP server: `itpms-backend-mirror` (filesystem, read-only)

**The backend mirror is OPTIONAL.** If it does not exist, nothing breaks.
The constitution and live API remain fully sufficient.

**The backend mirror is READ-ONLY.** Q must never write to it.
Mzo owns the backend. We own the frontend. The mirror gives us visibility, not ownership.

**What the mirror answers:**

| Question | Laravel artifact |
|----------|-----------------|
| Does a route use projectCode or UUID? | `routes/api.php`, `RouteServiceProvider` |
| What fields does a request validate? | `app/Http/Requests/*` |
| What fields does a response return? | `app/Http/Resources/*` |
| What does Filament expose as valid domain? | `app/Filament/Resources/*` |
| What is the actual DB schema? | `database/migrations/*` |
| What model relationships exist? | `app/Models/*` |
| Is a 500 a missing method or a runtime error? | `app/Http/Controllers/*` |

**How to set up the mirror:**
```bash
# One-time clone (read-only deploy key or HTTPS)
git clone <mzo-repo-url> /workspaces/itpms-backend-mirror

# Update mirror to latest
cd /workspaces/itpms-backend-mirror && git pull
```

Record the backend commit hash inspected in `API_CONTRACT.md` when making contract decisions.

**If Mzo does not provide repository access:** nothing changes. Use live API + constitution.

---

## 4. Technology Constraints (Locked)

| Concern | Technology | Rule |
|---------|-----------|------|
| Framework | Next.js 16 App Router | Server components by default |
| Language | TypeScript | Strict — zero `any` without biome-ignore |
| Styling | Tailwind CSS v4 | No inline styles |
| Components | shadcn/ui primitives | Use existing primitives, do not reinvent |
| Forms | React Hook Form + Zod | All forms use this pattern |
| Tables | TanStack Table | All data tables use this pattern |
| State | Zustand (cross-route only) | Only for planning project selection and preferences |
| Linting | Biome | `npx @biomejs/biome check --write` before every commit |
| Deployment | Vercel | Build must pass: `npm run build` |

---

## 5. Module Structure (Every Module Follows This)

```
src/app/(main)/dashboard/{module}/
├── page.tsx                         ← Server component. Fetches data. Passes to client.
├── error.tsx                        ← Client component. Error boundary with retry.
└── _components/
    ├── {module}-table.tsx           ← Client component. Renders data via props.
    ├── {module}-table-skeleton.tsx  ← Loading placeholder.
    └── columns.tsx                  ← TanStack Table column definitions.

src/lib/services/
├── {module}-queries.ts              ← Server-only. import "server-only". GET only.
└── {module}.ts                      ← Client-only. POST/PUT/DELETE only.

src/lib/schemas/{module}.ts          ← Zod schema + FormValues type.
src/types/{module}.ts                ← TypeScript interfaces.
src/data/{module}.ts                 ← Mock data (used when backend not implemented).
```

### Three UI states — every module must handle all three

| State | Implementation |
|-------|---------------|
| Loading | `<Suspense fallback={<Skeleton />}>` wrapping async server component |
| Error | `error.tsx` with retry button |
| Empty | Inline empty state with icon + message |

---

## 6. Service Layer Split (Critical — Build Will Fail If Violated)

Next.js App Router enforces strict server/client boundaries.
`next/headers` cannot be imported in any file imported by a client component — even transitively.

```
lib/services/
├── {module}-queries.ts     ← import "server-only" | uses getServerAuthHeaders() | GET only
├── {module}.ts             ← NO server-only | uses getAuthHeaders() | POST/PUT/DELETE only
├── server-api-helpers.ts   ← reads Next.js cookies() — NEVER import from client files
└── api-helpers.ts          ← reads document.cookie — safe for client components
```

### Rules
- Server components (`page.tsx`) import from `*-queries.ts` only
- Client components import from `*.ts` mutations only
- NEVER cross the boundary — build failure is the consequence
- `wbs-client.ts` exists for client-side WBS fetching (dynamic project selection in task form)

### Current service files

| File | Boundary | Endpoints |
|------|----------|-----------|
| `projects-queries.ts` | Server | GET /projects, GET /projects/{projectCode} |
| `projects.ts` | Client | POST/PUT/DELETE /projects |
| `project-dashboard.ts` | Server | GET /projects/{projectCode}/dashboard,metrics,health,forecast,schedule |
| `tasks-queries.ts` | Server | GET /tasks, GET /tasks/{id} |
| `tasks.ts` | Client | POST/PUT/DELETE /tasks, POST /tasks/{id}/progress,hold,resume,cancel |
| `wbs.ts` | Server | GET /wbs |
| `wbs-client.ts` | Client | GET /wbs (dynamic fetch on project selection in task form) |
| `wbs-mutations.ts` | Client | POST/PUT/DELETE /wbs |
| `users.ts` | Server | GET /users |

---

## 7. Form Pattern

```
lib/schemas/{module}.ts         ← Zod schema defines shape and validation
_components/{module}-form.tsx   ← Presentation only. Accepts defaultValues + onSubmit.
create/page.tsx                 ← Owns submission. Calls service. Navigates.
[id]/edit/page.tsx              ← Fetches record server-side. Passes to form.
[id]/(view)/page.tsx            ← Read-only detail view.
```

### Form rules
- Form component never imports from `lib/services`
- Form never performs navigation
- Form never edits backend-managed fields: `id`, `projectCode`, `taskCode`, `createdAt`, `updatedAt`
- Validation lives in Zod schema including cross-field rules via `superRefine`

---

## 8. Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Route folders | kebab-case | `/dashboard/planning/tasks` |
| Component files | kebab-case | `task-form.tsx` |
| TypeScript interfaces | PascalCase | `Task`, `WbsNode` |
| Service functions | camelCase | `getTasksByProject` |
| Zod schemas | camelCase + Schema suffix | `taskFormSchema` |

---

## 9. HTTP Methods

Laravel uses `PUT` for updates — not `PATCH`.

| Operation | Method |
|-----------|--------|
| Create | POST |
| Update | PUT |
| Delete | DELETE |

---

## 10. Immutable Fields (Never Editable in Frontend Forms)

- `id`
- `projectCode`
- `taskCode`
- `wbsCode`
- `createdAt`
- `updatedAt`
- Any backend-generated reference number

---

## 11. Status and Health Colour Mapping

| Value | Colour | Badge style |
|-------|--------|-------------|
| `on-track` | GREEN | `border-green-300 bg-green-50 text-green-700` |
| `at-risk` | AMBER | `border-amber-300 bg-amber-50 text-amber-700` |
| `delayed` | RED | `border-red-300 bg-red-50 text-red-700` |
| `critical` | DARK RED | `border-red-400 bg-red-100 text-red-800` |
| `not-started` | GRAY | `border-gray-200 bg-gray-50 text-gray-500` |
| `in-progress` | BLUE | `border-blue-300 bg-blue-50 text-blue-700` |
| `completed` | GRAY | `border-gray-300 bg-gray-50 text-gray-700` |
| `archived` / `closed` | GRAY | `border-gray-300 bg-gray-50 text-gray-500` |
| `cancelled` | RED | `border-red-300 bg-red-50 text-red-700` |

Dark mode variants use `dark:border-*` `dark:bg-*` `dark:text-*` equivalents on all badges.

---

## 12. RBAC Rules

- RBAC is UI visibility only — never data filtering
- `PermissionGate` wraps action buttons and links
- Backend (Laravel + Azure AD) is the security authority
- Frontend permission checks are advisory — never relied upon for security
- Service layer must NEVER branch on permissions

---

## 13. Cross-Route State (Zustand)

```
src/stores/planning/planning-store.ts        ← selectedProjectCode, persisted to localStorage
src/stores/preferences/preferences-store.ts  ← theme, layout, sidebar
```

`ProjectSync` component reads the store and redirects to `?project=` URL param automatically.
This ensures selected project persists across Planning, Tasks, WBS, and Timeline tabs.

---

## 14. Domain Shape

### WBS Hierarchy
```
Project → Phase → Deliverable → Work Package → Task → Sub Task
```

### Roles
```
ict-admin | ict-manager | project-manager | team-member
```

### Project Status Enum
```
not-started | in-progress | completed | archived | closed | cancelled
```

### Project Health Enum
```
on-track | at-risk | delayed | critical | not-planned
```
`not-planned` — returned when project has no tasks (no schedule to evaluate).

### Task Status Enum
```
draft | not-started | in-progress | pending-approval | completed | on-hold | cancelled
```
`pending-approval` — intermediate state between `in-progress` and `completed` (Mzo fix `813fe86`).
`cancelled` — terminal state, added in same fix.

### Task Priority Enum
```
critical | high | medium | low
```

### Task Type Enum
```
planning | design | procurement | implementation | testing | training | documentation | closure
```

### WBS Level Enum
```
project | phase | deliverable | work-package | task | sub-task
```

### Dependency Types
```
FS (Finish-to-Start) | SS (Start-to-Start) | FF (Finish-to-Finish) | SF (Start-to-Finish)
```

---

## 15. Route Identity Rules (Confirmed by Live API 2026-08-15)

> This is the most important table. Do not assume. Test before implementing.

| Module | Route parameter | Resolves by | Evidence |
|--------|----------------|-------------|----------|
| Projects — all verbs | `{projectCode}` | `ITP-2026-0001` format | UUID → 404 confirmed |
| Projects — all sub-endpoints | `{projectCode}` | `ITP-2026-0001` format | dashboard/metrics/health/forecast/schedule all 200 |
| WBS — single record | `{id}` | UUID | 200 confirmed |
| WBS — filter | `?projectCode=` | query param | 200 confirmed |
| Tasks — single record | `{id}` | UUID | 200 confirmed |
| Tasks — sub-endpoints | `{id}` | UUID | progress 200, hold/resume 500 (backend defect) |
| Tasks — filter | `?projectCode=` | query param | 200 confirmed |

**Rule:** Projects ≠ WBS ≠ Tasks. Each module has its own identifier convention. Never generalise across modules.

---

## 16. Known Backend Defects (Do Not Workaround — Flag to Mzo)

| Endpoint | Method | Result | Notes |
|----------|--------|--------|-------|
| `/tasks/{id}` → `predecessorDependencies` | GET | always `[]` | Accepted on POST/PUT, not persisted. Mzo investigating. |
| `/wbs` → `ownerId` | POST/PUT | validation error | FK expects UUID, validation expects integer. Frontend disables owner field. |
| `/wbs` → sibling sequence | POST | 422 on projects with deletion history | Unique constraint includes soft-deleted records. |

### Fixed by Mzo (mirror commit `813fe86`) — pending live verification

| Endpoint | Was | Fix |
|----------|-----|-----|
| `/projects/{projectCode}/archive` | 500 | `StateMachine::normalizeValue()` — enum object now normalised to string |
| `/projects/{projectCode}/close` | 500 | Same fix |
| `/tasks/{id}/hold` | 500 | Same fix |
| `/tasks/{id}/resume` | 500 | Same fix |

> Live verification blocked — ngrok tunnel down. Verify once Mzo restarts tunnel.

---

## 17. Confirmed API Changes (From Mzo — Already Implemented)

| Old | New | Status |
|-----|-----|--------|
| `dependencies` payload key | `predecessorDependencies` | ✅ Implemented |
| `/tasks/project?projectCode=` | `/tasks?projectCode=` | ✅ Implemented |
| `/tasks/all` | `/tasks` | ✅ Implemented |
| Task progress: no `actualCost` | Task progress: optional `actualCost` | ✅ Implemented |
| Task progress: no `progressDate` | Task progress: `progressDate` ISO 8601 | ✅ Implemented |
| Dependencies: no `lag`/`lead` | Dependencies: `lag` and `lead` required | ✅ Implemented |

---

## 18. Live API Testing Procedure

### Why it is mandatory
Every backend change must be verified against the live API before frontend code changes.
Mzo's verbal descriptions are not sufficient. The live API is ground truth.

### ngrok URL
Current: **STALE — tunnel down (ERR_NGROK_3200). Mzo must restart and send new URL.**
Last known: `https://b010-196-30-115-34.ngrok-free.app/api/v1`
Stored in: `.env.example` and `.env.local`

**The ngrok URL rotates every time Mzo restarts the tunnel.**
When it changes:
1. Update `NEXT_PUBLIC_API_BASE_URL` and `API_BASE_URL` in Vercel dashboard
2. Update `.env.example` in the repository
3. Update `.env.local` for local development
4. Verify: `curl -s -H "ngrok-skip-browser-warning: true" <new-url>/tasks` → `{"message":"Unauthenticated."}`

### ngrok header (mandatory on every request)
```
-H "ngrok-skip-browser-warning: true"
```
Without it: ngrok returns HTML, not JSON.

### Auth token
- Type: Laravel Sanctum bearer token
- Source: browser cookie `auth_token` after Azure AD login
- Cannot be obtained from shell — requires browser session
- Valid: 8 hours
- Format: `64|xQfk6t12yYisHydOI51NoRUiOtUyiuHstS6Dcaa851189ee9`

**How to get it:**
1. Open https://itpms.vercel.app
2. Log in with Microsoft account
3. DevTools → Application → Cookies → `auth_token`
4. Copy value

### Session setup
```bash
export TOKEN="<from browser cookie auth_token>"
export BASE="https://b010-196-30-115-34.ngrok-free.app/api/v1"
export H1="ngrok-skip-browser-warning: true"
export H2="Accept: application/json"
export H3="Authorization: Bearer $TOKEN"

# Verify token works
curl -s -H "$H1" -H "$H2" -H "$H3" "$BASE/projects" | python3 -m json.tool
```

### Verification checklist for any new endpoint or field
1. Does the endpoint exist? (401 = exists, 404 = does not exist)
2. What identifier does it use? Test UUID and projectCode both.
3. What does the response shape look like? Read a real record.
4. Is the field persisted? POST then GET independently.
5. What type does the field return? (string, decimal string, number, null, array)

---

## 19. Implementation State (commit cbc876d, 2026-08-18)

| Area | State | Notes |
|------|-------|-------|
| Projects CRUD | ✅ Live | All routes use projectCode |
| Projects sub-endpoints | ✅ Live | dashboard, metrics, health, forecast, schedule |
| Projects archive/close | ⚠️ Wired | Backend fix deployed (`813fe86`) — live verification pending (tunnel down) |
| WBS CRUD | ✅ Live | All routes use UUID |
| WBS owner assignment | ⚠️ Disabled | Backend FK/validation mismatch |
| Tasks CRUD | ✅ Live | All routes use UUID |
| Tasks progress | ✅ Live | progressDate and actualCost confirmed |
| Tasks hold/resume | ⚠️ Wired | Backend fix deployed (`813fe86`) — live verification pending (tunnel down) |
| Tasks predecessorDependencies | ⚠️ Wired | Backend not persisting — Mzo investigating |
| Users | ✅ Live | |
| Auth (Azure AD + Sanctum) | ✅ Live | |
| Resources | ❌ Mock | Backend not implemented |
| Costs | ❌ Mock | Backend not implemented |
| Procurement | ❌ Mock | Backend not implemented |
| Risks | ❌ Mock | Backend not implemented |
| Baselines | ❌ Mock | Backend not implemented |
| Analytics / EVM / CPM | ❌ Mock | Backend not implemented |
| Monitoring summary | ❌ Mock | Backend not implemented |
| Notifications | ❌ Mock | Backend not implemented |
| Audit | ❌ Mock | Backend not implemented |

---

## 20. What Q Must Not Do

- Do not change frontend code because Mzo said something changed — verify with live API first
- Do not assume UUID is the route identifier for any new endpoint — test it
- Do not implement frontend workarounds for confirmed backend defects — flag and wait
- Do not treat `API_CONTRACT.md` as aspirational — it reflects confirmed live behaviour only
- Do not let Filament's structure influence Next.js architecture decisions
- Do not build outside MVP scope defined in `PROJECT-BOOTSTRAP.md`
- Do not compute business logic in the frontend
- Do not import `server-api-helpers.ts` from any file used by client components
- Do not use `PATCH` — Laravel uses `PUT` for updates
- Do not edit backend-managed fields through frontend forms
- Do not add speculative abstractions or unrelated SaaS features

---

## 21. Before Every Commit

```bash
npx @biomejs/biome check --write   # lint + format + import ordering
npm run build                       # TypeScript + Next.js build
```

Zero errors required. No exceptions.
