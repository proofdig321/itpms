import { wbsNodes as mockWbsNodes } from "@/data/wbs";
import type { WbsNodeFormValues } from "@/lib/schemas/wbs";
import type { WbsNode } from "@/types/wbs";

export async function createWbsNode(projectCode: string, values: WbsNodeFormValues): Promise<WbsNode> {
  const node: WbsNode = {
    id: crypto.randomUUID(),
    projectCode,
    code: "", // Backend generates WBS codes
    ...values,
    parentId: values.parentId || null,
    createdAt: new Date().toISOString(),
  } as WbsNode;
  mockWbsNodes.push(node);
  return node;
}

export async function updateWbsNode(id: string, values: Partial<WbsNodeFormValues>): Promise<WbsNode | undefined> {
  const index = mockWbsNodes.findIndex((n) => n.id === id);
  if (index === -1) return undefined;
  mockWbsNodes[index] = { ...mockWbsNodes[index], ...values };
  return mockWbsNodes[index];
}

export async function deleteWbsNode(id: string): Promise<void> {
  const index = mockWbsNodes.findIndex((n) => n.id === id);
  if (index === -1) return;
  // Remove node and all children
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
