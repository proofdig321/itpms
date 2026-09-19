export type TaskType =
  | "planning"
  | "design"
  | "procurement"
  | "implementation"
  | "testing"
  | "training"
  | "documentation"
  | "closure"
  | "other";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export type TaskStatus = "not-started" | "in-progress" | "completed" | "on-hold" | "pending-approval" | "cancelled";

export interface TaskAssignment {
  id?: string;
  userId: string;
  userName?: string;
  role: string;
  allocation: number;
}

export interface TaskDependency {
  predecessorTaskId: string;
  dependencyType: "FS" | "SS" | "FF" | "SF";
  lag: number;
  lead: number;
  mandatory: boolean;
}

export interface TaskProgressEntry {
  id: string;
  progressDate: string;
  percentComplete: number;
  remarks: string | null;
  updatedBy: string;
  updatedByName?: string;
  createdAt: string;
}

export interface TaskComment {
  id: string;
  comment: string;
  userId: string;
  userName?: string;
  createdAt: string;
}

export type ApprovalAction = "submitted" | "approved" | "rejected" | "cancelled";

export interface TaskApproval {
  id: string;
  taskId: string;
  action: ApprovalAction;
  performedBy: string;
  performedAt: string;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectCode: string;
  wbsNodeId?: string;
  taskCode: string;
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  duration: number;
  milestone: boolean;
  plannedStart: string;
  plannedFinish: string;
  actualStart?: string;
  actualFinish?: string;
  plannedCost: string;
  actualCost: string;
  percentComplete: number;
  approvedPercentComplete: number;
  remarks: string | null;
  assignments: TaskAssignment[];
  predecessorDependencies: TaskDependency[];
  progressHistory: TaskProgressEntry[];
  comments: TaskComment[];
  approvals: TaskApproval[];
  createdAt: string;
  updatedAt: string;
}
