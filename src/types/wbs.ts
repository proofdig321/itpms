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
