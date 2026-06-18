# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## PROJECT PLANNING MODULE

### IT PROJECT MANAGEMENT SYSTEM (ITPMS)

**Version:** 1.0

---

## 1. PURPOSE

The Project Planning Module shall enable Project Managers and ICT Management to create, maintain, monitor, and control project plans throughout the project lifecycle.

The module shall support:

- Work Breakdown Structure (WBS)
- Schedule Management
- Task Management
- Milestone Management
- Dependency Management
- Resource Planning
- Cost Planning
- Procurement Planning
- Baseline Management
- Critical Path Analysis
- Earned Value Management (EVM)
- Scenario Planning
- Project Forecasting

---

## 2. BUSINESS OBJECTIVES

The module shall:

1. Improve project planning accuracy.
2. Improve project execution control.
3. Enhance project visibility.
4. Improve resource utilization.
5. Improve budget forecasting.
6. Improve project governance.
7. Support MFMA project oversight requirements.
8. Improve project reporting.

---

## 3. PROJECT PLANNING LIFECYCLE

```
Project Approval
    ↓
Project Charter
    ↓
Work Breakdown Structure
    ↓
Task Definition
    ↓
Schedule Development
    ↓
Resource Assignment
    ↓
Budget Allocation
    ↓
Procurement Planning
    ↓
Risk Planning
    ↓
Baseline Approval
    ↓
Project Execution
```

---

## 4. PROJECT STRUCTURE MANAGEMENT

### FR-PLN-001

System shall allow creation of project structures.

Levels:
- Level 1 – Project
- Level 2 – Phase
- Level 3 – Deliverable
- Level 4 – Work Package
- Level 5 – Task
- Level 6 – Sub-task

Example:
```
Municipal Network Upgrade
├── Planning Phase
├── Procurement Phase
├── Installation Phase
├── Testing Phase
└── Close-Out Phase
```

### FR-PLN-002

System shall allow unlimited WBS hierarchy levels.

### FR-PLN-003

System shall automatically generate WBS codes.

Format: `1.0 → 1.1 → 1.1.1 → 1.1.1.1`

---

## 5. WORK BREAKDOWN STRUCTURE (WBS)

### FR-PLN-004

The system shall allow creation and maintenance of WBS elements.

Fields:
- WBS Code
- Name
- Description
- Parent WBS
- Deliverable
- Responsible Person
- Estimated Duration
- Planned Start Date
- Planned End Date

### FR-PLN-005

The system shall allow drag-and-drop restructuring.

### FR-PLN-006

The system shall automatically recalculate schedules when WBS changes.

---

## 6. TASK MANAGEMENT

### FR-PLN-007

The system shall allow creation of project tasks.

Task Fields:
- Task ID
- Task Name
- Description
- Task Type
- Priority
- Status
- Duration
- Planned Start
- Planned Finish
- Actual Start
- Actual Finish
- Percentage Complete

Task Types:
- Planning
- Design
- Procurement
- Implementation
- Testing
- Training
- Documentation
- Closure

Task Priorities:
- Critical
- High
- Medium
- Low

---

## 7. DEPENDENCY MANAGEMENT

### FR-PLN-008

The system shall support task dependencies.

Dependency Types:
- Finish-to-Start (FS)
- Start-to-Start (SS)
- Finish-to-Finish (FF)
- Start-to-Finish (SF)

### FR-PLN-009

The system shall automatically calculate task schedules based on dependencies.

### FR-PLN-010

The system shall prevent invalid dependency loops.

---

## 8. PROJECT CALENDAR MANAGEMENT

### FR-PLN-011

System shall maintain project calendars.

Calendar Types:
- Municipal Calendar
- Department Calendar
- Project Calendar

Calendar Rules:
- Working Days
- Working Hours
- Public Holidays
- Shutdown Periods
- Overtime Rules

### FR-PLN-012

System shall automatically calculate schedules using calendar rules.

---

## 9. GANTT CHART MANAGEMENT

### FR-PLN-013

System shall generate interactive Gantt charts.

Capabilities:
- Zoom In/Out
- Drag Tasks
- Resize Tasks
- Highlight Critical Path
- Filter Tasks

### FR-PLN-014

Changes made in Gantt view shall update task records automatically.

---

## 10. MILESTONE MANAGEMENT

### FR-PLN-015

System shall support milestone planning.

Milestone Fields:
- Milestone ID
- Name
- Description
- Due Date
- Responsible Person
- Status

Milestone Examples:
- Business Case Approved
- Procurement Awarded
- Infrastructure Installed
- User Acceptance Testing Completed
- Go-Live Completed

---

## 11. RESOURCE PLANNING

### FR-PLN-016

System shall integrate with Resource Management Module.

### FR-PLN-017

System shall assign resources to:
- Phases
- Deliverables
- Tasks

### FR-PLN-018

