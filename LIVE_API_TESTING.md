# ITPMS Live API Testing & Backend Discovery

## Purpose

This document records the method used to perform live authenticated API testing
against the Laravel backend from the Codespace shell — without depending on Mzo
to describe the API, without reading Laravel source code, and without guessing
at field names or shapes.

This method is the foundation for independent backend verification and must be
part of the MCP/Constitution planning.

---

## Why This Matters

The previous workflow was:

```
Mzo tells us something changed
  → we update frontend code based on what he said
    → we deploy and hope it works
```

The new workflow is:

```
We test the live API directly with a real token
  → we see the exact response shape
    → we update frontend code based on ground truth
      → we verify the fix with another live test
```

This eliminates:
- Dependency on Mzo remembering to document changes
- Guessing at field names, types, enums
- Deploying broken code because we trusted memory over evidence
- Classifying frontend bugs as backend bugs (or vice versa)

---

## Prerequisites

### 1. The ngrok URL

The Laravel backend runs locally on Mzo's machine and is exposed via ngrok.
The current URL is stored in `.env.example`:

```
NEXT_PUBLIC_API_BASE_URL=https://b010-196-30-115-34.ngrok-free.app/api/v1
```

All requests require the header:
```
ngrok-skip-browser-warning: true
```

Without this header, ngrok returns an HTML warning page instead of the API response.

### 2. The Auth Token

The backend uses Laravel Sanctum bearer tokens. The frontend authenticates via
Azure AD (MSAL) and exchanges the Azure token for a Sanctum token at
`POST /api/v1/auth/azure-login`.

**You cannot obtain a token from the Codespace shell** because Azure AD requires
a browser popup. The token must come from an active browser session.

**How to get the token:**

1. Open the live ITPMS dashboard (Vercel deployment or local dev)
2. Log in with your Microsoft account
3. Open browser DevTools → Application tab → Cookies
4. Find the cookie named `auth_token`
5. Copy the value — it looks like: `58|EcQb95Kb9wwu31AeDIjdwcd4cldjnoQ09ndAJMb73031ef95`

This token is valid for 8 hours (set in `auth-service.ts`).

---

## Basic Test Pattern

```bash
export TOKEN="<paste token here>"
export BASE="https://b010-196-30-115-34.ngrok-free.app/api/v1"

curl -s \
  -H "ngrok-skip-browser-warning: true" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE/tasks" | python3 -m json.tool
```

---

## Discovering the Database Shape

### Step 1 — Check if an endpoint exists

A 401 means the endpoint exists but requires auth.
A 404 with `"The route ... could not be found"` means it does not exist.

```bash
# Returns 401 = endpoint exists
curl -s -H "ngrok-skip-browser-warning: true" -H "Accept: application/json" \
  "$BASE/tasks"

# Returns 404 = endpoint does not exist
curl -s -H "ngrok-skip-browser-warning: true" -H "Accept: application/json" \
  "$BASE/monitoring/summary"
```

### Step 2 — Read the actual response shape

```bash
curl -s -H "ngrok-skip-browser-warning: true" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE/tasks" | python3 -m json.tool
```

This gives you the exact field names, types, nesting, and values the backend
actually returns — not what Mzo thinks it returns.

### Step 3 — Read a single record for full detail

List endpoints often return a subset of fields. Single-record endpoints return
the full shape including nested relations.

```bash
curl -s -H "ngrok-skip-browser-warning: true" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE/tasks/<id>" | python3 -m json.tool
```

From a single task response we discovered fields that were never documented:
`plannedCost`, `actualCost`, `remarks`, `progressHistory`, `comments`,
`approvals`, `predecessorDependencies`, `updatedAt`, `sequence`.

### Step 4 — Test field acceptance with POST

To confirm whether a field is accepted, send it and check the response:

