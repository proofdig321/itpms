import { wbsNodes as mockWbsNodes } from "@/data/wbs";
import type { WbsNodeFormValues } from "@/lib/schemas/wbs";
import type { WbsNode } from "@/types/wbs";

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
    startDate: raw.startDate ? (raw.startDate as string).split("T")[0] : undefined,
    endDate: raw.endDate ? (raw.endDate as string).split("T")[0] : undefined,
  };
}

export async function createWbsNode(projectCode: string, values: WbsNodeFormValues): Promise<WbsNode> {
  if (API_BASE_URL) {
    const payload: Record<string, unknown> = {
      projectCode,
      name: values.name,
      description: values.description || null,
      level: values.level,
      status: values.status,
      progress: values.progress,
      ownerId: values.ownerId || null, // Backend now accepts UUIDs - Issue #1 fixed!
      parentId: values.parentId || null,
      startDate: values.startDate || null,
      endDate: values.endDate || null,
    };

    const response = await fetch(`${API_BASE_URL}/wbs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `Failed to create WBS node (${response.status})`;
      throw new Error(message);
    }

    const raw = await response.json();
    return mapApiWbsNode(raw.data ?? raw.wbs ?? raw);
  }

  // Fallback to mock
  const node: WbsNode = {
    id: crypto.randomUUID(),
    projectCode,
    code: "",
    sequence: 0,
    depth: 0,
    name: values.name,
    description: values.description,
    level: values.level,
    status: values.status,
    progress: values.progress,
    ownerId: values.ownerId ?? null,
    parentId: values.parentId ?? null,
    startDate: values.startDate,
    endDate: values.endDate,
  };
  mockWbsNodes.push(node);
  return node;
}

export async function updateWbsNode(id: string, values: Partial<WbsNodeFormValues>): Promise<WbsNode | undefined> {
  if (API_BASE_URL) {
    const updatePayload = { ...values };
    // Backend now accepts UUIDs for ownerId - Issue #1 fixed!

    const response = await fetch(`${API_BASE_URL}/wbs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `Failed to update WBS node (${response.status})`;
      throw new Error(message);
    }

    const raw = await response.json();
    return mapApiWbsNode(raw.data ?? raw.wbs ?? raw);
  }

  // Fallback to mock
  const index = mockWbsNodes.findIndex((n) => n.id === id);
  if (index === -1) return undefined;
  mockWbsNodes[index] = { ...mockWbsNodes[index], ...values };
  return mockWbsNodes[index];
}

export async function deleteWbsNode(id: string): Promise<void> {
  if (API_BASE_URL) {
    const response = await fetch(`${API_BASE_URL}/wbs/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `Failed to delete WBS node (${response.status})`;
      throw new Error(message);
    }
    return;
  }

  // Fallback to mock
  const index = mockWbsNodes.findIndex((n) => n.id === id);
  if (index === -1) return;
  const idsToRemove = new Set<string>();
  const collectChildren = (parentId: string) => {
    idsToRemove.add(parentId);
    for (const node of mockWbsNodes) {
      if (node.parentId === parentId) {
        collectChildren(node.id);
      }
    }
  };
  collectChildren(id);
  const remaining = mockWbsNodes.filter((n) => !idsToRemove.has(n.id));
  mockWbsNodes.length = 0;
  mockWbsNodes.push(...remaining);
}
