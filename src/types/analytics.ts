export type BaselineStatus = "draft" | "pending-approval" | "approved" | "superseded";

export interface Baseline {
  id: string;
  projectCode: string;
  version: number;
  status: BaselineStatus;
  approvedBy?: string;
  approvedAt?: string;
  scope: string;
  totalCost: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface EarnedValueMetrics {
  projectCode: string;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  scheduleVariance: number;
  costVariance: number;
  spiIndex: number;
  cpiIndex: number;
}

export interface CriticalPathTask {
  id: string;
  name: string;
  duration: number;
  float: number;
  isCritical: boolean;
  plannedStart: string;
  plannedFinish: string;
}

export interface Forecast {
  projectCode: string;
  estimateAtCompletion: number;
  estimateToComplete: number;
  varianceAtCompletion: number;
  projectedEndDate: string;
}
