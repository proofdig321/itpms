import "server-only";

import { procurementItems as mockProcurement, type ProcurementItem } from "@/data/procurement";

export async function getProcurementItems(): Promise<ProcurementItem[]> {
  try {
    return mockProcurement;
  } catch {
    return [];
  }
}

export async function getProcurementByProject(projectCode: string): Promise<ProcurementItem[]> {
  try {
    return mockProcurement.filter((p) => p.projectCode === projectCode);
  } catch {
    return [];
  }
}
