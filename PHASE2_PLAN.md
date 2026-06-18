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

---

## Phase 2 Scope (Ordered)

### Phase 2A: Project CRUD (Highest Priority)

Build full create/read/update/delete for Projects.

**Implements:**
- Create Project form (React Hook Form + Zod validation)
- Edit Project form
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

**Does NOT implement:**
- Approval workflows (requires RBAC)
- Project code generation (Laravel responsibility)
- Business case attachments (future phase)

**Architecture:**
- Service layer gets `createProject()`, `updateProject()`, `deleteProject()`
- Mock implementations store in-memory (or local state via Zustand)
- Forms use React Hook Form + Zod schema matching `Project` interface

---

### Phase 2B: Planning Module — WBS Tree

Evolve Planning from flat milestone table to hierarchical WBS structure.

**Implements (no RBAC dependency):**
- WBS tree visualization (FR-PLN-001 through FR-PLN-004)
  - Project → Phase → Deliverable → Work Package → Task → Sub-task
- WBS code auto-generation (display only — `1.0 → 1.1 → 1.1.1`)
- Task creation within WBS hierarchy (FR-PLN-007)
- Milestone management within WBS (FR-PLN-015)
- Read-only Gantt-style timeline view (FR-PLN-013 — no drag-and-drop yet)
- Dependency visualization (FR-PLN-008 — display only, no auto-calculation)

**Does NOT implement (deferred to backend):**
- Schedule auto-calculation (FR-PLN-006, FR-PLN-009)
- Critical path calculation (FR-PLN-033)
- Earned Value Management (FR-PLN-036–038)
- Baseline approvals (FR-PLN-029 — requires RBAC)
- Forecasting (FR-PLN-039–040)
- Scenario planning (FR-PLN-041–042)
- Drag-and-drop restructuring (FR-PLN-005 — future UX enhancement)
- Calendar management (FR-PLN-011–012 — backend-computed)

**Architecture:**
- New data model: `WbsNode` (hierarchical, self-referencing `parentId`)
- New service: `lib/services/wbs.ts`
- Planning page evolves to tabbed view: Milestones | WBS Tree
- Tree component is presentational — receives flat data, renders hierarchy

---

### Phase 2C: RBAC-Ready UI (Preparation Only)

Prepare the frontend to receive permissions from Laravel without hardcoding auth logic.

**Implements:**
- Permission-aware component wrapper (show/hide based on permissions prop)
- Navigation items conditionally visible based on role
- Disabled state for unauthorized actions (buttons greyed out)
- Placeholder User Management page structure

**Does NOT implement:**
- Actual authentication flow
- Token management
- AD integration
- Role/Permission CRUD (waits for backend)

**Architecture:**
- `lib/auth/permissions.ts` — permission types and helper functions
- Components accept `permissions` prop to conditionally render
- No hardcoded role checks — all permission-based

---

## Execution Order

```
Phase 2A: Project CRUD
  1. Zod schema + form types
  2. Service layer (create/update/delete)
  3. Create Project dialog/page
  4. Edit Project form
  5. Project detail page
  6. Delete confirmation
  → Pause for review

Phase 2B: Planning WBS
  1. WBS data model + mock data
  2. WBS service layer
  3. Tree visualization component
  4. Task creation within tree
  5. Gantt timeline (read-only)
  → Pause for review

Phase 2C: RBAC Preparation
  1. Permission types
  2. Permission-aware wrapper
  3. Conditional navigation
  → Pause for review
```

---

## What We Keep From Phase 1

- Projects table (list view) — stays as-is
- Planning milestones table — becomes one tab in Planning
- Monitoring dashboard — stays as-is
- Service layer pattern — unchanged
- Architecture guide — unchanged (extended for new patterns)

---

## Deferred Until Backend Exists

| Feature | Reason |
|---------|--------|
| Approval workflows | Requires RBAC + backend state machine |
| Baseline management | Immutability enforced server-side |
| Critical path calculation | Algorithm runs server-side |
| EVM metrics | Computed from actual cost data (backend) |
| Notifications | Backend-triggered events |
| Audit logging | Backend responsibility |
| Calendar rules | Backend-computed scheduling |
| Forecasting | Backend algorithms |
| Report generation (PDF/Excel) | Backend file generation |

---

## Success Criteria (Phase 2)

Phase 2 is complete when:
- A project can be created, edited, viewed, and archived from the UI
- Planning shows a hierarchical WBS tree for a project
- Tasks can be created within the WBS hierarchy
- A read-only timeline visualization exists
- The UI is prepared to receive permission data without hardcoding roles
- Architecture remains clean and Laravel-swap-ready

---

## Documentation Updates Required

After Phase 2:
- Update `ARCHITECTURE_GUIDE.md` with form pattern + tree component pattern
- Update `API_CONTRACT.md` with CRUD endpoints + WBS endpoints
- Create `PHASE2_REPORT.md`

---

END OF PHASE 2 PLAN
