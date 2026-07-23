export interface ProjectDashboard {
  projectCode: string;
  title: string;
  status: string;
  progress: number;
  plannedStart: string;
  plannedFinish: string;
  manager: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface ProjectMetrics {
  projectCode: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  overdueTasks: number;
  onHoldTasks: number;
  completionRate: number;
  overdueRate: number;
}

export interface ProjectHealth {
  projectCode: string;
  overallHealth: "good" | "warning" | "critical";
  scheduleHealth: "good" | "warning" | "critical";
  scopeHealth: "good" | "warning" | "critical";
  issues: string[];
  recommendations: string[];
}

export interface ProjectForecast {
  projectCode: string;
  projectedEndDate: string;
  daysVariance: number;
  onTrack: boolean;
  completionProbability: number;
  remainingTasks: number;
  remainingDays: number;
}

export interface ProjectSchedule {
  projectCode: string;
  plannedStart: string;
  plannedFinish: string;
  actualStart: string | null;
  actualFinish: string | null;
  totalDuration: number;
  elapsedDays: number;
  remainingDays: number;
  tasks: ScheduleTask[];
}

export interface ScheduleTask {
  id: string;
  name: string;
  plannedStart: string;
  plannedFinish: string;
  status: string;
  percentComplete: number;
}

export interface ScheduleProgress {
  projectCode: string;
  overallProgress: number;
  plannedProgress: number;
  scheduleVariance: number;
  taskBreakdown: { status: string; count: number; percentage: number }[];
}
