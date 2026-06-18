# FUNCTIONAL REQUIREMENTS SPECIFICATION (FRS)

## IT PROJECT MANAGEMENT SYSTEM (ITPMS)

---

## 1. DOCUMENT CONTROL

| Item | Description |
|------|-------------|
| Project Name | IT Project Management System (ITPMS) |
| Client | South African Municipality |
| Department | Information and Communication Technology (ICT) |
| Version | 1.0 |
| Classification | Internal Use |
| Prepared By | Business Analyst |
| Date | June 2026 |

---

## 2. PURPOSE

The purpose of the IT Project Management System (ITPMS) is to provide a centralized platform for managing all ICT projects throughout their lifecycle, including:

- Project initiation
- Business case management
- Project planning
- Budget management
- Procurement tracking
- Resource allocation
- Risk management
- Change management
- Implementation management
- Monitoring and evaluation
- Project closure

The system shall ensure compliance with:

- Municipal Finance Management Act (MFMA)
- Municipal Systems Act
- POPIA
- ICT Governance Framework
- Internal Audit Requirements
- AGSA Audit Requirements
- SCM Regulations

---

## 3. PROJECT OBJECTIVES

The system shall:

1. Centralize project information.
2. Improve project governance.
3. Enhance project visibility.
4. Improve budget control.
5. Track project performance.
6. Improve reporting.
7. Support decision-making.
8. Maintain complete audit trails.

---

## 4. USER ROLES

### 4.1 System Administrator

Permissions:
- Manage users
- Configure workflows
- Configure master data
- Manage permissions
- Generate system reports

### 4.2 ICT Director

Permissions:
- Approve projects
- Approve budgets
- Review dashboards
- View all projects

### 4.3 Project Manager

Permissions:
- Create projects
- Update project plans
- Assign resources
- Manage risks
- Generate reports

### 4.4 Project Team Member

Permissions:
- View assigned projects
- Update assigned tasks
- Upload deliverables

### 4.5 SCM Official

Permissions:
- View procurement requests
- Update procurement status

### 4.6 Finance Official

Permissions:
- Capture budget allocations
- Approve expenditure

### 4.7 Executive Management

Permissions:
- View dashboards
- View strategic reports

### 4.8 Internal Auditor

Permissions:
- View audit trails
- View project documentation

---

## 5. SYSTEM MODULES

| # | Module |
|---|--------|
| 1 | Project Portfolio Management |
| 2 | Project Initiation |
| 3 | Project Planning |
| 4 | Budget Management |
| 5 | Procurement Management |
| 6 | Resource Management |
| 7 | Risk Management |
| 8 | Change Management |
| 9 | Issue Management |
| 10 | Document Management |
| 11 | Project Monitoring |
| 12 | Reporting and Dashboards |
| 13 | Audit Management |
| 14 | Notifications and Escalations |
| 15 | System Administration |

---

## 6. PROJECT PORTFOLIO MANAGEMENT MODULE

### FR-PPM-001
System shall allow users to create project portfolios.

### FR-PPM-002
System shall categorize projects by:
- Strategic Objective
- Department
- Programme
- Funding Source
- Financial Year

### FR-PPM-003
System shall display portfolio dashboards.

### FR-PPM-004
System shall calculate portfolio health indicators.

### FR-PPM-005
System shall calculate:
- Budget Utilization %
- Schedule Variance %
- Cost Variance %
- Risk Exposure Score

---

## 7. PROJECT INITIATION MODULE

### FR-PI-001
System shall allow submission of project proposals.

Fields:
- Project Name
- Description
- Business Need
- Strategic Objective
- Sponsor
- Department
- Estimated Budget
- Estimated Duration
- Priority

### FR-PI-002
System shall generate unique Project Reference Number.

Format: `ITP-YYYY-XXXX`

Example: `ITP-2026-0001`

### FR-PI-003
System shall support workflow approvals.

Workflow: Initiator → ICT Manager → ICT Director → Municipal Manager

### FR-PI-004
System shall support business case attachment.

Formats: PDF, DOCX, XLSX

---

## 8. PROJECT PLANNING MODULE

### FR-PLN-001
System shall create Work Breakdown Structure (WBS).

### FR-PLN-002
System shall create project schedules.

### FR-PLN-003
System shall support Gantt Charts.

### FR-PLN-004
System shall allow task dependency management.

Dependency Types:
- Finish to Start
- Start to Start
- Finish to Finish
- Start to Finish

### FR-PLN-005
System shall calculate critical path.

### FR-PLN-006
System shall calculate schedule variance.

---

## 9. BUDGET MANAGEMENT MODULE

### FR-BUD-001
System shall allocate project budgets.

### FR-BUD-002
System shall track:
- Approved Budget
- Committed Budget
- Actual Expenditure
- Remaining Budget

### FR-BUD-003
System shall integrate with Municipal Financial System.

### FR-BUD-004
System shall generate budget variance reports.

### FR-BUD-005
System shall prevent overspending beyond approved budget.

---

## 10. PROCUREMENT MANAGEMENT MODULE

### FR-PROC-001
System shall create procurement requests.

