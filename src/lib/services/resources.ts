import "server-only";

import { resources as mockResources, type Resource } from "@/data/resources";

export async function getResources(): Promise<Resource[]> {
  try {
    return mockResources;
  } catch {
    return [];
  }
}

export async function getResourcesByProject(projectCode: string): Promise<Resource[]> {
  try {
    return mockResources.filter((r) => r.projectCode === projectCode);
  } catch {
    return [];
  }
}
