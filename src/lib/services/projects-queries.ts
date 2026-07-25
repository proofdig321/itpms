import "server-only";

import type { Project } from "@/types/project";

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

const validStatuses: Project["status"][] = [
  "not-started",
  "in-progress",
  "completed",
  "archived",
  "closed",
  "cancelled",
];

function mapApiProject(raw: Record<string, unknown>): Project {
  const rawStatus = raw.status as string;
  return {
    id: raw.id as string,
    projectCode: raw.projectCode as string,
    title: raw.title as string,
    description: (raw.description as string) ?? "",
    status: validStatuses.includes(rawStatus as Project["status"]) ? (rawStatus as Project["status"]) : "not-started",
    health: (raw.health as Project["health"]) ?? undefined,
    progress: (raw.progress as number) ?? 0,
    managerId: (raw.managerId as string) ?? null,
    plannedStart: (raw.plannedStart as string) ?? (raw.startDate as string) ?? "",
    plannedFinish: (raw.plannedFinish as string) ?? (raw.endDate as string) ?? "",
    createdAt: (raw.created_at as string) ?? (raw.createdAt as string) ?? "",
  };
}

export async function getProjects(): Promise<Project[]> {
  const data = await fetchApi<Record<string, unknown>[]>("/projects");
  if (data && Array.isArray(data)) return data.map(mapApiProject);
  const wrapped = data as Record<string, unknown> | null;
  if (wrapped?.data && Array.isArray(wrapped.data))
    return (wrapped.data as Record<string, unknown>[]).map(mapApiProject);
  return [];
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const data = await fetchApi<Record<string, unknown>>(`/projects/${id}`);
  const raw = (data?.data as Record<string, unknown>) ?? data;
  if (raw?.id) return mapApiProject(raw);
  return undefined;
}