### FR-PROC-002
System shall track SCM stages:
- Request Submitted
- Specification Approved
- RFQ Issued
- Evaluation
- Adjudication
- Awarded
- Purchase Order Issued
- Delivered

### FR-PROC-003
System shall track SLA dates.

### FR-PROC-004
System shall generate procurement aging reports.

---

## 11. RESOURCE MANAGEMENT MODULE

### FR-RES-001
System shall maintain resource register.

### FR-RES-002
System shall allocate resources.

### FR-RES-003
System shall track utilization.

### FR-RES-004
System shall track availability.

### FR-RES-005
System shall support skills matrix.

---

## 12. RISK MANAGEMENT MODULE

### FR-RISK-001
System shall maintain project risk register.

Fields:
- Risk ID
- Risk Description
- Probability
- Impact
- Risk Score
- Mitigation Plan
- Owner
- Due Date

### FR-RISK-002
System shall calculate risk scores.

Formula: `Risk Score = Probability × Impact`

### FR-RISK-003
System shall escalate high risks automatically.

---

## 13. CHANGE MANAGEMENT MODULE

### FR-CHG-001
System shall create change requests.

### FR-CHG-002
System shall route requests for approval.

Workflow: Requester → Project Manager → ICT Director

### FR-CHG-003
System shall track:
- Scope Impact
- Cost Impact
- Time Impact

---

## 14. ISSUE MANAGEMENT MODULE

### FR-ISS-001
System shall maintain issue register.

### FR-ISS-002
System shall assign issue owners.

### FR-ISS-003
System shall track issue resolution.

---

## 15. DOCUMENT MANAGEMENT MODULE

### FR-DOC-001
System shall provide centralized repository.

### FR-DOC-002
System shall support version control.

### FR-DOC-003
System shall support document approval workflows.

### FR-DOC-004
System shall maintain document audit history.

---

## 16. PROJECT MONITORING MODULE

### FR-MON-001
System shall capture progress updates.

### FR-MON-002
System shall calculate project completion percentages.

### FR-MON-003
System shall display project health indicators.

Status:
- Green
- Amber
- Red

### FR-MON-004
System shall track milestones.

### FR-MON-005
System shall track KPIs.

---

## 17. REPORTING AND DASHBOARDS

### Executive Dashboard

Display:
- Total Projects
- Active Projects
- Delayed Projects
- Budget Utilization
- Portfolio Health

### ICT Dashboard

Display:
- Project Status
- Risks
- Procurement Delays
- Resource Utilization

### Reports

Standard Reports:
- Portfolio Report
- Project Status Report
- Budget Report
- Risk Report
- Procurement Report
- Resource Utilization Report
- Change Report
- Audit Report
- KPI Report
- Project Closure Report

Export Formats: PDF, Excel, CSV

---

## 18. AUDIT MANAGEMENT

### FR-AUD-001
System shall maintain complete audit logs.

Audit Fields:
- User
- Action
- Date
- Time
- IP Address
- Old Value
- New Value

### FR-AUD-002
Audit records shall be immutable.

---

## 19. NOTIFICATIONS AND ESCALATIONS

### Email Notifications
- Approval Required
- Task Assigned
- Project Delayed
- Risk Escalated
- Budget Threshold Reached

### Escalations
- Level 1: Project Manager
- Level 2: ICT Director
- Level 3: Municipal Manager

---

## 20. SECURITY REQUIREMENTS

### Authentication
- Active Directory Integration
- LDAP Integration
- SSO Support
- MFA Support

### Authorization
- Role-Based Access Control (RBAC)

### Data Protection
- TLS 1.3
- AES-256 Encryption
- POPIA Compliance

### Session Management
- Auto Logout after 15 minutes
- Password Complexity Rules

---

## 21. NON-FUNCTIONAL REQUIREMENTS

### Performance
- Response time < 3 seconds
- Dashboard load < 5 seconds

### Availability
- 99.9% uptime

### Scalability
- Minimum 1000 concurrent users

### Backup
- Daily Incremental
- Weekly Full Backup

### Disaster Recovery
- RPO: 4 Hours
- RTO: 8 Hours

---

## 22. INTEGRATIONS

The system shall integrate with:
- Active Directory
- Microsoft Exchange
- Municipal Financial System
- SCM System
- HR System
- SharePoint
- Microsoft Teams
- Power BI

---

## 23. DATABASE REQUIREMENTS

Core Tables:
- Users
- Roles
- Permissions
- Projects
- Portfolios
- Tasks
- Milestones
- Budgets
- Expenditure
- Risks
- Issues
- Changes
- Documents
- AuditLogs
- Notifications
- Vendors
- ProcurementRequests
- Resources

---

## 24. PROJECT CLOSURE

### FR-CLS-001
System shall support project closure workflow.

### FR-CLS-002
System shall capture lessons learned.

### FR-CLS-003
System shall capture post implementation review.

### FR-CLS-004
System shall archive closed projects.

---

## 25. ACCEPTANCE CRITERIA

The system shall be accepted when:
- All functional requirements are implemented.
- Security testing is passed.
- Performance testing is passed.
- User acceptance testing is passed.
- Audit requirements are satisfied.
- Municipality approves final deployment.

---

END OF DOCUMENT
