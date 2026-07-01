import { tasks as mockTasks, type Task } from "@/data/tasks";
import type { TaskFormValues } from "@/lib/schemas/task";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchApi<T>(endpoint: string): Promise<T | null> {
  if (!API_BASE_URL) return null;
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { Accept: "application/json", "ngrok-skip-browser-warning": "true" },
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
    type: raw.type as Task["type"],
    priority: raw.priority as Task["priority"],
    status: raw.status as Task["status"],
    duration: (raw.duration as number) ?? 0,
    milestone: (raw.milestone as boolean) ?? false,
    plannedStart: raw.plannedStart as string,
    plannedFinish: raw.plannedFinish as string,
    actualStart: (raw.actualStart as string) ?? undefined,
    actualFinish: (raw.actualFinish as string) ?? undefined,
    percentComplete: (raw.percentComplete as number) ?? 0,
    assignee: (raw.assignee as string) ?? undefined,
    createdAt: (raw.createdAt as string) ?? "",
  };
}

export async function getTasks(projectCode?: string): Promise<Task[]> {
  if (projectCode) {
    return getTasksByProject(projectCode);
  }
  return mockTasks;
}

export async function getTasksByProject(projectCode: string): Promise<Task[]> {
  const data = await fetchApi<Record<string, unknown>>(`/tasks?projectCode=${projectCode}`);
  if (data) {
    const items = Array.isArray(data) ? data : (data.data as Record<string, unknown>[] | undefined);
    if (items && Array.isArray(items)) return items.map(mapApiTask);
  }
  return mockTasks.filter((t) => t.projectCode === projectCode);
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const data = await fetchApi<Record<string, unknown>>(`/tasks/${id}`);
  if (data?.id) return mapApiTask(data);
  return mockTasks.find((t) => t.id === id);
}

export async function createTask(projectCode: string, values: TaskFormValues): Promise<Task> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(values),
      });
      const raw = await response.json();
      if (response.ok) return mapApiTask(raw.data ?? raw);
      throw new Error(raw.message ?? "Failed to create task");
    } catch (err) {
      throw err;
    }
  }

  const task: Task = {
    id: crypto.randomUUID(),
    projectCode,
    taskCode: `TSK-${String(mockTasks.length + 1).padStart(5, "0")}`,
    name: values.name,
    description: values.description,
    type: values.type,
    priority: values.priority,
    status: values.status,
    duration: 0,
    milestone: false,
    plannedStart: values.plannedStart,
    plannedFinish: values.plannedFinish,
    percentComplete: 0,
    createdAt: new Date().toISOString(),
  };
  mockTasks.push(task);
  return task;
}

export async function updateTask(id: string, values: Partial<TaskFormValues>): Promise<Task | undefined> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const raw = await response.json();
        return mapApiTask(raw.data ?? raw);
      }
    } catch {
      // Fall through to mock
    }
  }

  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  mockTasks[index] = { ...mockTasks[index], ...values };
  return mockTasks[index];
}

export async function deleteTask(id: string): Promise<void> {
  if (API_BASE_URL) {
    try {
      await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "ngrok-skip-browser-warning": "true" },
      });
      return;
    } catch {
      // Fall through to mock
    }
  }

  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) return;
  mockTasks.splice(index, 1);
}
