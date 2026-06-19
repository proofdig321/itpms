# PHASE 2 PLAN

## ITPMS Frontend — Sprint 2 Scope & Execution

---

## Lead Developer Decisions (Confirmed)

| Decision | Resolution |
|----------|-----------|
| Project Code Format | Laravel generates `ITP-YYYY-XXXX` — frontend displays only |
| Phase 2 Priority | CRUD first, then deepen Planning |
| RBAC | Microsoft AD integration — backend-driven, frontend prepares UI |
| API Hosting | Cloud platform for dev/testing (details TBC) |
| API Contract | Mr Nkosi will confirm once backend work starts |
| Planning SRS | "Implement front end functionalities not dependent on RBAC" |

---

## Phase 2 Execution Summary

### Phase 2A: Project CRUD ✅

Full create/read/update/delete lifecycle for Projects.

- Shared `ProjectForm` component (React Hook Form + Zod)
- Create, Edit, Detail, Delete pages
- Service layer with Laravel-contract-aligned signatures
- `projectCode` is display-only (Laravel generates)

### Phase 2B: Planning WBS (Initial) ✅

- WBS tree visualization with expand/collapse
- Hierarchical data model (flat with `parentId`)
- Planning page with tabbed view (WBS + Milestones)

### Phase 2C: RBAC Preparation ✅

- Permission types, roles, `can()` helper
- `PermissionGate` component (UI visibility only)
- Actions gated across Projects and WBS

---

## Phase 2B Extension — Rationale

### Why We Extended

After delivering the Phase 2 report and receiving Mr Nkosi's Planning Module SRS, we reviewed our coverage and identified that:

1. **Mr Nkosi explicitly invited continued implementation:** "You may implement its front end functionalities that are not dependent on RBAC."

2. **The initial WBS tree was only ~15% of the Planning Module SRS.** The SRS defines 42 functional requirements across task management, dependencies, resource planning, cost planning, procurement, risk, baselines, EVM, critical path, forecasting, scenario planning, reports, notifications, and audit.

3. **All remaining features could be built as frontend display/input layers** without requiring backend authorization, calculations, or scheduling engines.

4. **Waiting would have been a lost opportunity** — building these UI shells now means Mr Nkosi has a complete frontend to integrate against, reducing future rework.

### What We Did NOT Do

- No business logic computed in frontend
- No scheduling algorithms
- No CPM/EVM/forecast calculations
- No approval workflow enforcement
- No authentication implementation
- No existing modules were modified or broken

### Extension Batches

| Batch | Scope | SRS Coverage |
|-------|-------|--------------|
| 1 | WBS CRUD + Task Management | FR-PLN-004, FR-PLN-007 |
| 2 | Gantt Timeline + Dependencies | FR-PLN-008, FR-PLN-013 |
| 3 | Resource, Cost, Procurement, Risk | FR-PLN-016–027 |
| 4 | Baselines, EVM, Critical Path, Forecasting | FR-PLN-028–040 |
| 5 | Reports, Notifications, Audit History | SRS Sections 22–24 |
| Gaps | Scenarios, Change Impact, Calendars, Dashboards | FR-PLN-011, 031–032, 041–042, Section 21 |

---

## Phase 2A: Project CRUD (Detail)

**Implements:**
- Create Project form (React Hook Form + Zod validation)
- Edit Project form (reuses shared form)
- View Project detail page
- Delete/Archive confirmation dialog

**Fields (aligned with FRS FR-PI-001):**
- Title (required)
- Description (required)
- Status (dropdown — uses existing enum)
- Progress (number 0–100)
- Manager (text — will become AD user reference later)
- Start Date
- End Date

**Architecture:**
- Service layer with `createProject()`, `updateProject()`, `deleteProject()`
- Mock implementations operate on in-memory array (no Zustand)
- Shared form component reused for both Create and Edit
- Forms use React Hook Form + Zod schema with `superRefine`
- When Laravel arrives, replace service internals with `apiClient` calls only

---

## What We Keep From Phase 1

- Projects table (list view) — preserved
- Planning milestones table — preserved as tab
- Monitoring dashboard — untouched
- Service layer pattern — unchanged
- Architecture guide — extended (not rewritten)

---

## Backend-Owned (Frontend Displays Only)

| Feature | Backend Responsibility |
|---------|----------------------|
| WBS code generation | Laravel auto-generates `1.0 → 1.1 → 1.1.1` |
| Schedule recalculation | Laravel scheduling engine |
| Dependency resolution | Laravel prevents loops, calculates dates |
| Critical path (CPM) | Laravel algorithm |
| Earned Value (EVM) | Laravel computes PV/EV/AC/SV/CV/SPI/CPI |
| Forecasting | Laravel computes EAC/ETC/VAC |
| Baseline approval workflow | Laravel + AD enforces |
| Baseline immutability | Laravel enforces after approval |
| Calendar-based scheduling | Laravel applies calendar rules |
| Over-allocation prevention | Laravel validates before save |
| Report generation (PDF/Excel) | Laravel generates files |
| Notification generation | Laravel event-driven |
| Audit logging | Laravel captures all changes |
| Authorization | Laravel + Microsoft AD |

---

## Success Criteria (Phase 2 — Complete)

✅ A project can be created, edited, viewed, and archived from the UI
✅ Planning shows a hierarchical WBS tree with full CRUD
✅ Tasks can be created and managed
✅ Dependencies are visualized
✅ A read-only Gantt timeline exists
✅ Resource, cost, procurement, and risk planning pages exist
✅ Baselines, EVM, critical path, and forecasting are displayed
✅ Scenario planning and change impact analysis are represented
✅ Calendar management is visible
✅ Planning dashboards (PM + Director views) exist
✅ Reports, notifications, and audit history are represented
✅ The UI is prepared for RBAC via PermissionGate
✅ Architecture remains clean and Laravel-swap-ready
✅ Full Planning Module SRS is represented in the frontend

---

## Git Tags

| Tag | Description |
|-----|-------------|
| `phase2a-crud-complete` | Project CRUD lifecycle |
| `phase2-complete` | Original Phase 2 delivery |
| `phase2-hardened` | Architecture hardening |
| `phase2b-batch1-complete` | WBS CRUD + Task Management |
| `phase2b-batch2-complete` | Gantt + Dependencies |
| `phase2b-batch3-complete` | Resource, Cost, Procurement, Risk |
| `phase2b-batch4-complete` | Baselines, EVM, Critical Path |
| `phase2b-extension-complete` | Reports, Notifications, Audit |
| `srs-planning-complete` | Full SRS gap closure |

---

END OF PHASE 2 PLAN
