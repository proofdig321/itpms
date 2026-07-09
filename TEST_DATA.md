# Manual End-to-End Testing Guide

Test all CRUD operations via the dashboard UI.

---

## Available Users (for assignment fields)

| Name | ID |
|------|-----|
| ICT | `019f1d6a-e4cd-715c-a389-40f427747b78` |
| Princess Mbhele | `019f3bf9-01fd-73b9-a4c0-378bd40826b1` |
| Developer | `019f3d81-d49b-701e-8fb0-9a9aa323eba5` |
| Mzomuhle Nkosi | `019f416c-b409-73ae-87ec-2480ab4b0b88` |

---

## 1. Projects CRUD

### CREATE — Go to Projects → Create Project

| Field | Project 1 | Project 2 | Project 3 |
|-------|-----------|-----------|-----------|
| Title | ICT Infrastructure Upgrade | Municipal ERP System | Cybersecurity Enhancement |
| Description | Upgrade network switches, servers, and workstations across all municipal buildings | Integrated ERP for finance, HR, supply chain, and asset management | Firewall upgrades, endpoint protection, and staff awareness training |
| Status | on-track | not-started | at-risk |
| Progress | 25 | 0 | 40 |
| Manager | ICT | Princess Mbhele | ICT |
| Start Date | 2026-07-01 | 2026-08-01 | 2026-04-01 |
| End Date | 2026-12-31 | 2027-06-30 | 2026-09-30 |

### READ — Verify all 3 appear in project list with correct data

### UPDATE — Edit Project 1

| Field | Change to |
|-------|-----------|
| Title | ICT Infrastructure Upgrade Phase 2 |
| Status | at-risk |
| Progress | 35 |

### DELETE — Delete Project 3 (Cybersecurity Enhancement)

- Confirm it disappears from the list
- Confirm Projects 1 and 2 remain

---

## 2. WBS CRUD

### CREATE — Go to Planning → select Project 1 → Add Node (+)

| Field | Node 1 | Node 2 | Node 3 |
|-------|--------|--------|--------|
| Name | Planning Phase | Procurement Phase | Implementation Phase |
| Description | Requirements gathering and planning | SCM processes and vendor selection | Hardware install and software deployment |
| Level | phase | phase | phase |
| Status | completed | in-progress | not-started |
| Progress | 100 | 50 | 0 |
| Start Date | 2026-07-01 | 2026-08-01 | 2026-10-01 |
| End Date | 2026-07-31 | 2026-09-30 | 2026-12-15 |

### CREATE child node — Under Node 2 (Procurement Phase)

| Field | Value |
|-------|-------|
| Name | Vendor Evaluation |
| Description | Evaluate and score vendor proposals |
| Level | deliverable |
| Status | in-progress |
| Progress | 60 |
| Start Date | 2026-08-15 |
| End Date | 2026-09-15 |

### READ — Verify tree structure shows 3 phases, with Vendor Evaluation nested under Procurement

### UPDATE — Edit Node 2

| Field | Change to |
|-------|-----------|
| Name | Procurement & SCM Phase |
| Progress | 70 |

### DELETE — Delete Node 3 (Implementation Phase)

- Confirm it disappears
- Confirm Nodes 1, 2, and child remain

---

## 3. Tasks CRUD

### CREATE — Go to Planning → Tasks → Create Task

| Field | Task 1 | Task 2 | Task 3 |
|-------|--------|--------|--------|
| Name | Draft Requirements Document | Network Infrastructure Assessment | Issue RFQ to Vendors |
| Description | Compile functional and technical requirements from all departments | Audit current network topology and identify upgrade needs | Prepare and distribute RFQ to shortlisted vendors |
| Project | ICT Infrastructure Upgrade | ICT Infrastructure Upgrade | ICT Infrastructure Upgrade |
| WBS Node | Planning Phase | Planning Phase | Procurement Phase |
| Type | documentation | planning | procurement |
| Priority | high | critical | high |
| Status | completed | in-progress | not-started |
| Planned Start | 2026-07-01 | 2026-07-10 | 2026-08-01 |
| Planned Finish | 2026-07-15 | 2026-07-25 | 2026-08-20 |

### CREATE 2 more tasks

| Field | Task 4 | Task 5 |
|-------|--------|--------|
| Name | Server Room Preparation | End-User Training Programme |
| Description | Prepare server room with cooling, power, and rack infrastructure | Conduct training sessions for staff on new systems |
| Project | ICT Infrastructure Upgrade | ICT Infrastructure Upgrade |
| WBS Node | Implementation Phase | Implementation Phase |
| Type | implementation | training |
| Priority | medium | medium |
| Status | draft | not-started |
| Planned Start | 2026-09-15 | 2026-11-01 |
| Planned Finish | 2026-10-15 | 2026-11-30 |

### READ — Verify all 5 tasks appear in task list with correct statuses and priorities

### UPDATE — Edit Task 2

| Field | Change to |
|-------|-----------|
| Status | completed |
| Priority | high |
| Name | Network Infrastructure Assessment (Complete) |

### DELETE — Delete Task 4 (Server Room Preparation)

- Confirm it disappears
- Confirm other 4 tasks remain

---

## 4. Test Checklist

| # | Test | Pass? |
|---|------|-------|
| 1 | Create 3 projects | ☐ |
| 2 | View project list shows all 3 | ☐ |
| 3 | Edit project 1 — changes persist | ☐ |
| 4 | Delete project 3 — removed from list | ☐ |
| 5 | Create 3 WBS phases under project 1 | ☐ |
| 6 | Create child node under phase 2 | ☐ |
| 7 | WBS tree renders correctly | ☐ |
| 8 | Edit WBS node 2 — changes persist | ☐ |
| 9 | Delete WBS node 3 — removed from tree | ☐ |
| 10 | Create 5 tasks | ☐ |
| 11 | Task list shows all 5 with correct data | ☐ |
| 12 | Edit task 2 — changes persist | ☐ |
| 13 | Delete task 4 — removed from list | ☐ |
| 14 | Task detail view loads without crash | ☐ |
| 15 | Draft status displays correctly | ☐ |

---
