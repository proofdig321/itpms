import "server-only";

import {
  type MilestoneOverview,
  milestoneOverview as mockMilestoneOverview,
  portfolioSummary as mockPortfolioSummary,
  recentActivity as mockRecentActivity,
  statusDistribution as mockStatusDistribution,
  type PortfolioSummary,
  type RecentActivity,
  type StatusDistribution,
} from "@/data/monitoring";

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  try {
    return mockPortfolioSummary;
  } catch {
    return { totalProjects: 0, activeProjects: 0, delayedProjects: 0, completedProjects: 0, notStartedProjects: 0 };
  }
}

export async function getStatusDistribution(): Promise<StatusDistribution[]> {
  try {
    return mockStatusDistribution;
  } catch {
    return [];
  }
}

export async function getMilestoneOverview(): Promise<MilestoneOverview> {
  try {
    return mockMilestoneOverview;
  } catch {
    return { totalMilestones: 0, completedMilestones: 0, overdueMilestones: 0, averageProgress: 0 };
  }
}

export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    return mockRecentActivity;
  } catch {
    return [];
  }
}
