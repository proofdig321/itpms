export interface Project {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  status: "on-track" | "at-risk" | "delayed" | "completed" | "not-started";
  progress: number;
  managerId: string | null;
  plannedStart: string;
  plannedFinish: string;
  createdAt: string;
}
