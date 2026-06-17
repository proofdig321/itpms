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

export const portfolioSummary: PortfolioSummary = {
  totalProjects: 6,
  activeProjects: 4,
  delayedProjects: 1,
  completedProjects: 1,
  notStartedProjects: 0,
};

export const statusDistribution: StatusDistribution[] = [
  { status: "on-track", count: 2, percentage: 50 },
  { status: "at-risk", count: 1, percentage: 25 },
  { status: "delayed", count: 1, percentage: 25 },
];

export const milestoneOverview: MilestoneOverview = {
  totalMilestones: 6,
  completedMilestones: 1,
  overdueMilestones: 1,
  averageProgress: 47,
};

export const recentActivity: RecentActivity[] = [
  {
    id: "1",
    projectCode: "ITPMS-001",
    description: "Core Switch Procurement milestone updated to 70% progress.",
    timestamp: "2025-03-28T09:15:00Z",
  },
  {
    id: "2",
    projectCode: "ITPMS-003",
    description: "Endpoint Agent Deployment flagged as delayed.",
    timestamp: "2025-03-27T14:30:00Z",
  },
  {
    id: "3",
    projectCode: "ITPMS-006",
    description: "Server Room Audit milestone reached 60% completion.",
    timestamp: "2025-03-26T11:00:00Z",
  },
  {
    id: "4",
    projectCode: "ITPMS-002",
    description: "Data Migration Planning status changed to at-risk.",
    timestamp: "2025-03-25T16:45:00Z",
  },
  {
    id: "5",
    projectCode: "ITPMS-001",
    description: "Site Survey & Assessment milestone marked as completed.",
    timestamp: "2025-03-24T10:00:00Z",
  },
];
