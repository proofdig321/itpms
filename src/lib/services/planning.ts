import { type Milestone, milestones as mockMilestones } from "@/data/planning";

export async function getMilestones(): Promise<Milestone[]> {
  try {
    return mockMilestones;
  } catch {
    return [];
  }
}

export async function getMilestoneById(id: string): Promise<Milestone | undefined> {
  try {
    return mockMilestones.find((m) => m.id === id);
  } catch {
    return undefined;
  }
}

export async function getMilestonesByProject(projectCode: string): Promise<Milestone[]> {
  try {
    return mockMilestones.filter((m) => m.projectCode === projectCode);
  } catch {
    return [];
  }
}
