import { projects as mockProjects, type Project } from "@/data/projects";

export async function getProjects(): Promise<Project[]> {
  try {
    return mockProjects;
  } catch {
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  try {
    return mockProjects.find((p) => p.id === id);
  } catch {
    return undefined;
  }
}
