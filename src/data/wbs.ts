export type WbsLevel = "project" | "phase" | "deliverable" | "work-package" | "task" | "sub-task";

export type WbsStatus = "not-started" | "in-progress" | "completed";

export interface WbsNode {
  id: string;
  projectCode: string;
  parentId: string | null;
  code: string;
  name: string;
  description?: string;
  level: WbsLevel;
  status: WbsStatus;
  startDate?: string;
  endDate?: string;
  progress: number;
  assignee?: string;
}

export const wbsNodes: WbsNode[] = [
  {
    id: "w1",
    projectCode: "ITPMS-001",
    parentId: null,
    code: "1.0",
    name: "Network Infrastructure Upgrade",
    level: "project",
    status: "in-progress",
    progress: 45,
  },
  {
    id: "w1-1",
    projectCode: "ITPMS-001",
    parentId: "w1",
    code: "1.1",
    name: "Planning Phase",
    level: "phase",
    status: "completed",
    progress: 100,
    startDate: "2025-01-15",
    endDate: "2025-02-15",
    assignee: "Kagiso Mabena",
  },
  {
    id: "w1-2",
    projectCode: "ITPMS-001",
    parentId: "w1",
    code: "1.2",
    name: "Procurement Phase",
    level: "phase",
    status: "in-progress",
    progress: 60,
    startDate: "2025-02-16",
    endDate: "2025-04-30",
    assignee: "Thabo Mokoena",
  },
  {
    id: "w1-2-1",
    projectCode: "ITPMS-001",
    parentId: "w1-2",
    code: "1.2.1",
    name: "RFQ Issuance",
    level: "deliverable",
    status: "completed",
    progress: 100,
    startDate: "2025-02-16",
    endDate: "2025-03-01",
    assignee: "Thabo Mokoena",
  },
  {
    id: "w1-2-2",
    projectCode: "ITPMS-001",
    parentId: "w1-2",
    code: "1.2.2",
    name: "Supplier Evaluation",
    level: "deliverable",
    status: "in-progress",
    progress: 50,
    startDate: "2025-03-02",
    endDate: "2025-04-15",
    assignee: "Naledi Dlamini",
  },
  {
    id: "w1-2-2-1",
    projectCode: "ITPMS-001",
    parentId: "w1-2-2",
    code: "1.2.2.1",
    name: "Technical Scoring",
    level: "task",
    status: "in-progress",
    progress: 40,
    startDate: "2025-03-02",
    endDate: "2025-03-20",
    assignee: "Sipho Nkosi",
  },
  {
    id: "w1-2-2-2",
    projectCode: "ITPMS-001",
    parentId: "w1-2-2",
    code: "1.2.2.2",
    name: "Financial Scoring",
    level: "task",
    status: "not-started",
    progress: 0,
    startDate: "2025-03-21",
    endDate: "2025-04-05",
    assignee: "Lindiwe Radebe",
  },
  {
    id: "w1-3",
    projectCode: "ITPMS-001",
    parentId: "w1",
    code: "1.3",
    name: "Installation Phase",
    level: "phase",
    status: "not-started",
    progress: 0,
    startDate: "2025-05-01",
    endDate: "2025-06-15",
  },
  {
    id: "w1-4",
    projectCode: "ITPMS-001",
    parentId: "w1",
    code: "1.4",
    name: "Testing Phase",
    level: "phase",
    status: "not-started",
    progress: 0,
    startDate: "2025-06-16",
    endDate: "2025-06-30",
  },
];
