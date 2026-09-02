import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { PermissionGate } from "@/components/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { taskTypeLabels } from "@/lib/schemas/task";
import { getTaskById } from "@/lib/services/tasks-queries";
import { getUsers } from "@/lib/services/users";

import { DeleteTaskDialog } from "./_components/delete-task-dialog";
import { TaskApprovalActions } from "./_components/task-approval-actions";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
}

function formatZAR(value: string | number | null | undefined): string {
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return `R ${num.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── badge configs ───────────────────────────────────────────────────────────

const priorityConfig: Record<string, { label: string; className: string }> = {
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

const statusConfig: Record<string, { label: string; className: string }> = {
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
  "pending-approval": {
    label: "Pending Approval",
    className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

const approvalActionConfig: Record<string, { label: string; className: string }> = {
  submitted: {
    label: "Submitted",
    className: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  approved: {
    label: "Approved",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};

// ─── page ────────────────────────────────────────────────────────────────────

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const [task, users] = await Promise.all([getTaskById(id), getUsers()]);

  if (!task) notFound();

  // Build a UUID → name lookup from the users list
  const userMap = new Map(users.map((u) => [u.id, u.name]));
  const resolveName = (uuid: string | null | undefined): string => {
    if (!uuid) return "—";
    return userMap.get(uuid) ?? "Unknown";
  };

  const statusBadge = statusConfig[task.status] ?? statusConfig["not-started"];
  const priorityBadge = priorityConfig[task.priority] ?? priorityConfig.medium;
  const typeLabel = taskTypeLabels[task.type as keyof typeof taskTypeLabels] ?? task.type;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-muted-foreground text-xs">{task.taskCode}</p>
          <h1 className="font-semibold text-2xl tracking-tight">{task.name}</h1>
          <p className="text-muted-foreground text-sm">{task.projectCode}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <PermissionGate permission="tasks.approve">
            {task.status === "pending-approval" && <TaskApprovalActions taskId={task.id} taskName={task.name} />}
          </PermissionGate>
          <PermissionGate permission="tasks.update">
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/planning/tasks/${task.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </PermissionGate>
          <PermissionGate permission="tasks.delete">
            <DeleteTaskDialog taskId={task.id} taskName={task.name} />
          </PermissionGate>
        </div>
      </div>

      {/* ── Status strip ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={priorityBadge.className}>{priorityBadge.label}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Progress value={task.percentComplete} className="h-2 flex-1" />
              <span className="font-medium text-sm tabular-nums">{task.percentComplete}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={
                task.milestone
                  ? "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300"
                  : "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              }
            >
              {task.milestone ? "Yes" : "No"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* ── Task Identification ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Task Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs">Task Code</dt>
              <dd className="font-medium font-mono">{task.taskCode}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Task Name</dt>
              <dd className="font-medium">{task.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Project</dt>
              <dd className="font-medium">{task.projectCode}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">WBS Node</dt>
              <dd className="font-medium">{task.wbsNodeId ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Task Type</dt>
              <dd className="font-medium">{typeLabel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Priority</dt>
              <dd>
                <Badge className={priorityBadge.className}>{priorityBadge.label}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* ── Schedule ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Planned</p>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-medium tabular-nums">{task.duration} working days</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Start</dt>
                  <dd className="font-medium">{formatDate(task.plannedStart)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Finish</dt>
                  <dd className="font-medium">{formatDate(task.plannedFinish)}</dd>
                </div>
              </dl>
            </div>
            <div>
              <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Actual</p>
              <dl className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Start</dt>
                  <dd className="font-medium">{formatDate(task.actualStart)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Finish</dt>
                  <dd className="font-medium">{formatDate(task.actualFinish)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Cost ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs">Planned Cost</dt>
              <dd className="font-medium tabular-nums">{formatZAR(task.plannedCost)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Actual Cost</dt>
              <dd className="font-medium tabular-nums">{formatZAR(task.actualCost)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* ── Description & Remarks ── */}
      {(task.description || task.remarks) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            {task.description && <p>{task.description}</p>}
            {task.remarks && (
              <div>
                <p className="mb-1 text-muted-foreground text-xs">Remarks</p>
                <p className="text-muted-foreground">{task.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Assignments ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {task.assignments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No assignments.</p>
          ) : (
            <div className="flex flex-col divide-y">
              {task.assignments.map((a) => (
                <div key={a.id ?? a.userId} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium">{a.userName ?? resolveName(a.userId)}</span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {a.role && <span>{a.role}</span>}
                    <span className="tabular-nums">{a.allocation}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Progress History ── */}
      {task.progressHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              {task.progressHistory.map((p) => {
                const actorName = p.updatedByName ?? resolveName(p.updatedBy);
                return (
                  <div key={p.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{p.percentComplete}% complete</span>
                      {p.remarks && <span className="text-muted-foreground">{p.remarks}</span>}
                      <span className="text-muted-foreground text-xs">{actorName}</span>
                    </div>
                    <span className="shrink-0 text-muted-foreground text-xs">{formatDateTime(p.progressDate)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Approval History ── */}
      {task.approvals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Approval History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y">
              {task.approvals.map((a) => {
                const actorName = resolveName(a.performedBy);
                const actionCfg = approvalActionConfig[a.action] ?? { label: a.action, className: "" };
                return (
                  <div key={a.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge className={actionCfg.className}>{actionCfg.label}</Badge>
                        <span className="text-muted-foreground text-xs">{actorName}</span>
                      </div>
                      {a.comments && <span className="text-muted-foreground">{a.comments}</span>}
                    </div>
                    <span className="shrink-0 text-muted-foreground text-xs">{formatDateTime(a.performedAt)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
