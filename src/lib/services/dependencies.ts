import "server-only";

import { dependencies as mockDependencies, type TaskDependency } from "@/data/dependencies";

export async function getDependenciesByProject(taskIds: string[]): Promise<TaskDependency[]> {
  try {
    return mockDependencies.filter((d) => taskIds.includes(d.sourceTaskId) || taskIds.includes(d.targetTaskId));
  } catch {
    return [];
  }
}
