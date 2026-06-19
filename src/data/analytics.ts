import "server-only";

import type { Baseline, CriticalPathTask, EarnedValueMetrics, Forecast } from "@/types/analytics";

export const baselines: Baseline[] = [
  {
    id: "bl1",
    projectCode: "ITPMS-001",
    version: 1,
    status: "approved",
    approvedBy: "Mzo Nkosi",
    approvedAt: "2025-01-20",
    scope: "Full network infrastructure upgrade across 12 municipal buildings",
    totalCost: 2860000,
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    createdAt: "2025-01-15",
  },
  {
    id: "bl2",
    projectCode: "ITPMS-002",
    version: 1,
    status: "pending-approval",
    scope: "ERP system migration from legacy to cloud platform",
    totalCost: 3450000,
    startDate: "2025-02-01",
    endDate: "2025-08-31",
    createdAt: "2025-01-25",
  },
];

export const evmMetrics: EarnedValueMetrics[] = [
  {
    projectCode: "ITPMS-001",
    plannedValue: 1430000,
    earnedValue: 1287000,
    actualCost: 1330000,
    scheduleVariance: -143000,
    costVariance: -43000,
    spiIndex: 0.9,
    cpiIndex: 0.97,
  },
];

export const criticalPathTasks: CriticalPathTask[] = [
  {
    id: "t1",
    name: "Prepare Technical Evaluation Criteria",
    duration: 5,
    float: 0,
    isCritical: true,
    plannedStart: "2025-03-02",
    plannedFinish: "2025-03-07",
  },
  {
    id: "t2",
    name: "Score Vendor Technical Proposals",
    duration: 10,
    float: 0,
    isCritical: true,
    plannedStart: "2025-03-08",
    plannedFinish: "2025-03-20",
  },
  {
    id: "t3",
    name: "Verify BBBEE Certificates",
    duration: 3,
    float: 2,
    isCritical: false,
    plannedStart: "2025-03-21",
    plannedFinish: "2025-03-24",
  },
  {
    id: "t4",
    name: "Prepare Installation Schedule",
    duration: 5,
    float: 0,
    isCritical: true,
    plannedStart: "2025-05-01",
    plannedFinish: "2025-05-06",
  },
];

export const forecasts: Forecast[] = [
  {
    projectCode: "ITPMS-001",
    estimateAtCompletion: 2950000,
    estimateToComplete: 1620000,
    varianceAtCompletion: -90000,
    projectedEndDate: "2025-07-15",
  },
];
