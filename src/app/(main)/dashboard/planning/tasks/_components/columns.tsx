"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { deleteTask } from "@/lib/services/tasks";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
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
  "on-hold": {
    label: "On Hold",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
  high: {
    label: "High",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  medium: {
    label: "Medium",
    className: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  low: {
    label: "Low",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: "Task",
    cell: ({ row }) => {
      const task = row.original;
      return (
        <Link href={`/dashboard/planning/tasks/${task.id}`} className="hover:underline">
          {task.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority;
      const config = priorityConfig[priority];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus;
      const config = statusConfig[status];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "percentComplete",
    header: "Progress",
    cell: ({ row }) => {
      const pct = row.getValue("percentComplete") as number;
      return (
        <div className="flex items-center gap-2">
          <Progress value={pct} className="h-2 w-20" />
          <span className="text-muted-foreground text-sm">{pct}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
  },
  {
    accessorKey: "plannedFinish",
    header: "Due",
    cell: ({ row }) => {
      const date = row.getValue("plannedFinish") as string;
      return new Date(date).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell task={row.original} />,
  },
];

function ActionsCell({ task }: { task: Task }) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully.");
      router.refresh();
    } catch {
      toast.error("Failed to delete task.");
    } finally {
      setIsDeleting(false);
      setShowDelete(false);
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
            <Link href={`/dashboard/planning/tasks/${task.id}/edit`}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Link>
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
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{task.name}&quot;? This action cannot be undone.
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