```bash
curl -s -H "ngrok-skip-browser-warning: true" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "$BASE/tasks" \
  -d '{"projectCode":"...","wbsNodeId":"...","name":"TEST","description":"test",
       "type":"planning","priority":"medium","duration":1,
       "plannedStart":"2026-08-15","plannedFinish":"2026-08-15",
       "plannedCost":5000,
       "assignments":[],"predecessorDependencies":[]}' | python3 -m json.tool
```

If the field appears in the response with the value you sent, it is accepted
and persisted. If it is absent or `"0.00"`, it was ignored.

### Step 5 — Lifecycle test for persistence

To confirm a field is truly persisted (not just echoed in the POST response):

```bash
# 1. POST and capture the new record ID
TASK_ID=$(curl -s ... -X POST "$BASE/tasks" -d '...' | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id'])")

# 2. GET the record back independently
curl -s -H "..." "$BASE/tasks/$TASK_ID" | python3 -m json.tool
```

If the field is present in the GET response, it is persisted.
If it is absent or reset, it is not persisted — backend defect.

This is exactly how we confirmed:
- `plannedCost` ✅ persisted
- `progressDate` ✅ persisted in progressHistory
- `predecessorDependencies` ❌ accepted but NOT persisted — backend defect

---

## Confirmed Findings From Live Testing (2026-08-15)

### Endpoints that exist (return 401 without auth)

| Endpoint | Status |
|----------|--------|
| `GET /api/v1/projects` | ✅ Exists |
| `GET /api/v1/wbs` | ✅ Exists |
| `GET /api/v1/tasks` | ✅ Exists |
| `GET /api/v1/users` | ✅ Exists |

### Endpoints that do NOT exist (return 404)

| Endpoint | Status |
|----------|--------|
| `GET /api/v1/monitoring/summary` | ❌ Not implemented |
| `GET /api/v1/risks` | ❌ Not implemented |
| `GET /api/v1/resources` | ❌ Not implemented |
| `GET /api/v1/costs` | ❌ Not implemented |
| `GET /api/v1/procurement` | ❌ Not implemented |
| `GET /api/v1/planning` | ❌ Not implemented |
| `GET /api/v1/baselines` | ❌ Not implemented |
| `GET /api/v1/analytics/evm` | ❌ Not implemented |
| `GET /api/v1/analytics/critical-path` | ❌ Not implemented |
| `GET /api/v1/notifications` | ❌ Not implemented |
| `GET /api/v1/audit` | ❌ Not implemented |

### Actual Task response shape (confirmed by live GET /tasks/{id})

```json
{
  "data": {
    "id": "uuid",
    "projectCode": "ITP-2026-0001",
    "wbsNodeId": "uuid",
    "taskCode": "TSK-00001",
    "sequence": 0,
    "name": "string",
    "description": "string",
    "type": "planning",
    "priority": "high",
    "status": "in-progress",
    "duration": 2,
    "milestone": false,
    "plannedStart": "2026-07-01",
    "plannedFinish": "2026-07-02",
    "actualStart": "2026-07-15",
    "actualFinish": null,
    "plannedCost": "0.00",
    "actualCost": "0.00",
    "percentComplete": 80,
    "remarks": null,
    "assignments": [
      {
        "id": "uuid",
        "userId": "uuid",
        "userName": "Developer",
        "role": "Business Analyst",
        "allocation": 85,
        "createdAt": "2026-07-16 13:57:32"
      }
    ],
    "predecessorDependencies": [],
    "comments": [],
    "progressHistory": [
      {
        "id": "uuid",
        "progressDate": "2026-07-15",
        "percentComplete": 76,
        "remarks": "Test Progress",
        "updatedBy": "uuid",
        "updatedByName": "Developer",
        "createdAt": "2026-07-15 14:38:09"
      }
    ],
    "approvals": [],
    "createdAt": "2026-07-09 10:57:23",
    "updatedAt": "2026-08-12 15:43:04"
  }
}
```

### Confirmed field behaviour

