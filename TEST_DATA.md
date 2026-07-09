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

### CREATE — 5 Projects

| # | Title | Description | Status | Progress | Manager | Start | End |
|---|-------|-------------|--------|----------|---------|-------|-----|
| 1 | ICT Infrastructure Upgrade | Upgrade network switches, servers, and workstations across all municipal buildings | on-track | 25 | ICT | 2026-07-01 | 2026-12-31 |
| 2 | Municipal ERP System | Integrated ERP for finance, HR, supply chain, and asset management | not-started | 0 | Princess Mbhele | 2026-08-01 | 2027-06-30 |
| 3 | Cybersecurity Enhancement | Firewall upgrades, endpoint protection, and staff awareness training | at-risk | 40 | Mzomuhle Nkosi | 2026-04-01 | 2026-09-30 |
| 4 | Fibre Network Expansion | Deploy fibre optic backbone to all municipal offices and community centres | on-track | 15 | Developer | 2026-09-01 | 2027-03-31 |
| 5 | Smart Meter Rollout | IoT smart meter deployment for water and electricity monitoring | not-started | 0 | Princess Mbhele | 2026-10-01 | 2027-08-31 |

### READ — Verify all 5 appear in project list

### UPDATE — Edit Project 3

| Field | Change to |
|-------|-----------|
| Status | on-track |
| Progress | 55 |

### DELETE — Delete Project 5

- Confirm removed from list
- Confirm Projects 1–4 remain

---

## 2. WBS Nodes (Dashboard → Planning → select project → + button)

### CREATE — 5 WBS Nodes (under Project 1: ICT Infrastructure Upgrade)

| # | Name | Description | Level | Status | Progress | Start | End |
|---|------|-------------|-------|--------|----------|-------|-----|
| 1 | ICT Infrastructure Upgrade | Root project node | project | in-progress | 25 | 2026-07-01 | 2026-12-31 |
| 2 | Planning & Assessment | Requirements gathering and site assessments | phase | completed | 100 | 2026-07-01 | 2026-07-31 |
| 3 | Procurement | SCM processes, RFQs, and vendor selection | phase | in-progress | 50 | 2026-08-01 | 2026-09-30 |
| 4 | Implementation | Hardware installation and software deployment | phase | not-started | 0 | 2026-10-01 | 2026-12-15 |
| 5 | Vendor Evaluation | Evaluate and score vendor proposals (child of Procurement) | deliverable | in-progress | 60 | 2026-08-15 | 2026-09-15 |

> Node 1 is root (parentId = null, level = project)
> Nodes 2–4 are children of Node 1 (level = phase)
> Node 5 is child of Node 3 (level = deliverable)

### READ — Verify tree structure: root → 3 phases, with Vendor Evaluation nested under Procurement

### UPDATE — Edit Node 3

| Field | Change to |
|-------|-----------|
| Name | Procurement & SCM |
| Progress | 70 |

### DELETE — Delete Node 4 (Implementation)

- Confirm removed from tree
- Confirm Nodes 1, 2, 3, and 5 remain

---

## 3. Tasks (Dashboard → Planning → Tasks → Create Task)

### CREATE — 5 Tasks (under Project 1)

| # | Name | Description | WBS Node | Type | Priority | Status | Start | End |
|---|------|-------------|----------|------|----------|--------|-------|-----|
| 1 | Draft Requirements Document | Compile functional and technical requirements from all departments | Planning & Assessment | documentation | high | completed | 2026-07-01 | 2026-07-15 |
| 2 | Network Infrastructure Audit | Audit current network topology, bandwidth, and identify upgrade needs | Planning & Assessment | planning | critical | in-progress | 2026-07-10 | 2026-07-25 |
| 3 | Issue RFQ to Vendors | Prepare and distribute Request for Quotation to shortlisted vendors | Procurement & SCM | procurement | high | not-started | 2026-08-01 | 2026-08-20 |
| 4 | Server Room Preparation | Prepare server room with cooling, power, and rack infrastructure | Implementation | implementation | medium | draft | 2026-10-01 | 2026-10-31 |
| 5 | End-User Training Programme | Conduct training sessions for municipal staff on new systems | Implementation | training | medium | not-started | 2026-11-01 | 2026-11-30 |

### Assignments (add when creating each task)

| Task | User | Role | Allocation |
|------|------|------|------------|
| 1 | Developer | Business Analyst | 100 |
| 2 | Mzomuhle Nkosi | Network Engineer | 100 |
| 2 | Developer | Technical Support | 25 |
| 3 | Princess Mbhele | SCM Officer | 100 |
| 4 | Mzomuhle Nkosi | Infrastructure Lead | 100 |
| 5 | Princess Mbhele | Training Coordinator | 50 |
| 5 | Developer | Technical Trainer | 50 |

### READ — Verify all 5 tasks appear with correct statuses, priorities, and assignments

### UPDATE — Edit Task 2

| Field | Change to |
|-------|-----------|
| Status | completed |
| Name | Network Infrastructure Audit (Complete) |

### DELETE — Delete Task 4 (Server Room Preparation)

- Confirm removed from list
- Confirm Tasks 1, 2, 3, 5 remain

---

## 4. Test Checklist

| # | Test | Pass? |
|---|------|-------|
| 1 | Create 5 projects | ☐ |
| 2 | Project list shows all 5 | ☐ |
| 3 | Edit project 3 — changes persist | ☐ |
| 4 | Delete project 5 — removed | ☐ |
| 5 | Create root WBS node (level: project) | ☐ |
| 6 | Create 3 phase nodes under root | ☐ |
| 7 | Create deliverable node under Procurement | ☐ |
| 8 | WBS tree renders correctly | ☐ |
| 9 | Edit WBS node 3 — changes persist | ☐ |
| 10 | Delete WBS node 4 — removed | ☐ |
| 11 | Create 5 tasks with assignments | ☐ |
| 12 | Task list shows all 5 | ☐ |
| 13 | Task detail shows assignments | ☐ |
| 14 | Edit task 2 — changes persist | ☐ |
| 15 | Delete task 4 — removed | ☐ |
| 16 | Draft status displays correctly | ☐ |
| 17 | Dropdown menu (edit/delete) works on project rows | ☐ |
| 18 | Dropdown menu (edit/delete) works on task rows | ☐ |

---
