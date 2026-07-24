import type { WbsNode } from "@/types/wbs";

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

function mapApiWbsNode(raw: Record<string, unknown>): WbsNode {
  return {
    id: raw.id as string,
    projectCode: raw.projectCode as string,
    parentId: (raw.parentId as string) ?? null,
    ownerId: (raw.ownerId as string) ?? null,
    sequence: (raw.sequence as number) ?? 0,
    depth: (raw.depth as number) ?? 0,
    code: (raw.code as string) ?? "",
    name: raw.name as string,
    description: (raw.description as string) ?? undefined,
    level: raw.level as WbsNode["level"],
    status: raw.status as WbsNode["status"],
    progress: (raw.progress as number) ?? 0,
    plannedStart: raw.plannedStart ? (raw.plannedStart as string).split("T")[0] : undefined,
    plannedFinish: raw.plannedFinish ? (raw.plannedFinish as string).split("T")[0] : undefined,
  };
}

export async function getWbsByProject(projectCode: string): Promise<WbsNode[]> {
  const data = await fetchApi<Record<string, unknown>>(`/wbs?projectCode=${projectCode}`);
  if (data) {
    const items = Array.isArray(data) ? data : (data.data as Record<string, unknown>[] | undefined);
    if (items && Array.isArray(items)) return items.map(mapApiWbsNode);
  }
  return [];
}

export async function getWbsNodeById(id: string): Promise<WbsNode | undefined> {
  const data = await fetchApi<Record<string, unknown>>(`/wbs/${id}`);
  if (data?.id) return mapApiWbsNode(data);
  return undefined;
}
