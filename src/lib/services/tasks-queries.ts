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
    plannedCost: (raw.plannedCost as string) ?? "0.00",
    actualCost: (raw.actualCost as string) ?? "0.00",
    percentComplete: (raw.percentComplete as number) ?? 0,
    remarks: (raw.remarks as string) ?? null,
    assignments: Array.isArray(raw.assignments)
      ? (raw.assignments as Record<string, unknown>[]).map((a) => ({
          id: (a.id as string) ?? undefined,
          userId: a.userId as string,
          userName: (a.userName as string) ?? undefined,
          role: (a.role as string) ?? "",
          allocation: (a.allocation as number) ?? 100,
        }))
      : [],
    predecessorDependencies: Array.isArray(raw.predecessorDependencies)
      ? (raw.predecessorDependencies as Record<string, unknown>[]).map((d) => ({
          predecessorTaskId: d.predecessorTaskId as string,
          dependencyType: d.dependencyType as Task["predecessorDependencies"][number]["dependencyType"],
          lag: (d.lag as number) ?? 0,
          lead: (d.lead as number) ?? 0,
          mandatory: (d.mandatory as boolean) ?? false,
        }))
      : [],
    progressHistory: Array.isArray(raw.progressHistory)
      ? (raw.progressHistory as Record<string, unknown>[]).map((p) => ({
          id: p.id as string,
          progressDate: p.progressDate as string,
          percentComplete: p.percentComplete as number,
          remarks: (p.remarks as string) ?? null,
          updatedBy: p.updatedBy as string,
          updatedByName: (p.updatedByName as string) ?? undefined,
          createdAt: p.createdAt as string,
        }))
      : [],
    comments: Array.isArray(raw.comments)
      ? (raw.comments as Record<string, unknown>[]).map((c) => ({
          id: c.id as string,
          comment: c.comment as string,
          userId: c.userId as string,
          userName: (c.userName as string) ?? undefined,
          createdAt: c.createdAt as string,
        }))
      : [],
    approvals: Array.isArray(raw.approvals)
      ? (raw.approvals as Record<string, unknown>[]).map((a) => ({
          id: a.id as string,
          status: a.status as string,
          approvedBy: (a.approvedBy as string) ?? undefined,
          approvedByName: (a.approvedByName as string) ?? undefined,
          createdAt: a.createdAt as string,
        }))
      : [],
    createdAt: (raw.createdAt as string) ?? "",
    updatedAt: (raw.updatedAt as string) ?? "",
  };
}

export async function getTasks(projectCode?: string): Promise<Task[]> {
  if (projectCode) {
    return getTasksByProject(projectCode);
  }
  const data = await fetchApi<Record<string, unknown>>("/tasks");
  if (data) {
    const items = Array.isArray(data) ? data : (data.data as Record<string, unknown>[] | undefined);
    if (items && Array.isArray(items)) return items.map(mapApiTask);
  }
  return [];
}

export async function getTasksByProject(projectCode: string): Promise<Task[]> {
  const data = await fetchApi<Record<string, unknown>>(`/tasks?projectCode=${projectCode}`);
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
