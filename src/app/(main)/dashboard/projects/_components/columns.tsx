"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";
import { Archive, CheckCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { archiveProject, closeProject, deleteProject } from "@/lib/services/projects";
import type { Project } from "@/types/project";

const statusConfig: Record<string, { label: string; className: string }> = {
  "not-started": {
    label: "Not Started",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  completed: {
    label: "Completed",
    className: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  archived: {
    label: "Archived",
    className: "border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
  closed: {
    label: "Closed",
    className: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "projectCode",
    header: "Code",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
          {project.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Project["status"];
      const config = statusConfig[status] ?? statusConfig["not-started"];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number;
      return (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="h-2 w-20" />
          <span className="text-muted-foreground text-sm">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "managerId",
    header: "Manager",
    cell: ({ row }) => {
      const managerId = row.getValue("managerId") as string | null;
      return managerId ?? "Unassigned";
    },
  },
  {
    accessorKey: "plannedFinish",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("plannedFinish") as string;
      if (!date) return "—";
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return "—";
      return parsed.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell project={row.original} />,
  },
];

function ActionsCell({ project }: { project: Project }) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      toast.success("Project deleted successfully.");
      router.refresh();
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveProject(project.id);
      toast.success("Project archived.");
      router.refresh();
    } catch {
      toast.error("Failed to archive project.");
    }
  };

  const handleClose = async () => {
    try {
      await closeProject(project.id);
      toast.success("Project closed.");
      router.refresh();
    } catch {
      toast.error("Failed to close project.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleArchive}>
            <Archive className="mr-2 h-3.5 w-3.5" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleClose}>
            <CheckCircle className="mr-2 h-3.5 w-3.5" />
            Close
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function createColumns(userMap: Map<string, string>): ColumnDef<Project>[] {
  return columns.map((col) => {
    if ("accessorKey" in col && col.accessorKey === "managerId") {
      return {
        ...col,
        cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
          const managerId = row.getValue("managerId") as string | null;
          if (!managerId) return "Unassigned";
          return userMap.get(managerId) ?? "Unknown";
        },
      };
    }
    return col;
  });
}