System shall display resource availability before assignment.

### FR-PLN-019

System shall prevent over-allocation.

---

## 12. COST PLANNING

### FR-PLN-020

System shall create project cost plans.

Cost Categories:
- Labour
- Hardware
- Software
- Licenses
- Consulting
- Training
- Travel
- Contingency

### FR-PLN-021

System shall calculate total planned costs.

### FR-PLN-022

System shall generate cost forecasts.

---

## 13. PROCUREMENT PLANNING

### FR-PLN-023

System shall identify procurement requirements.

### FR-PLN-024

System shall generate procurement schedules.

Procurement Stages:
- Specification
- RFQ
- Evaluation
- Adjudication
- Award
- Delivery

### FR-PLN-025

Procurement milestones shall appear in project schedules.

---

## 14. RISK PLANNING

### FR-PLN-026

System shall identify planning risks.

### FR-PLN-027

System shall link risks to:
- Tasks
- Deliverables
- Milestones

---

## 15. BASELINE MANAGEMENT

### FR-PLN-028

System shall create project baselines.

Baseline Components:
- Scope
- Schedule
- Cost
- Resources

### FR-PLN-029

Only authorized users may approve baselines.

Workflow: Project Manager → ICT Manager → ICT Director

### FR-PLN-030

Baselines shall be immutable after approval.

---

## 16. CHANGE IMPACT ANALYSIS

### FR-PLN-031

System shall analyze impact of changes.

Impact Areas:
- Cost
- Schedule
- Resources
- Procurement

### FR-PLN-032

System shall compare current plan against baseline.

---

## 17. CRITICAL PATH ANALYSIS

### FR-PLN-033

System shall calculate Critical Path Method (CPM).

### FR-PLN-034

System shall identify:
- Critical Tasks
- Float
- Slack
- Project Duration

### FR-PLN-035

Critical path shall be highlighted in Gantt charts.

---

## 18. EARNED VALUE MANAGEMENT (EVM)

### FR-PLN-036

System shall calculate EVM metrics.

- **Planned Value (PV):** Budgeted work scheduled.
- **Earned Value (EV):** Budgeted work completed.
- **Actual Cost (AC):** Actual expenditure.

### FR-PLN-037

System shall calculate:

- Schedule Variance (SV) = EV − PV
- Cost Variance (CV) = EV − AC
- Schedule Performance Index (SPI) = EV ÷ PV
- Cost Performance Index (CPI) = EV ÷ AC

### FR-PLN-038

System shall display EVM dashboards.

---

## 19. FORECASTING

### FR-PLN-039

System shall forecast project completion.

### FR-PLN-040

System shall calculate:
- Estimate at Completion (EAC)
- Estimate to Complete (ETC)
- Variance at Completion (VAC)

---

## 20. SCENARIO PLANNING

### FR-PLN-041

System shall support what-if analysis.

Examples:
- Resource Reduction
- Budget Reduction
- Procurement Delay
- Scope Increase

### FR-PLN-042

Scenario plans shall not affect approved baselines.

---

## 21. PROJECT DASHBOARDS

### Project Manager Dashboard

Display:
- Project Progress %
- Budget Status
- Critical Tasks
- Upcoming Milestones
- Resource Utilization

### ICT Director Dashboard

Display:
- Portfolio Schedule Status
- Delayed Projects
- Cost Overruns
- Procurement Delays
- High Risks

---

## 22. REPORTS

Standard Reports:
- Project Plan
- WBS Report
- Gantt Chart Report
- Milestone Report
- Critical Path Report
- Resource Plan
- Cost Plan
- Procurement Plan
- Baseline Comparison Report
- Forecast Report

Export Formats:
- PDF
- Excel
- MS Project XML
- CSV

---

## 23. NOTIFICATIONS

System shall notify stakeholders of:
- Milestone Due Dates
- Delayed Tasks
- Baseline Approvals
- Critical Path Changes
- Resource Conflicts
- Schedule Slippage

---

## 24. AUDIT REQUIREMENTS

Audit all planning changes.

Captured Information:
- User
- Action
- Timestamp
- Previous Value
- New Value
- Reason for Change

---

## 25. DATABASE ENTITIES

Core Tables:
- Projects
- ProjectPhases
- WBS
- Tasks
- TaskDependencies
- Milestones
- Calendars
- ResourceAssignments
- CostPlans
- ProcurementPlans
- Baselines
- Forecasts
- Scenarios
- Notifications
- AuditLogs

---

## 26. ACCEPTANCE CRITERIA

The module shall be accepted when:
- WBS management functions correctly.
- Scheduling calculations are accurate.
- Critical path calculations are accurate.
- EVM calculations are accurate.
- Baselines function correctly.
- Resource planning integrates successfully.
- Reports generate correctly.
- Audit requirements are satisfied.

---

END OF PROJECT PLANNING MODULE SRS
