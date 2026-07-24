import type { WbsNodeFormValues } from "@/lib/schemas/wbs";
import type { WbsNode } from "@/types/wbs";

import { getAuthHeaders, handleUnauthorized } from "./api-helpers";

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

export async function createWbsNode(projectCode: string, values: WbsNodeFormValues): Promise<WbsNode> {
  const response = await fetch(`${API_BASE_URL}/wbs`, {
    method: "POST",
    headers: getAuthHeaders("json"),
    body: JSON.stringify({
      projectCode,
      name: values.name,
      description: values.description || null,
      level: values.level,
      ownerId: values.ownerId || null,
      parentId: values.parentId || null,
      plannedStart: values.plannedStart || null,
      plannedFinish: values.plannedFinish || null,
    }),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to create WBS node (${response.status})`);
  }
  const raw = await response.json();
  return mapApiWbsNode(raw.data ?? raw.wbs ?? raw);
}

export async function updateWbsNode(id: string, values: Partial<WbsNodeFormValues>): Promise<WbsNode | undefined> {
  const payload: Record<string, unknown> = {};
  if (values.name !== undefined) payload.name = values.name;
  if (values.description !== undefined) payload.description = values.description || null;
  if (values.level !== undefined) payload.level = values.level;
  if (values.ownerId !== undefined) payload.ownerId = values.ownerId || null;
  if (values.parentId !== undefined) payload.parentId = values.parentId || null;
  if (values.plannedStart !== undefined) payload.plannedStart = values.plannedStart || null;
  if (values.plannedFinish !== undefined) payload.plannedFinish = values.plannedFinish || null;

  const response = await fetch(`${API_BASE_URL}/wbs/${id}`, {
    method: "PUT",
    headers: getAuthHeaders("json"),
    body: JSON.stringify(payload),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to update WBS node (${response.status})`);
  }
  const raw = await response.json();
  return mapApiWbsNode(raw.data ?? raw.wbs ?? raw);
}

export async function deleteWbsNode(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/wbs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (handleUnauthorized(response)) throw new Error("Session expired");
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to delete WBS node (${response.status})`);
  }
}