| Field | Endpoint | Accepted | Persisted | Notes |
|-------|----------|----------|-----------|-------|
| `plannedCost` | POST /tasks | ✅ | ✅ | Stored as decimal string `"5000.00"` |
| `plannedCost` | PUT /tasks/{id} | ✅ | ✅ | Confirmed |
| `progressDate` | POST /tasks/{id}/progress | ✅ | ✅ | Stored in progressHistory |
| `actualCost` | POST /tasks/{id}/progress | ✅ | ✅ | Optional |
| `predecessorDependencies` | POST /tasks | ✅ | ❌ | Accepted, silently not persisted |
| `predecessorDependencies` | PUT /tasks/{id} | ✅ | ❌ | Same — backend defect |
| `wbsNodeId` | POST /tasks | ✅ | ✅ | Confirmed on all 38 existing tasks |

---

## predecessorDependencies — Defect Status (Confirmed 2026-08-15)

```
POST /tasks                    accepted (no error, field in payload)
PUT  /tasks/{id}               accepted (no error, field in payload)
GET  /tasks/{id}               empty    (predecessorDependencies: [])
GET  /tasks/{id}/dependencies  empty    ({"data":[]})
```

**Classification**: Backend persistence/return defect.

**Frontend serialization**: Verified correct — service layer maps `dependencies` → `predecessorDependencies` and sends valid payload.

**Frontend workaround**: None.

**Backend clarification**: Required from Mzo.

---

## MCP Planning Notes

The following should be encoded in the MCP/Constitution:

### Token acquisition procedure

The auth token is obtained from the browser session cookie `auth_token` after
logging into the ITPMS dashboard. It expires after 8 hours. When running live
API tests from the Codespace, always obtain a fresh token first.

### Standard verification checklist for any new backend field

1. Does the endpoint exist? (401 vs 404)
2. Is the field accepted on POST? (check response)
3. Is the field persisted? (GET the record back independently)
4. Is the field returned on list vs single-record endpoints?
5. What is the exact type? (string, number, decimal string, null, array)
6. Is it required or optional? (omit it and check for 422)

### When Mzo says something changed

Do not update frontend code based on Mzo's description alone.
Run the verification checklist above first.
Only implement after the live API confirms the behaviour.

### ngrok URL rotation

The ngrok URL changes every time Mzo restarts the tunnel. When the URL changes:
1. Update `NEXT_PUBLIC_API_BASE_URL` and `API_BASE_URL` in Vercel dashboard
2. Update `.env.example` in the repository
3. Update `.env.local` for local development
4. Confirm the new URL is reachable: `curl -s -H "ngrok-skip-browser-warning: true" <new-url>/api/v1/tasks` should return `{"message":"Unauthenticated."}`

---

## Quick Reference

```bash
# Set up for a session
export TOKEN="<from browser cookie auth_token>"
export BASE="https://b010-196-30-115-34.ngrok-free.app/api/v1"
export H1="ngrok-skip-browser-warning: true"
export H2="Accept: application/json"
export H3="Authorization: Bearer $TOKEN"

# Check endpoint exists
curl -s -H "$H1" -H "$H2" "$BASE/<endpoint>"

# Read full shape of a resource
curl -s -H "$H1" -H "$H2" -H "$H3" "$BASE/tasks/<id>" | python3 -m json.tool

# Test field acceptance
curl -s -H "$H1" -H "$H2" -H "$H3" -H "Content-Type: application/json" \
  -X POST "$BASE/tasks" -d '{...}' | python3 -m json.tool

# Extract a specific field from response
curl -s -H "$H1" -H "$H2" -H "$H3" "$BASE/tasks/<id>" | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['data']['wbsNodeId'])"

# List all field names from a response
curl -s -H "$H1" -H "$H2" -H "$H3" "$BASE/tasks/<id>" | \
  python3 -c "import sys,json; print(list(json.load(sys.stdin)['data'].keys()))"
```
