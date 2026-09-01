export interface Project {
  id: string;
  projectCode: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed" | "archived" | "closed" | "cancelled";
  health?: "on-track" | "at-risk" | "delayed" | "critical" | "not-planned";
  progress: number;
  managerId: string | null;
  plannedStart: string;
  plannedFinish: string;
  forecastFinish?: string;
  createdAt: string;
}
