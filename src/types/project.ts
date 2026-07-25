export interface Project {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed" | "archived" | "closed" | "cancelled";
  health?: "on-track" | "at-risk" | "delayed" | "critical";
  progress: number;
  managerId: string | null;
  plannedStart: string;
  plannedFinish: string;
  createdAt: string;
}
