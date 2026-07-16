import { projects as mockProjects, type Project } from "@/data/projects";
import type { ProjectFormValues } from "@/lib/schemas/project";

import { getAuthHeaders, handleUnauthorized } from "./api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function mapApiProject(raw: Record<string, unknown>): Project {
  return {
    id: raw.id as string,
    projectCode: raw.projectCode as string,
    title: raw.title as string,
    description: (raw.description as string) ?? "",
    status: raw.status as Project["status"],
    progress: (raw.progress as number) ?? 0,
    managerId: (raw.managerId as string) ?? null,
    plannedStart: (raw.plannedStart as string) ?? (raw.startDate as string) ?? "",
    plannedFinish: (raw.plannedFinish as string) ?? (raw.endDate as string) ?? "",
    createdAt: (raw.created_at as string) ?? (raw.createdAt as string) ?? "",
  };
}

export async function createProject(values: ProjectFormValues): Promise<Project> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: getAuthHeaders("json"),
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        managerId: values.managerId,
        plannedStart: values.plannedStart,
        plannedFinish: values.plannedFinish,
      }),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    const raw = await response.json();
    if (response.ok) return mapApiProject(raw.data ?? raw.project ?? raw);
    throw new Error(raw.message ?? "Failed to create project");
  }

  const project: Project = {
    id: crypto.randomUUID(),
    projectCode: `ITP-${new Date().getFullYear()}-${String(mockProjects.length + 1).padStart(4, "0")}`,
    title: values.title,
    description: values.description,
    status: "not-started",
    progress: 0,
    managerId: values.managerId,
    plannedStart: values.plannedStart,
    plannedFinish: values.plannedFinish,
    createdAt: new Date().toISOString(),
  };
  mockProjects.push(project);
  return project;
}

export async function updateProject(id: string, values: Partial<ProjectFormValues>): Promise<Project | undefined> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeaders("json"),
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        managerId: values.managerId,
        plannedStart: values.plannedStart,
        plannedFinish: values.plannedFinish,
      }),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    const raw = await response.json();
    if (response.ok) return mapApiProject(raw.data ?? raw.project ?? raw);
    throw new Error(raw.message ?? "Failed to update project");
  }

  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  mockProjects[index] = { ...mockProjects[index], ...values };
  return mockProjects[index];
}

export async function deleteProject(id: string): Promise<void> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to delete project");
    }
    return;
  }

  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return;
  mockProjects.splice(index, 1);
}

export async function archiveProject(id: string): Promise<void> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/archive`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to archive project");
    }
  }
}

export async function closeProject(id: string): Promise<void> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}/close`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to close project");
    }
  }
}
