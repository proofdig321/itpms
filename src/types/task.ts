export type TaskType =
  | "planning"
  | "design"
  | "procurement"
  | "implementation"
  | "testing"
  | "training"
  | "documentation"
  | "closure";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export type TaskStatus = "draft" | "not-started" | "in-progress" | "completed" | "on-hold";

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
  percentComplete: number;
  assignee?: string;
  createdAt: string;
}
