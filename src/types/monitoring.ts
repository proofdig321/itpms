export interface PortfolioSummary {
  totalProjects: number;
  activeProjects: number;
  delayedProjects: number;
  completedProjects: number;
  notStartedProjects: number;
}

export interface StatusDistribution {
  status: "on-track" | "at-risk" | "delayed";
  count: number;
  percentage: number;
}

export interface MilestoneOverview {
  totalMilestones: number;
  completedMilestones: number;
  overdueMilestones: number;
  averageProgress: number;
}

export interface RecentActivity {
  id: string;
  projectCode: string;
  description: string;
  timestamp: string;
}
