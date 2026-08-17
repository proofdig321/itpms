import type { WbsNode } from "@/types/wbs";

import { getAuthHeaders } from "./api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

export async function getWbsNodesByProject(projectCode: string): Promise<WbsNode[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/wbs?projectCode=${projectCode}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return [];
    const data = await response.json();
    const items: Record<string, unknown>[] = Array.isArray(data) ? data : (data.data ?? []);
    return items.map(mapApiWbsNode);
  } catch {
    return [];
  }
}
