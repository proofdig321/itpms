import "server-only";

import {
  baselines as mockBaselines,
  criticalPathTasks as mockCriticalPath,
  evmMetrics as mockEvm,
  forecasts as mockForecasts,
} from "@/data/analytics";
import type { Baseline, CriticalPathTask, EarnedValueMetrics, Forecast } from "@/types/analytics";

export async function getBaselinesByProject(projectCode: string): Promise<Baseline[]> {
  try {
    return mockBaselines.filter((b) => b.projectCode === projectCode);
  } catch {
    return [];
  }
}

export async function getBaselines(): Promise<Baseline[]> {
  try {
    return mockBaselines;
  } catch {
    return [];
  }
}

export async function getEvmByProject(projectCode: string): Promise<EarnedValueMetrics | undefined> {
  try {
    return mockEvm.find((e) => e.projectCode === projectCode);
  } catch {
    return undefined;
  }
}

export async function getCriticalPath(_projectCode: string): Promise<CriticalPathTask[]> {
  try {
    return mockCriticalPath;
  } catch {
    return [];
  }
}

export async function getForecast(projectCode: string): Promise<Forecast | undefined> {
  try {
    return mockForecasts.find((f) => f.projectCode === projectCode);
  } catch {
    return undefined;
  }
}
