# TEST_DATA.md

## Test Data for ITPMS Dashboard

Use these commands to populate the dashboard with sample data.
Run from terminal or use the frontend forms.

> **Current API:** `https://7e0d-196-30-115-34.ngrok-free.app/api/v1`

---

## ⚠️ Known Issue

`POST` requests currently return 500 Server Error on the new server.
Mzo needs to fix this before data can be created via API.
Use the **frontend forms** as an alternative once the issue is resolved.

---

## 1. Create Projects

### Project 1: ICT Infrastructure Upgrade

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "title": "ICT Infrastructure Upgrade",
    "description": "Upgrade municipal ICT infrastructure including network switches, servers, and end-user workstations across all municipal buildings.",
    "status": "on-track",
    "progress": 25,
    "managerId": "019f1d6a-e4cd-715c-a389-40f427747b78",
    "startDate": "2026-07-01",
    "endDate": "2026-12-31"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/projects"
```

### Project 2: Municipal ERP System

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "title": "Municipal ERP System Implementation",
    "description": "Implement an integrated ERP system for finance, HR, supply chain, and asset management across the municipality.",
    "status": "not-started",
    "progress": 0,
    "managerId": "019f3bf9-01fd-73b9-a4c0-378bd40826b1",
    "startDate": "2026-08-01",
    "endDate": "2027-06-30"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/projects"
```

### Project 3: Cybersecurity Enhancement

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "title": "Cybersecurity Enhancement Programme",
    "description": "Strengthen the municipality cybersecurity posture through firewall upgrades, endpoint protection, and staff awareness training.",
    "status": "at-risk",
    "progress": 40,
    "managerId": "019f1d6a-e4cd-715c-a389-40f427747b78",
    "startDate": "2026-04-01",
    "endDate": "2026-09-30"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/projects"
```

---

## 2. Create WBS Nodes

> Replace `{PROJECT_CODE}` with the actual project code returned from step 1 (e.g. `ITP-2026-0001`).

### Phase 1: Planning

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "parentId": null,
    "name": "Planning Phase",
    "description": "Initial planning and requirements gathering",
    "level": "phase",
    "status": "completed",
    "progress": 100,
    "startDate": "2026-07-01",
    "endDate": "2026-07-31"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/wbs"
```

### Phase 2: Procurement

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "parentId": null,
    "name": "Procurement Phase",
    "description": "SCM processes and vendor selection",
    "level": "phase",
    "status": "in-progress",
    "progress": 50,
    "startDate": "2026-08-01",
    "endDate": "2026-09-30"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/wbs"
```

### Phase 3: Implementation

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "parentId": null,
    "name": "Implementation Phase",
    "description": "Hardware installation and software deployment",
    "level": "phase",
    "status": "not-started",
    "progress": 0,
    "startDate": "2026-10-01",
    "endDate": "2026-12-15"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/wbs"
```

### Deliverable under Phase 2 (child node)

> Replace `{PHASE2_ID}` with the ID returned from the Procurement Phase above.

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "parentId": "{PHASE2_ID}",
    "name": "Vendor Evaluation",
    "description": "Evaluate and score vendor proposals",
    "level": "deliverable",
    "status": "in-progress",
    "progress": 60,
    "startDate": "2026-08-15",
    "endDate": "2026-09-15"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/wbs"
```

---

## 3. Create Tasks

> Replace `{PROJECT_CODE}` and `{WBS_NODE_ID}` with actual values from steps 1 and 2.

### Task 1: Requirements Document

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "wbsNodeId": "{WBS_NODE_ID}",
    "name": "Draft Requirements Document",
    "description": "Compile functional and technical requirements from all departments.",
    "type": "documentation",
    "priority": "high",
    "status": "completed",
    "plannedStart": "2026-07-01",
    "plannedFinish": "2026-07-15"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/tasks"
```

### Task 2: Network Assessment

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "wbsNodeId": "{WBS_NODE_ID}",
    "name": "Network Infrastructure Assessment",
    "description": "Audit current network topology, bandwidth utilisation, and identify upgrade requirements.",
    "type": "planning",
    "priority": "critical",
    "status": "in-progress",
    "plannedStart": "2026-07-10",
    "plannedFinish": "2026-07-25"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/tasks"
```

### Task 3: Vendor RFQ

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "wbsNodeId": "{WBS_NODE_ID}",
    "name": "Issue RFQ to Vendors",
    "description": "Prepare and distribute Request for Quotation to shortlisted vendors.",
    "type": "procurement",
    "priority": "high",
    "status": "not-started",
    "plannedStart": "2026-08-01",
    "plannedFinish": "2026-08-20"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/tasks"
```

### Task 4: Server Room Preparation

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "wbsNodeId": "{WBS_NODE_ID}",
    "name": "Server Room Preparation",
    "description": "Prepare server room with cooling, power, and rack infrastructure for new equipment.",
    "type": "implementation",
    "priority": "medium",
    "status": "draft",
    "plannedStart": "2026-09-15",
    "plannedFinish": "2026-10-15"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/tasks"
```

### Task 5: Staff Training

```bash
curl -s -X POST -H "Accept: application/json" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" \
  -d '{
    "projectCode": "{PROJECT_CODE}",
    "wbsNodeId": "{WBS_NODE_ID}",
    "name": "End-User Training Programme",
    "description": "Conduct training sessions for municipal staff on new systems and equipment.",
    "type": "training",
    "priority": "medium",
    "status": "not-started",
    "plannedStart": "2026-11-01",
    "plannedFinish": "2026-11-30"
  }' \
  "https://7e0d-196-30-115-34.ngrok-free.app/api/v1/tasks"
```

---

## 4. Using the Frontend Forms Instead

If the API commands above return errors, use the frontend UI:

1. **Create Project:** Dashboard → Projects → Create Project
2. **Create WBS:** Dashboard → Planning → select project → Add Node (+ button)
3. **Create Task:** Dashboard → Planning → Tasks → Create Task

---

## Available Users (for managerId / assigneeId)

| Name | ID |
|------|-----|
| ICT | `019f1d6a-e4cd-715c-a389-40f427747b78` |
| Princess Mbhele | `019f3bf9-01fd-73b9-a4c0-378bd40826b1` |
| Developer | `019f3d81-d49b-701e-8fb0-9a9aa323eba5` |
| Mzomuhle Nkosi | `019f416c-b409-73ae-87ec-2480ab4b0b88` |

---

## RBAC (Pending)

RBAC implementation requires Mzo to:
1. Return `role` and `permissions` array from `/api/v1/auth/me`
2. Implement backend data filtering (team members only see assigned projects/tasks)
3. Confirm role names: `ict-admin`, `ict-manager`, `project-manager`, `viewer`

Frontend `PermissionGate` component is ready — just needs real permission data from the backend.

---
