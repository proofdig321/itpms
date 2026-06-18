"use client";

import { useMemo, useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { WbsNode, WbsStatus } from "@/types/wbs";

const statusConfig: Record<WbsStatus, { label: string; className: string }> = {
  "not-started": {
    label: "Not Started",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
  "in-progress": {
    label: "In Progress",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  completed: {
    label: "Completed",
    className: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
};

interface TreeNode extends WbsNode {
  children: TreeNode[];
}

function buildTree(nodes: WbsNode[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  for (const node of nodes) {
    map.set(node.id, { ...node, children: [] });
  }

  for (const node of nodes) {
    const treeNode = map.get(node.id)!;
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }

  return roots;
}

interface WbsTreeProps {
  nodes: WbsNode[];
}

export function WbsTree({ nodes }: WbsTreeProps) {
  const tree = useMemo(() => buildTree(nodes), [nodes]);

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
        <p className="font-medium text-sm">No WBS structure defined</p>
        <p className="mt-1 text-muted-foreground text-sm">Work breakdown structure will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="p-4">
        {tree.map((node) => (
          <WbsTreeNode key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}

interface WbsTreeNodeProps {
  node: TreeNode;
  depth: number;
}

function WbsTreeNode({ node, depth }: WbsTreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <button
          type="button"
          className="flex h-5 w-5 shrink-0 items-center justify-center"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse" : "Expand"}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          )}
        </button>

        <span className="shrink-0 font-mono text-muted-foreground text-xs">{node.code}</span>
        <span className="flex-1 truncate text-sm">{node.name}</span>

        <div className="flex shrink-0 items-center gap-2">
          <Progress value={node.progress} className="hidden h-1.5 w-16 sm:block" />
          <span className="w-8 text-right text-muted-foreground text-xs tabular-nums">{node.progress}%</span>
          <Badge className={`${statusConfig[node.status].className} text-xs`}>{statusConfig[node.status].label}</Badge>
        </div>
      </div>

      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <WbsTreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
