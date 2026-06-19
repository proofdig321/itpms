import { tasks as mockTasks, type Task } from "@/data/tasks";
import type { TaskFormValues } from "@/lib/schemas/task";

export async function getTasks(): Promise<Task[]> {
  try {
    return mockTasks;
  } catch {
    return [];
  }
}

export async function getTasksByProject(projectCode: string): Promise<Task[]> {
  try {
    return mockTasks.filter((t) => t.projectCode === projectCode);
  } catch {
    return [];
  }
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  try {
    return mockTasks.find((t) => t.id === id);
  } catch {
    return undefined;
  }
}

export async function createTask(projectCode: string, values: TaskFormValues): Promise<Task> {
  const task: Task = {
    id: crypto.randomUUID(),
    projectCode,
    ...values,
    createdAt: new Date().toISOString(),
  };
  mockTasks.push(task);
  return task;
}

export async function updateTask(id: string, values: Partial<TaskFormValues>): Promise<Task | undefined> {
  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  mockTasks[index] = { ...mockTasks[index], ...values };
  return mockTasks[index];
}

export async function deleteTask(id: string): Promise<void> {
  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) return;
  mockTasks.splice(index, 1);
}
