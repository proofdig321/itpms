# ITPMS Project Rules — Auto-loaded on every session

You are working on the ITPMS (IT Project Management System) for a South African municipality.

## Mandatory reading before any code change

Read these files in full at the start of every session:

1. `PROJECT-BOOTSTRAP.md` — governing specification and guardrails
2. `ARCHITECTURE_GUIDE.md` — module structure, service layer, server/client split
3. `API_CONTRACT.md` — confirmed live API shapes, route identities, known defects
4. `MCP_PLAN.md` — operating procedure, three sources of truth, session checklist

## Architecture (locked — do not deviate)

```
Next.js + React + TypeScript + Tailwind CSS + shadcn/ui
    ↓
Laravel REST API (/api/v1/*)
    ↓
Backend services / MySQL database
```

Filament PHP is the backend admin UI. It uses the same Laravel services directly.
It is a behavioral reference — NOT the ITPMS frontend. Never let it influence Next.js architecture.

## Before writing any code

1. Verify the endpoint exists and responds correctly via live API (curl)
2. Confirm the route identifier (projectCode vs UUID — they differ by module)
3. Check API_CONTRACT.md matches live behaviour — update contract if it does not
4. Only then implement

## Route identity rules (confirmed live 2026-08-15)

- `/projects/{projectCode}` — resolves by projectCode (e.g. ITP-2026-0001). UUID returns 404.
- `/wbs/{uuid}` — resolves by UUID
- `/tasks/{uuid}` — resolves by UUID
- `?projectCode=` query param — used for filtering WBS and tasks

## Known backend defects — do not implement workarounds

- `POST /projects/{projectCode}/archive` → 500 (Mzo investigating)
- `POST /projects/{projectCode}/close` → 500 (Mzo investigating)
- `POST /tasks/{id}/hold` → 500 (Mzo investigating)
- `POST /tasks/{id}/resume` → 500 (Mzo investigating)
- `GET /tasks/{id}` predecessorDependencies always `[]` (Mzo investigating)

## Service layer split — never violate

- `*-queries.ts` — server-only, uses `getServerAuthHeaders()`, has `import "server-only"`
- `*.ts` mutations — client-only, uses `getAuthHeaders()` from `api-helpers.ts`
- Never import server-api-helpers.ts from a client component (build will fail)

## Live API testing — required before implementation

```bash
export TOKEN="<from browser cookie auth_token>"
export BASE="https://b010-196-30-115-34.ngrok-free.app/api/v1"
export H1="ngrok-skip-browser-warning: true"
export H2="Accept: application/json"
export H3="Authorization: Bearer $TOKEN"
```

Token: obtained from browser DevTools → Application → Cookies → `auth_token` after Azure AD login.
Valid 8 hours. Cannot be obtained from shell — requires browser session.

ngrok header is mandatory — without it ngrok returns HTML, not JSON.

## Verification after every change

```bash
npx @biomejs/biome check --write   # lint + format
npm run build                       # TypeScript + build
```

Zero errors required before commit.
