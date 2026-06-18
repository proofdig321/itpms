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
