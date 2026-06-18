import { projects as mockProjects, type Project } from "@/data/projects";
import type { ProjectFormValues } from "@/lib/schemas/project";

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

export async function createProject(values: ProjectFormValues): Promise<Project> {
  const project: Project = {
    id: crypto.randomUUID(),
    projectCode: `ITP-${new Date().getFullYear()}-${String(mockProjects.length + 1).padStart(4, "0")}`,
    ...values,
    createdAt: new Date().toISOString(),
  };
  mockProjects.push(project);
  return project;
}

export async function updateProject(id: string, values: Partial<ProjectFormValues>): Promise<Project | undefined> {
  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  mockProjects[index] = { ...mockProjects[index], ...values };
  return mockProjects[index];
}

export async function deleteProject(id: string): Promise<void> {
  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return;
  mockProjects.splice(index, 1);
}
