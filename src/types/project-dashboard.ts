export interface ProjectDashboard {
  project: {
    id: string;
    projectCode: string;
    status: string;
    health: string;
    healthReason: string;
    progress: number;
    manager: string | null;
  };
  schedule: {
    plannedStart: string;
    plannedFinish: string;
    actualStart: string | null;
    actualFinish: string | null;
    forecastFinish: string;
    remainingWorkingDays: number;
    forecastDuration: number;
  };
  metrics: {
    expectedProgress: number;
    actualProgress: number;
    scheduleVariance: number;
    schedulePerformanceIndex: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    overdueTaskPercentage: number;
    criticalPathDelayed: boolean;
  };
  summary: {
    progress: number;
    completedTasks: number;
    remainingTasks: number;
    forecastFinish: string;
  };
}

export interface ProjectMetrics {
  expectedProgress: number;
  actualProgress: number;
  scheduleVariance: number;
  schedulePerformanceIndex: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  onHoldTasks: number;
  overdueTaskPercentage: number;
  criticalPathDelayed: boolean;
  forecastFinish: string;
}

export interface ProjectHealth {
  projectCode: string;
  health: "not-planned" | "on-track" | "at-risk" | "delayed" | "critical";
  status: string;
  scheduleVarianceDays: number;
  progressVariance: number;
  forecastFinish: string;
  plannedProgress: number;
  actualProgress: number;
  overdueTasks: number;
  onHoldTasks: number;
  recommendations: string[];
}

export interface ProjectForecast {
  forecastFinish: string;
  remainingWorkingDays: number;
  forecastDuration: number;
}

export interface ProjectSchedule {
  plannedStart: string;
  plannedFinish: string;
  actualStart: string | null;
  actualFinish: string | null;
  forecastFinish: string;
  progress: number;
  status: string;
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
  plannedProgress: number;
  actualProgress: number;
}
