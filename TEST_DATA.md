# Manual End-to-End Testing Guide

Test all CRUD operations via the dashboard UI.

---

## Available Users

| Name | ID |
|------|-----|
| ICT | `019f1d6a-e4cd-715c-a389-40f427747b78` |
| Princess Mbhele | `019f3bf9-01fd-73b9-a4c0-378bd40826b1` |
| Developer | `019f3d81-d49b-701e-8fb0-9a9aa323eba5` |
| Mzomuhle Nkosi | `019f416c-b409-73ae-87ec-2480ab4b0b88` |

---

## 1. Projects (Dashboard → Projects → Create Project)

> Forms no longer have Status or Progress fields. Server computes these.

### CREATE — 5 Projects

| # | Title | Description | Manager | Planned Start | Planned Finish |
|---|-------|-------------|---------|---------------|----------------|
| 1 | Municipal CCTV Network | Deploy IP cameras across municipal buildings and public spaces | Mzomuhle Nkosi | 2026-08-01 | 2027-02-28 |
| 2 | Office 365 Migration | Migrate all staff mailboxes and collaboration tools to Microsoft 365 | Developer | 2026-08-15 | 2026-11-30 |
| 3 | GIS Mapping Platform | Implement geographic information system for infrastructure asset tracking | Princess Mbhele | 2026-09-01 | 2027-04-30 |
| 4 | Disaster Recovery Setup | Establish offsite backup and DR facility for critical municipal systems | Mzomuhle Nkosi | 2026-10-01 | 2027-01-31 |
| 5 | Public WiFi Phase 2 | Extend free WiFi coverage to community halls and taxi ranks | Developer | 2026-11-01 | 2027-05-31 |

### READ — Verify all 5 appear in project list with status "Not Started" (server default)

### UPDATE — Edit Project 2

| Field | Change to |
|-------|-----------|
| Title | Office 365 Migration (Phase 1) |
| Planned Finish | 2026-12-15 |

### DELETE — Delete Project 5

### ACTIONS — Test dropdown menu

- Archive Project 4 (toast may show error — endpoint not yet live)
- Close Project 2 (toast may show error — endpoint not yet live)

---

## 2. WBS Nodes (Dashboard → Planning → select project → + button)

> Forms no longer have Status or Progress fields. Server computes these.

### CREATE — 5 WBS Nodes (under Project 1: Municipal CCTV Network)

| # | Name | Description | Level | Parent | Owner | Start | End |
|---|------|-------------|-------|--------|-------|-------|-----|
| 1 | Municipal CCTV Network | Root project node | project | (none — root) | Mzomuhle Nkosi | 2026-08-01 | 2027-02-28 |
| 2 | Site Surveys | Assess all locations for camera placement and connectivity | phase | Node 1 | Developer | 2026-08-01 | 2026-09-15 |
| 3 | Procurement | Source cameras, NVRs, cabling, and installation contractors | phase | Node 1 | Princess Mbhele | 2026-09-01 | 2026-10-31 |
| 4 | Installation | Physical installation and network configuration | phase | Node 1 | Mzomuhle Nkosi | 2026-11-01 | 2027-01-31 |
| 5 | Camera Specifications | Define resolution, storage, and night-vision requirements | deliverable | Node 2 | Developer | 2026-08-15 | 2026-09-01 |

> Node 1 is root (no parent, level = project)
> Nodes 2–4 are children of Node 1 (level = phase)
> Node 5 is child of Node 2 (level = deliverable)

### READ — Verify tree: root → 3 phases, with Camera Specifications nested under Site Surveys

### UPDATE — Edit Node 3

| Field | Change to |
|-------|-----------|
| Name | Procurement & Vendor Management |
| End | 2026-11-15 |

### DELETE — Delete Node 4 (Installation)

---

## 3. Tasks (Dashboard → Planning → Tasks → Create Task)

> Forms no longer have Status field. Server computes it.

### CREATE — 5 Tasks (under Project 1: Municipal CCTV Network)

> When creating Task 3–5, add a dependency to a preceding task to test the dependency flow.

