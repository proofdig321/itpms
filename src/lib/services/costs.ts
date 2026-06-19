import "server-only";

import { type CostItem, costItems as mockCostItems } from "@/data/costs";

export async function getCostItems(): Promise<CostItem[]> {
  try {
    return mockCostItems;
  } catch {
    return [];
  }
}

export async function getCostItemsByProject(projectCode: string): Promise<CostItem[]> {
  try {
    return mockCostItems.filter((c) => c.projectCode === projectCode);
  } catch {
    return [];
  }
}
