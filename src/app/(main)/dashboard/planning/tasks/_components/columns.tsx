"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";
import { Activity, Ban, Check, MoreHorizontal, Pause, Pencil, Play, Trash2, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { getSessionUser } from "@/lib/auth/auth-service";
import { taskTypeLabels } from "@/lib/schemas/task";
import {
  approveTask,
  cancelTask,
  deleteTask,
  holdTask,
  rejectTask,
  resumeTask,
  updateTaskProgress,
} from "@/lib/services/tasks";
import type { Task, TaskPriority, TaskStatus } from "@/types/task";

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
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
  "pending-approval": {
    label: "Pending Approval",
    className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
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

const LOCKED_STATUSES = ["pending-approval", "completed", "cancelled"] as const;

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "taskCode",
    header: "Code",
    cell: ({ row }) => <span className="font-mono text-muted-foreground text-xs">{row.getValue("taskCode")}</span>,
  },
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <span className="text-sm">{taskTypeLabels[type as keyof typeof taskTypeLabels] ?? type}</span>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TaskPriority;
      const config = priorityConfig[priority] ?? priorityConfig.medium;
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus;
      const config = statusConfig[status] ?? statusConfig["not-started"];
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
    accessorKey: "duration",
    header: "Days",
    cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("duration")}</span>,
  },
  {
    accessorKey: "plannedCost",
    header: "Planned Cost",
    cell: ({ row }) => {
      const cost = row.getValue("plannedCost") as string;
      const num = Number.parseFloat(cost);
      return (
        <span className="text-sm tabular-nums">
          {Number.isNaN(num)
            ? "—"
            : `R ${num.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </span>
      );
    },
  },
  {
    accessorKey: "assignments",
    header: "Assignee",
    cell: ({ row }) => {
      const assignments = row.original.assignments;
      if (!assignments?.length) return <span className="text-muted-foreground text-sm">Unassigned</span>;
      if (assignments.length === 1) return <span className="text-sm">{assignments[0].userName ?? "1 assigned"}</span>;
      return <span className="text-sm">{assignments.length} assigned</span>;
    },
  },
  {
    accessorKey: "plannedFinish",
    header: "Due",
    cell: ({ row }) => {
      const date = row.getValue("plannedFinish") as string;
      return (
        <span className="text-sm">
          {new Date(date).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
        </span>
      );
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
  const [showProgress, setShowProgress] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [percentComplete, setPercentComplete] = useState(task.percentComplete);
  const [remarks, setRemarks] = useState("");
  const [actualCost, setActualCost] = useState<string>("");
  const [progressDate, setProgressDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [rejectReason, setRejectReason] = useState("");

  const isLocked = (LOCKED_STATUSES as readonly string[]).includes(task.status);
  const sessionUser = getSessionUser();
  const canApprove = sessionUser !== null && Boolean(sessionUser.permissions.includes("tasks.approve"));
  const isPendingApproval = task.status === "pending-approval";

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveTask(task.id);
      toast.success("Task approved.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve task.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("A rejection reason is required.");
      return;
    }
    setIsRejecting(true);
    try {
      await rejectTask(task.id, rejectReason.trim());
      toast.success("Task rejected.");
      setShowReject(false);
      setRejectReason("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject task.");
    } finally {
      setIsRejecting(false);
    }
  };

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

  const handleProgressUpdate = async () => {
    setIsUpdating(true);
    try {
      const userId = getSessionUser()?.id || "";
      await updateTaskProgress(task.id, {
        percentComplete,
        remarks,
        updatedBy: userId,
        progressDate,
        ...(actualCost !== "" && { actualCost: Number(actualCost) }),
      });
      toast.success("Progress updated successfully.");
      setShowProgress(false);
      setRemarks("");
      setActualCost("");
      setProgressDate(new Date().toISOString().split("T")[0]);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update progress.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleHold = async () => {
    try {
      await holdTask(task.id);
      toast.success("Task put on hold.");
      router.refresh();
    } catch {
      toast.error("Failed to hold task.");
    }
  };

  const handleResume = async () => {
    try {
      await resumeTask(task.id);
      toast.success("Task resumed.");
      router.refresh();
    } catch {
      toast.error("Failed to resume task.");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelTask(task.id);
      toast.success("Task cancelled.");
      router.refresh();
    } catch {
      toast.error("Failed to cancel task.");
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
          {canApprove && isPendingApproval && (
            <>
              <DropdownMenuItem onSelect={handleApprove} disabled={isApproving}>
                <Check className="mr-2 h-3.5 w-3.5" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowReject(true)}>
                <X className="mr-2 h-3.5 w-3.5" />
                Reject
              </DropdownMenuItem>
            </>
          )}
          {!isLocked && (
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/planning/tasks/${task.id}/edit`}>
                <Pencil className="mr-2 h-3.5 w-3.5" />
                Edit
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setShowProgress(true)}>
            <Activity className="mr-2 h-3.5 w-3.5" />
            Update Progress
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleHold}>
            <Pause className="mr-2 h-3.5 w-3.5" />
            Hold
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleResume}>
            <Play className="mr-2 h-3.5 w-3.5" />
            Resume
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleCancel}>
            <Ban className="mr-2 h-3.5 w-3.5" />
            Cancel
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Progress — {task.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="progressDate">Progress Date</Label>
              <Input
                id="progressDate"
                type="date"
                value={progressDate}
                onChange={(e) => setProgressDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentComplete">Percent Complete</Label>
              <Input
                id="percentComplete"
                type="number"
                min={0}
                max={100}
                value={percentComplete}
                onChange={(e) => setPercentComplete(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="e.g. Equipment delivered and installation started."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualCost">
                Actual Cost (ZAR) <span className="font-normal text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="actualCost"
                type="number"
                min={0}
                placeholder="e.g. 15000"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgress(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleProgressUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Task — {task.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rejectReason">Rejection Reason</Label>
            <Textarea
              id="rejectReason"
              placeholder="Explain why this task is being rejected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReject(false)} disabled={isRejecting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting || !rejectReason.trim()}>
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
