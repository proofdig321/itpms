# ITPMS MCP Plan

## What This Document Is

This is the operating procedure for all development work on the ITPMS frontend.
It must be read at the start of every session before any code is written or changed.

It exists because of a specific class of errors that have already occurred:
- Frontend changed based on Mzo's verbal description, not verified API behaviour
- Route identifiers assumed (UUID) when the backend uses a different key (projectCode)
- Backend defects classified as frontend bugs and vice versa
- Decisions made in one session contradicted in the next

The MCP is not a coding assistant. It answers one question before anything else:

> "What does the repository actually implement, and does our frontend match it?"

---

## Governing Documents (read in this order)

| Document | Purpose |
|----------|---------|
| `PROJECT-BOOTSTRAP.md` | Governing specification — MVP scope, guardrails, what we do NOT build |
| `ARCHITECTURE_GUIDE.md` | Module structure, service layer split, server/client rules, naming |
| `FRS-ITPMS.md` | Full functional requirements — what the system must do |
| `API_CONTRACT.md` | Confirmed live API shapes, route identities, known defects |
| `LIVE_API_TESTING.md` | How to test the live API, token acquisition, curl patterns |
| `MCP_PLAN.md` | This file — operating procedure |
| `PHASE2_REPORT.md` | What was built, what is mock, what awaits backend |
| `backend-issues-report.md` | Historical WBS backend defects reported to Mzo |
| `email-to-mzo.txt` | Historical communication — endpoint naming, validation format requests |

---

## Architecture Decision (Locked)

```
Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
    ↓
Laravel REST API (/api/v1/*)
    ↓
Backend services / MySQL database
```

This was an explicit decision. It does not change.

### Filament PHP — Role and Limits

Filament is the Laravel backend admin UI. It uses the same backend services directly,
bypassing the REST API layer.

**Filament's role:**
- Behavioral reference implementation
- Shows us what the backend considers valid (entities, fields, enums, relationships)
- Useful for discovering field names, validation rules, domain shape

**Filament is NOT:**
- The ITPMS frontend
- A source of architectural decisions for Next.js
- A replacement for live API testing

When Filament and the live API disagree, the live API wins.
When Filament shows a field that the live API doesn't return, test the API — don't assume.

---

## Three Sources of Truth

Every implementation decision must be reconciled against all three before code is written.

| Source | What it tells us | How we access it | Required? |
|--------|-----------------|-----------------|----------|
| Live API (ngrok) | What is actually deployed and responding right now | curl with auth token | ✅ Always |
| `API_CONTRACT.md` | Our documented integration boundary — confirmed live behaviour only | This repository | ✅ Always |
| Backend mirror | What Mzo implemented — routes, controllers, validation, models, migrations | `itpms-backend-mirror` MCP server | ⚪ Optional |

### Order of trust when they disagree

1. Live API — ground truth, what is actually running
2. Backend mirror — explains WHY the live API behaves as it does
3. `API_CONTRACT.md` — update to match reality, never the other way

### Backend mirror — optional external evidence adapter

Path: `/workspaces/itpms-backend-mirror` (sibling to our repo, never inside it)
MCP server: `itpms-backend-mirror` in `.amazonq/mcp.json`

The mirror is read-only. Q must never write to it. Mzo owns the backend.
If the mirror does not exist, nothing breaks — live API + constitution remain sufficient.

To set up:
```bash
git clone <mzo-repo-url> /workspaces/itpms-backend-mirror
```

To update:
```bash
cd /workspaces/itpms-backend-mirror && git pull
```

Record the backend commit hash in `API_CONTRACT.md` when making contract decisions based on mirror inspection.

---

## Live API Testing — How It Works

### The ngrok URL

The Laravel backend runs on Mzo's local machine, exposed via ngrok.
Current URL is in `.env.example` and `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=https://b010-196-30-115-34.ngrok-free.app/api/v1
```

**ngrok URL rotates every time Mzo restarts the tunnel.**
When it changes:
1. Update `NEXT_PUBLIC_API_BASE_URL` and `API_BASE_URL` in Vercel dashboard
2. Update `.env.example` in the repository
3. Update `.env.local` for local development
4. Confirm reachable: `curl -s -H "ngrok-skip-browser-warning: true" <new-url>/tasks` → should return `{"message":"Unauthenticated."}`

### The ngrok header

Every curl request to the ngrok URL requires:
```
-H "ngrok-skip-browser-warning: true"
```
Without it, ngrok returns an HTML warning page instead of JSON.

### The auth token

The backend uses Laravel Sanctum bearer tokens.
The frontend authenticates via Azure AD (MSAL) and exchanges the Azure token for a Sanctum token.

