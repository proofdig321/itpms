import "server-only";

import { risks as mockRisks, type Risk } from "@/data/risks";

export async function getRisks(): Promise<Risk[]> {
  try {
    return mockRisks;
  } catch {
    return [];
  }
}

export async function getRisksByProject(projectCode: string): Promise<Risk[]> {
  try {
    return mockRisks.filter((r) => r.projectCode === projectCode);
  } catch {
    return [];
  }
}
