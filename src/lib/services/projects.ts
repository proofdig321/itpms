import type { ProjectFormValues } from "@/lib/schemas/project";
import type { Project } from "@/types/project";

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

export async function updateProject(id: string, values: Partial<ProjectFormValues>): Promise<Project | undefined> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/projects/${id}`, {
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
  } catch (e) {
    throw new Error(`Network error: Unable to reach API server. ${e instanceof Error ? e.message : ""}`);
  }
  if (handleUnauthorized(response)) throw new Error("Session expired");
  const text = await response.text();
  // biome-ignore lint: any needed for dynamic error shape
  let raw: any = null;
  try {
    raw = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  if (response.ok && raw) return mapApiProject(raw.data ?? raw.project ?? raw);
  const errMsg =
    raw?.message ??
    raw?.error?.message ??
    (raw?.errors ? JSON.stringify(raw.errors) : null) ??
    (raw?.exception ? `${raw.exception}: ${raw.trace?.[0]?.file ?? ""}` : null) ??
    (text.slice(0, 200) || `Server error ${response.status}`);
  console.error("[updateProject] PUT /projects failed:", response.status, text.slice(0, 500));
  throw new Error(errMsg);
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to delete project");
  }
}

export async function archiveProject(id: string): Promise<void> {
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

export async function closeProject(id: string): Promise<void> {
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

export async function recalculateSchedule(projectCode: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/projects/${projectCode}/schedule/recalculate`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to recalculate schedule");
  }
}
