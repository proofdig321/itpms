import "server-only";

import { taskPriorities, taskStatuses, taskTypes } from "@/lib/schemas/task";
import type { Task } from "@/types/task";

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

function mapApiTask(raw: Record<string, unknown>): Task {
  return {
    id: raw.id as string,
    projectCode: raw.projectCode as string,
    wbsNodeId: (raw.wbsNodeId as string) ?? undefined,
    taskCode: (raw.taskCode as string) ?? "",
    name: raw.name as string,
    description: (raw.description as string) ?? "",
    type: (taskTypes.includes(raw.type as Task["type"]) ? raw.type : "planning") as Task["type"],
    priority: (taskPriorities.includes(raw.priority as Task["priority"]) ? raw.priority : "medium") as Task["priority"],
    status: (taskStatuses.includes(raw.status as Task["status"])
      ? raw.status
      : raw.status === "todo"
        ? "in-progress"
        : "not-started") as Task["status"],
    duration: (raw.duration as number) ?? 0,
    milestone: (raw.milestone as boolean) ?? false,
    plannedStart: raw.plannedStart as string,
    plannedFinish: raw.plannedFinish as string,
    actualStart: (raw.actualStart as string) ?? undefined,
    actualFinish: (raw.actualFinish as string) ?? undefined,
    percentComplete: (raw.percentComplete as number) ?? 0,
    assignments: Array.isArray(raw.assignments)
      ? (raw.assignments as Record<string, unknown>[]).map((a) => ({
          userId: a.userId as string,
          role: (a.role as string) ?? "",
          allocation: (a.allocation as number) ?? 100,
        }))
      : [],
    createdAt: (raw.createdAt as string) ?? "",
  };
}

export async function getTasks(projectCode?: string): Promise<Task[]> {
  if (projectCode) {
    return getTasksByProject(projectCode);
  }
  const data = await fetchApi<Record<string, unknown>>("/tasks/all");
  if (data) {
    const items = Array.isArray(data) ? data : (data.data as Record<string, unknown>[] | undefined);
    if (items && Array.isArray(items)) return items.map(mapApiTask);
  }
  return [];
}

export async function getTasksByProject(projectCode: string): Promise<Task[]> {
  const data = await fetchApi<Record<string, unknown>>(`/tasks/project?projectCode=${projectCode}`);
  if (data) {
    const items = Array.isArray(data) ? data : (data.data as Record<string, unknown>[] | undefined);
    if (items && Array.isArray(items)) return items.map(mapApiTask);
  }
  return [];
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const data = await fetchApi<Record<string, unknown>>(`/tasks/${id}`);
  const raw = (data?.data as Record<string, unknown>) ?? data;
  if (raw?.id) return mapApiTask(raw);
  return undefined;
}
