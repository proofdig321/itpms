import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { PermissionGate } from "@/components/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTaskById } from "@/lib/services/tasks-queries";

import { DeleteTaskDialog } from "./_components/delete-task-dialog";

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
};

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">{task.name}</h1>
          <p className="text-muted-foreground text-sm">{task.projectCode}</p>
        </div>
        <div className="flex gap-2">
          <PermissionGate permission="tasks.update">
            <Button asChild variant="outline">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={(statusConfig[task.status] ?? statusConfig["not-started"]).className}>
              {(statusConfig[task.status] ?? statusConfig["not-started"]).label}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={(priorityConfig[task.priority] ?? priorityConfig.medium).className}>
              {(priorityConfig[task.priority] ?? priorityConfig.medium).label}
            </Badge>
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
            <CardTitle className="font-normal text-muted-foreground text-sm">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg tabular-nums">{task.duration} days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {new Date(task.plannedStart).toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" — "}
              {new Date(task.plannedFinish).toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Cost</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Planned</p>
              <p className="font-medium">
                R {Number(task.plannedCost).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Actual</p>
              <p className="font-medium">
                R {Number(task.actualCost).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{task.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {task.assignments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No assignments.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {task.assignments.map((a) => (
                <div key={a.id ?? a.userId} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{a.userName ?? a.userId}</span>
                  <span className="text-muted-foreground">
                    {a.role} — {a.allocation}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {task.progressHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Progress History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {task.progressHistory.map((p) => (
                <div key={p.id} className="flex items-start justify-between gap-4 text-sm">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{p.percentComplete}% complete</span>
                    {p.remarks && <span className="text-muted-foreground">{p.remarks}</span>}
                    <span className="text-muted-foreground text-xs">{p.updatedByName ?? p.updatedBy}</span>
                  </div>
                  <span className="whitespace-nowrap text-muted-foreground text-xs">{p.progressDate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {task.comments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {task.comments.map((c) => (
                <div key={c.id} className="flex flex-col gap-0.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.userName ?? c.userId}</span>
                    <span className="text-muted-foreground text-xs">{c.createdAt}</span>
                  </div>
                  <p className="text-muted-foreground">{c.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
