import { projects as mockProjects, type Project } from "@/data/projects";
import type { ProjectFormValues } from "@/lib/schemas/project";

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

function mapApiProject(raw: Record<string, unknown>): Project {
  return {
    id: raw.id as string,
    projectCode: raw.projectCode as string,
    title: raw.title as string,
    description: (raw.description as string) ?? "",
    status: raw.status as Project["status"],
    progress: raw.progress as number,
    managerId: (raw.managerId as string) ?? null,
    startDate: raw.startDate as string,
    endDate: raw.endDate as string,
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
  if (data && data.id) {
    return mapApiProject(data);
  }
  return mockProjects.find((p) => p.id === id);
}

export async function createProject(values: ProjectFormValues): Promise<Project> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const raw = await response.json();
        return mapApiProject(raw.data ?? raw);
      }
    } catch {
      // Fall through to mock
    }
  }

  const project: Project = {
    id: crypto.randomUUID(),
    projectCode: `ITP-${new Date().getFullYear()}-${String(mockProjects.length + 1).padStart(4, "0")}`,
    ...values,
    createdAt: new Date().toISOString(),
  };
  mockProjects.push(project);
  return project;
}

export async function updateProject(id: string, values: Partial<ProjectFormValues>): Promise<Project | undefined> {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
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
        return mapApiProject(raw.data ?? raw);
      }
    } catch {
      // Fall through to mock
    }
  }

  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  mockProjects[index] = { ...mockProjects[index], ...values };
  return mockProjects[index];
}

export async function deleteProject(id: string): Promise<void> {
  if (API_BASE_URL) {
    try {
      await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json", "ngrok-skip-browser-warning": "true" },
      });
      return;
    } catch {
      // Fall through to mock
    }
  }

  const index = mockProjects.findIndex((p) => p.id === id);
  if (index === -1) return;
  mockProjects.splice(index, 1);
}
