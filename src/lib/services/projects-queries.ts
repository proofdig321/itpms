import "server-only";

import { projects as mockProjects, type Project } from "@/data/projects";

import { getServerAuthHeaders } from "./server-api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  if (!API_BASE_URL) return null;
  try {
    const headers = await getServerAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      next: { revalidate: 30 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

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

export async function getProjects(): Promise<Project[]> {
  const data = await fetchApi<Record<string, unknown>[]>("/projects");
  if (data && Array.isArray(data)) {
    return data.map(mapApiProject);
  }
  return mockProjects;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const data = await fetchApi<Record<string, unknown>>(`/projects/${id}`);
  const raw = (data?.data as Record<string, unknown>) ?? data;
  if (raw?.id) return mapApiProject(raw);
  return mockProjects.find((p) => p.id === id);
}
