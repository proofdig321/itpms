import { wbsNodes as mockWbsNodes, type WbsNode } from "@/data/wbs";

export async function getWbsByProject(projectCode: string): Promise<WbsNode[]> {
  try {
    return mockWbsNodes.filter((node) => node.projectCode === projectCode);
  } catch {
    return [];
  }
}

export async function getWbsNodeById(id: string): Promise<WbsNode | undefined> {
  try {
    return mockWbsNodes.find((node) => node.id === id);
  } catch {
    return undefined;
  }
}
