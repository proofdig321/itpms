import "server-only";

import type {
  ProjectDashboard,
  ProjectForecast,
  ProjectHealth,
  ProjectMetrics,
  ProjectSchedule,
  ScheduleProgress,
} from "@/types/project-dashboard";

import { getServerAuthHeaders } from "./server-api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchProjectEndpoint<T>(projectCode: string, endpoint: string): Promise<T | null> {
  if (!API_BASE_URL) return null;
  try {
    const headers = await getServerAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/projects/${projectCode}/${endpoint}`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const json = await response.json();
    return (json.data ?? json) as T;
  } catch {
    return null;
  }
}

export async function getProjectDashboard(projectCode: string): Promise<ProjectDashboard | null> {
  return fetchProjectEndpoint<ProjectDashboard>(projectCode, "dashboard");
}

export async function getProjectMetrics(projectCode: string): Promise<ProjectMetrics | null> {
  return fetchProjectEndpoint<ProjectMetrics>(projectCode, "metrics");
}

export async function getProjectHealth(projectCode: string): Promise<ProjectHealth | null> {
  return fetchProjectEndpoint<ProjectHealth>(projectCode, "health");
}

export async function getProjectForecast(projectCode: string): Promise<ProjectForecast | null> {
  return fetchProjectEndpoint<ProjectForecast>(projectCode, "forecast");
}

export async function getProjectSchedule(projectCode: string): Promise<ProjectSchedule | null> {
  return fetchProjectEndpoint<ProjectSchedule>(projectCode, "schedule");
}

export async function getScheduleProgress(projectCode: string): Promise<ScheduleProgress | null> {
  return fetchProjectEndpoint<ScheduleProgress>(projectCode, "schedule/progress");
}
