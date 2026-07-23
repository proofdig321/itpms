import { tasks as mockTasks } from "@/data/tasks";
import { type TaskFormValues, taskPriorities, taskStatuses, taskTypes } from "@/lib/schemas/task";
import type { Task } from "@/types/task";

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

export async function createTask(projectCode: string, values: TaskFormValues): Promise<Task> {
  if (API_BASE_URL) {
    const { dependencies, ...taskPayload } = values;
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: getAuthHeaders("json"),
      body: JSON.stringify(taskPayload),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    const raw = await response.json();
    if (!response.ok) throw new Error(raw.message ?? "Failed to create task");
    const task = mapApiTask(raw.data ?? raw);

    if (dependencies?.length && task.id) {
      const depResponse = await fetch(`${API_BASE_URL}/tasks/${task.id}/dependencies`, {
        method: "POST",
        headers: getAuthHeaders("json"),
        body: JSON.stringify({ dependencies }),
      });
      if (!depResponse.ok) {
        const depErr = await depResponse.json().catch(() => ({}));
        throw new Error(depErr.message ?? "Task created but failed to save dependencies");
      }
    }

    return task;
  }

  const task: Task = {
    id: crypto.randomUUID(),
    projectCode,
    taskCode: `TSK-${String(mockTasks.length + 1).padStart(5, "0")}`,
    name: values.name,
    description: values.description,
    type: values.type,
    priority: values.priority,
    status: "not-started",
    duration: 0,
    milestone: false,
    plannedStart: values.plannedStart,
    plannedFinish: values.plannedFinish,
    percentComplete: 0,
    assignments: values.assignments ?? [],
    createdAt: new Date().toISOString(),
  };
  mockTasks.push(task);
  return task;
}

export async function updateTask(id: string, values: Partial<TaskFormValues>): Promise<Task | undefined> {
  if (API_BASE_URL) {
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

  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  mockTasks[index] = { ...mockTasks[index], ...values };
  return mockTasks[index];
}

export async function deleteTask(id: string): Promise<void> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to delete task");
    }
    return;
  }

  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) return;
  mockTasks.splice(index, 1);
}

export async function updateTaskProgress(
  id: string,
  data: { percentComplete: number; remarks: string; userId: string },
): Promise<void> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/progress`, {
      method: "POST",
      headers: getAuthHeaders("json"),
      body: JSON.stringify(data),
    });
    if (handleUnauthorized(response)) throw new Error("Session expired");
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message ?? "Failed to update progress");
    }
    return;
  }

  const task = mockTasks.find((t) => t.id === id);
  if (task) task.percentComplete = data.percentComplete;
}

export async function holdTask(id: string): Promise<void> {
  if (API_BASE_URL) {
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
}

export async function resumeTask(id: string): Promise<void> {
  if (API_BASE_URL) {
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
}

export async function cancelTask(id: string): Promise<void> {
  if (API_BASE_URL) {
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
}
