import { type TaskFormValues, taskPriorities, taskStatuses, taskTypes } from "@/lib/schemas/task";
import type { ApprovalAction, Task } from "@/types/task";

import { getAuthHeaders, handleUnauthorized } from "./api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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
    approvedPercentComplete: (raw.approvedPercentComplete as number) ?? 0,
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
      ? (raw.predecessorDependencies as Record<string, unknown>[]).map((d) => {
          // TaskDependencyResource returns { predecessor: { id, name, status }, dependencyType, lag, mandatory }
          // predecessorTaskId is nested under predecessor.id, not a top-level field
          const predecessor = d.predecessor as Record<string, unknown> | undefined;
          return {
            predecessorTaskId: (predecessor?.id ?? d.predecessorTaskId) as string,
            dependencyType: d.dependencyType as Task["predecessorDependencies"][number]["dependencyType"],
            lag: (d.lag as number) ?? 0,
            lead: (d.lead as number) ?? 0,
            mandatory: (d.mandatory as boolean) ?? false,
          };
        })
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
          taskId: (a.taskId as string) ?? "",
          action: (a.action as ApprovalAction) ?? "submitted",
          performedBy: (a.performedBy as string) ?? "",
          performedAt: (a.performedAt as string) ?? "",
          comments: (a.comments as string) ?? null,
          createdAt: (a.createdAt as string) ?? "",
          updatedAt: (a.updatedAt as string) ?? "",
        }))
      : [],
    createdAt: (raw.createdAt as string) ?? "",
    updatedAt: (raw.updatedAt as string) ?? "",
  };
}

export async function getTasksByProject(projectCode: string): Promise<Pick<Task, "id" | "taskCode" | "name">[]> {
  const response = await fetch(`${API_BASE_URL}/tasks?projectCode=${projectCode}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) return [];
  const data = await response.json();
  const items: Record<string, unknown>[] = Array.isArray(data) ? data : (data.data ?? []);
  return items.map((t) => ({
    id: t.id as string,
    taskCode: (t.taskCode as string) ?? "",
    name: t.name as string,
  }));
}

export async function createTask(_projectCode: string, values: TaskFormValues): Promise<Task> {
  const payload = {
    ...values,
    dependencies: undefined,
    predecessorDependencies: values.dependencies?.length
      ? values.dependencies.map(({ predecessorTaskId, dependencyType, lag, lead, mandatory }) => ({
          predecessorTaskId,
          dependencyType,
          lag,
          lead,
          mandatory,
        }))
      : undefined,
  };
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: getAuthHeaders("json"),
    body: JSON.stringify(payload),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  const text = await response.text();
  // biome-ignore lint: dynamic error shape
  let raw: any = null;
  try {
    raw = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  if (!response.ok)
    throw new Error(
      raw?.errors ? JSON.stringify(raw.errors) : (raw?.message ?? text.slice(0, 300) ?? "Failed to create task"),
    );
  return mapApiTask(raw?.data ?? raw);
}

export async function updateTask(id: string, values: Partial<TaskFormValues>): Promise<Task | undefined> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getAuthHeaders("json"),
    body: JSON.stringify(values),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (response.ok) {
    const raw = await response.json();
    return mapApiTask(raw.data ?? raw);
  }
  const err = await response.json();
  throw new Error(err.message ?? "Failed to update task");
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to delete task");
  }
}

export async function updateTaskProgress(
  id: string,
  data: { percentComplete: number; remarks: string; updatedBy: string; progressDate?: string; actualCost?: number },
): Promise<void> {
  const payload: Record<string, unknown> = {
    percentComplete: data.percentComplete,
    remarks: data.remarks,
    updatedBy: data.updatedBy,
  };
  if (data.progressDate) payload.progressDate = data.progressDate;
  if (data.actualCost !== undefined && data.actualCost !== null) payload.actualCost = data.actualCost;
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/progress`, {
    method: "POST",
    headers: getAuthHeaders("json"),
    body: JSON.stringify(payload),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to update progress");
  }
}

export async function holdTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/hold`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to hold task");
  }
}

export async function resumeTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/resume`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to resume task");
  }
}

export async function cancelTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/cancel`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to cancel task");
  }
}

export async function approveTask(id: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/approve`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  const raw = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(raw?.message ?? "Failed to approve task");
  return mapApiTask(raw?.data ?? raw);
}

export async function rejectTask(id: string, reason: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}/reject`, {
    method: "POST",
    headers: getAuthHeaders("json"),
    body: JSON.stringify({ reason }),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  const raw = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(raw?.message ?? "Failed to reject task");
  return mapApiTask(raw?.data ?? raw);
}