| # | Name | Description | WBS Node | Type | Priority | Planned Start | Planned Finish |
|---|------|-------------|----------|------|----------|---------------|----------------|
| 1 | Conduct Site Assessments | Visit all 12 municipal buildings to assess camera mounting points | Site Surveys | planning | high | 2026-08-01 | 2026-08-31 |
| 2 | Draft Camera Spec Document | Document resolution, FPS, storage, and integration requirements | Camera Specifications | documentation | medium | 2026-08-15 | 2026-09-01 |
| 3 | Issue RFQ for CCTV Equipment | Prepare and distribute RFQ to approved vendors | Procurement & Vendor Management | procurement | high | 2026-09-01 | 2026-09-20 |
| 4 | Evaluate Vendor Proposals | Score and rank vendor submissions against requirements | Procurement & Vendor Management | planning | critical | 2026-09-21 | 2026-10-10 |
| 5 | Configure NVR Storage | Set up network video recorders and configure retention policies | Installation | implementation | medium | 2026-11-01 | 2026-11-30 |

### Dependencies (add when creating tasks 3–5)

| Task | Predecessor | Type | Lag | Mandatory |
|------|-------------|------|-----|-----------|
| 3 | Task 1 | FS | 0 | Yes |
| 4 | Task 3 | FS | 1 | Yes |
| 5 | Task 4 | FS | 0 | No |

### Assignments (add when creating each task)

| Task | User | Role | Allocation |
|------|------|------|------------|
| 1 | Developer | Site Assessor | 100 |
| 1 | Mzomuhle Nkosi | Project Lead | 25 |
| 2 | Developer | Technical Writer | 100 |
| 3 | Princess Mbhele | SCM Officer | 100 |
| 4 | Mzomuhle Nkosi | Evaluation Chair | 80 |
| 4 | Princess Mbhele | SCM Representative | 50 |
| 5 | Developer | Network Engineer | 100 |

### READ — Verify all 5 tasks appear with assignments count

### UPDATE — Edit Task 1

| Field | Change to |
|-------|-----------|
| Name | Conduct Site Assessments (12 Buildings) |
| Priority | critical |

### DELETE — Delete Task 5

### ACTIONS — Test dropdown menu

- Update Progress on Task 1: percentComplete = 60, remarks = "8 of 12 buildings assessed"
- Hold Task 4 (toast may show error — endpoint not yet live)
- Resume Task 4 (toast may show error — endpoint not yet live)

---

## 4. Test Checklist

| # | Test | Pass? |
|---|------|-------|
| 1 | Create 5 projects (no status/progress fields in form) | ✅ |
| 2 | Project list shows all 5 with "Not Started" status | ✅ |
| 3 | Edit project 2 — title and date change persist | ✅ |
| 4 | Delete project 5 — removed from list | ✅ |
| 5 | Archive/Close actions show in dropdown | ✅ (server error — pending backend) |
| 6 | Create root WBS node (level: project) | ✅ |
| 7 | Create 3 phase nodes under root | ✅ |
| 8 | Create deliverable node under Site Surveys | ✅ |
| 9 | WBS tree renders correct hierarchy | ✅ |
| 10 | Edit WBS node 3 — name and date change persist | ✅ |
| 11 | Delete WBS node 4 — removed from tree | ✅ |
| 12 | Create 5 tasks with assignments (no status field in form) | ✅ |
| 12a | Create task with dependency — predecessor task + type FS/SS/FF/SF | ✅ |
| 13 | Task list shows all 5 with assignment count | ✅ |
| 14 | Edit task 1 — name and priority change persist | ✅ |
| 15 | Delete task 5 — removed from list | ✅ |
| 16 | Update Progress dialog opens and submits | ✅ (server error — pending backend) |
| 17 | Hold/Resume/Cancel actions show in task dropdown | ✅ (server error — pending backend) |
| 18 | Project detail page shows status, progress, timeline | ✅ |
| 19 | Task detail page shows assignments | ✅ |
| 20 | WBS node form has no status/progress fields | ✅ |

---

## 5. Action Endpoints — Pending Backend

The following are wired on the frontend but return server errors (endpoints not yet implemented):

| Endpoint | Expected Request |
|----------|------------------|
| `POST /api/v1/projects/{id}/archive` | No body |
| `POST /api/v1/projects/{id}/close` | No body |
| `POST /api/v1/tasks/{id}/progress` | `{ "percentComplete": 60, "remarks": "..." }` |
| `POST /api/v1/tasks/{id}/hold` | No body |
| `POST /api/v1/tasks/{id}/resume` | No body |
| `POST /api/v1/tasks/{id}/cancel` | No body |

Once these are live, no frontend changes needed — just re-test.

---
