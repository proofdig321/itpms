export interface Milestone {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  status: "on-track" | "at-risk" | "delayed" | "completed" | "not-started";
  progress: number;
  assignee: string;
  startDate: string;
  dueDate: string;
  createdAt: string;
}

export const milestones: Milestone[] = [
  {
    id: "1",
    projectCode: "ITPMS-001",
    title: "Site Survey & Assessment",
    description: "Complete physical site surveys of all municipal buildings for network readiness.",
    status: "completed",
    progress: 100,
    assignee: "Kagiso Mabena",
    startDate: "2025-01-15",
    dueDate: "2025-02-15",
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    projectCode: "ITPMS-001",
    title: "Core Switch Procurement",
    description: "Procure and deliver core network switches per SCM process.",
    status: "on-track",
    progress: 70,
    assignee: "Thabo Mokoena",
    startDate: "2025-02-16",
    dueDate: "2025-03-31",
    createdAt: "2025-01-10",
  },
  {
    id: "3",
    projectCode: "ITPMS-002",
    title: "Data Migration Planning",
    description: "Map legacy data structures to new ERP schema and define migration scripts.",
    status: "at-risk",
    progress: 35,
    assignee: "Naledi Dlamini",
    startDate: "2025-02-01",
    dueDate: "2025-04-30",
    createdAt: "2025-01-20",
  },
  {
    id: "4",
    projectCode: "ITPMS-002",
    title: "UAT Environment Setup",
    description: "Provision user acceptance testing environment for ERP validation.",
    status: "not-started",
    progress: 0,
    assignee: "Lindiwe Radebe",
    startDate: "2025-05-01",
    dueDate: "2025-06-15",
    createdAt: "2025-01-20",
  },
  {
    id: "5",
    projectCode: "ITPMS-003",
    title: "Endpoint Agent Deployment",
    description: "Deploy endpoint protection agents across all municipal workstations.",
    status: "delayed",
    progress: 15,
    assignee: "Sipho Nkosi",
    startDate: "2025-01-15",
    dueDate: "2025-03-31",
    createdAt: "2024-12-15",
  },
  {
    id: "6",
    projectCode: "ITPMS-006",
    title: "Server Room Audit",
    description: "Audit existing distributed server rooms for consolidation planning.",
    status: "on-track",
    progress: 60,
    assignee: "Kagiso Mabena",
    startDate: "2025-03-01",
    dueDate: "2025-04-15",
    createdAt: "2025-02-20",
  },
];