**Token cannot be obtained from the Codespace shell** — Azure AD requires a browser popup.

**How to get a token:**
1. Open the live ITPMS dashboard (Vercel: https://itpms.vercel.app or local dev)
2. Log in with Microsoft account
3. Open browser DevTools → Application tab → Cookies
4. Find cookie named `auth_token`
5. Copy the value — format: `64|xQfk6t12yYisHydOI51NoRUiOtUyiuHstS6Dcaa851189ee9`

Token is valid for 8 hours (set in `auth-service.ts`).

### Session setup

```bash
export TOKEN="<from browser cookie auth_token>"
export BASE="https://b010-196-30-115-34.ngrok-free.app/api/v1"
export H1="ngrok-skip-browser-warning: true"
export H2="Accept: application/json"
export H3="Authorization: Bearer $TOKEN"

# Confirm token is valid
curl -s -H "$H1" -H "$H2" -H "$H3" "$BASE/projects" | python3 -m json.tool
```

---

## Route Identity Rules (Confirmed by Live API 2026-08-15)

This is the most critical table in this document.
Do not assume. Test first.

| Module | Route parameter | Resolves by | Confirmed |
|--------|----------------|-------------|-----------|
| Projects — GET single | `{projectCode}` | `ITP-2026-0001` format | ✅ UUID → 404 |
| Projects — PUT | `{projectCode}` | `ITP-2026-0001` format | ✅ UUID → 404 |
| Projects — DELETE | `{projectCode}` | `ITP-2026-0001` format | ✅ |
| Projects — archive/close | `{projectCode}` | `ITP-2026-0001` format | ✅ identifier correct, 500 = backend defect |
| Projects — dashboard/metrics/health/forecast/schedule | `{projectCode}` | `ITP-2026-0001` format | ✅ all 200 |
| WBS — GET/PUT/DELETE single | `{id}` | UUID | ✅ |
| WBS — filter | `?projectCode=` | query param | ✅ |
| Tasks — GET/PUT/DELETE single | `{id}` | UUID | ✅ |
| Tasks — progress/hold/resume/cancel | `{id}` | UUID | ✅ identifier correct |
| Tasks — filter | `?projectCode=` | query param | ✅ |

**Rule:** Do not generalise. Projects uses projectCode. WBS and Tasks use UUID. They are different.

---

## Known Backend Defects (Flagged for Mzo)

Frontend identifiers are correct in all cases below.
Do not implement frontend workarounds. Flag to Mzo and wait.

| Endpoint | Method | Result | Classification | Action |
|----------|--------|--------|----------------|--------|
| `/projects/{projectCode}/archive` | POST | 500 | Backend defect | Mzo investigating |
| `/projects/{projectCode}/close` | POST | 500 | Backend defect | Mzo investigating |
| `/tasks/{id}/hold` | POST | 500 | Backend defect | Mzo investigating |
| `/tasks/{id}/resume` | POST | 500 | Backend defect | Mzo investigating |
| `GET /tasks/{id}` → `predecessorDependencies` | GET | always `[]` | Backend persistence defect | Mzo investigating |

Historical defects (from `backend-issues-report.md`, reported June 2026):
- WBS `ownerId` validation/FK mismatch — frontend disabled owner dropdown as workaround
- WBS sibling sequence unique constraint conflict with soft-delete — affects projects with deletion history

---

## Domain Shape (From Filament Inspection + Live API)

### WBS Hierarchy
```
Project → Phase → Deliverable → Work Package → Task → Sub Task
```

### Roles
```
ict-admin | ict-manager | project-manager | team-member
```

### Task fields confirmed live
- `plannedCost` — decimal string `"5000.00"`, persisted ✅
- `actualCost` — decimal string, updated via progress endpoint ✅
- `progressDate` — ISO 8601 date, persisted in progressHistory ✅
- `assignments` — array with `userId`, `userName`, `role`, `allocation` ✅
- `predecessorDependencies` — accepted on POST/PUT, NOT persisted ❌ backend defect
- `lag`, `lead` — confirmed fields on TaskDependency (Mzo communication, 2026)

### Mzo's confirmed API changes (from email + session history)
- Task dependency payload key: `dependencies` → `predecessorDependencies`
- Dependencies now require `lag` and `lead` fields
- Task progress accepts optional `actualCost`
- Tasks endpoint: `/tasks/project?projectCode=` → `/tasks?projectCode=`
- Tasks all: `/tasks/all` → `/tasks`

---

## Operating Procedure

### Before any new feature or fix

1. Check the live API
   - Does the endpoint exist? (401 = exists, 404 = does not exist)
   - What identifier does it use? Test both UUID and projectCode
   - What does the response shape look like? Read a real record
   - Is the field persisted? POST then GET independently

2. Check `API_CONTRACT.md`
   - Is this endpoint documented?
   - Does the documented shape match the live API?
   - If not — update the contract first, then write code

3. Check the frontend service layer
   - Which service file handles this endpoint?
   - What identifier is it passing?
   - Is it server-only or client-only? Does it match the boundary?

4. Only then write code

### When Mzo communicates a change

Do not update frontend code based on Mzo's description alone.
Run the verification procedure above first.
Only implement after the live API confirms the behaviour.

### When a 404 or 500 occurs

1. Test the endpoint directly with curl using the correct identifier
2. Confirm the identifier type (UUID vs projectCode)
3. Confirm the HTTP method is correct
4. If 500 with correct identifier → backend defect, flag to Mzo, do not workaround

### After every code change

```bash
npx @biomejs/biome check --write   # lint + format
npm run build                       # TypeScript + build
```

Zero errors before commit. Zero errors before push.

---

## Backend Mirror — What It Answers

When the mirror is available at `/workspaces/itpms-backend-mirror`, Q can inspect:

| Question | Laravel artifact |
|----------|-----------------|
| What routes exist and what do they bind to? | `routes/api.php` |
| Does a route use projectCode or UUID binding? | `RouteServiceProvider` or route model binding |
| What fields does a request validate? | `app/Http/Requests/*` |
| What fields does a response return? | `app/Http/Resources/*` |
| What does Filament expose as valid domain? | `app/Filament/Resources/*` |
| What is the actual DB schema? | `database/migrations/*` |
| What model relationships exist? | `app/Models/*` |
| Is a 500 a missing method or a runtime error? | `app/Http/Controllers/*` |

### Open questions — answer when mirror becomes available

1. Does `routes/api.php` bind `/projects/{id}` to `projectCode` or UUID?
   — Confirms `e6b6fc8` fix is correct at route level, not just empirically

2. Do `/projects/{id}/archive` and `/projects/{id}/close` have controller methods?
   — Classifies the 500 as missing implementation vs runtime error

3. Do `/tasks/{id}/hold` and `/tasks/{id}/resume` have controller methods?
   — Same classification

4. Does `predecessorDependencies` have a migration column and model relationship?
   — Confirms whether persistence defect is a missing migration or missing service call

5. What request validation exists for `POST /tasks`?
   — Confirms which fields are required vs optional

---

## Session Startup Checklist

At the start of every session:

- [ ] Read `API_CONTRACT.md` — know the current confirmed state
- [ ] Read `MCP_PLAN.md` — know the operating rules
- [ ] Check if ngrok URL has changed (compare `.env.example` to live)
- [ ] If a token is available, run a quick sweep of endpoints relevant to the session
- [ ] Only then proceed with implementation

---

## What We Do NOT Do

- Do not change frontend code because Mzo said something changed — verify first
- Do not assume UUID is the route identifier for any new endpoint — test it
- Do not implement frontend workarounds for backend defects — flag and wait
- Do not treat `API_CONTRACT.md` as aspirational — it reflects confirmed live behaviour only
- Do not let Filament's structure influence Next.js architecture decisions
- Do not build outside MVP scope defined in `PROJECT-BOOTSTRAP.md`
- Do not compute business logic in the frontend — backend owns scheduling, EVM, CPM, forecasting

---

## Current Implementation State (commit e6b6fc8, 2026-08-15)

| Area | State | Notes |
|------|-------|-------|
| Projects CRUD | ✅ Aligned | All routes use projectCode |
| Projects sub-endpoints | ✅ Aligned | dashboard, metrics, health, forecast, schedule |
| Projects archive/close | ⚠️ Frontend correct | Backend 500 — Mzo investigating |
| WBS CRUD | ✅ Aligned | All routes use UUID |
| Tasks CRUD | ✅ Aligned | All routes use UUID |
| Tasks progress | ✅ Aligned | progressDate and actualCost confirmed |
| Tasks hold/resume | ⚠️ Frontend correct | Backend 500 — Mzo investigating |
| Tasks predecessorDependencies | ⚠️ Frontend correct | Backend not persisting — Mzo investigating |
| Users | ✅ Aligned | |
| Auth (Azure AD + Sanctum) | ✅ Aligned | |
| WBS ownerId assignment | ⚠️ Disabled in UI | Backend FK/validation mismatch — reported June 2026 |
| Resources, Costs, Procurement, Risks | ❌ Mock data | Backend not implemented |
| Baselines, Analytics, EVM, CPM | ❌ Mock data | Backend not implemented |
| Monitoring summary | ❌ Mock data | Backend not implemented |
| Notifications, Audit | ❌ Mock data | Backend not implemented |
