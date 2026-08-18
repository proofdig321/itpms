import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { PermissionGate } from "@/components/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getProjectDashboard,
  getProjectForecast,
  getProjectHealth,
  getProjectMetrics,
  getProjectSchedule,
  getScheduleProgress,
} from "@/lib/services/project-dashboard";
import { getProjectByCode } from "@/lib/services/projects-queries";
import { getUsers } from "@/lib/services/users";

import { DeleteProjectDialog } from "./_components/delete-project-dialog";
import { RecalculateScheduleButton } from "./_components/recalculate-schedule-button";

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[Number.parseInt(month, 10) - 1]} ${year}`;
}

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

const healthConfig: Record<string, { label: string; className: string }> = {
  "not-planned": {
    label: "Not Planned",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
  "on-track": {
    label: "On Track",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  "at-risk": {
    label: "At Risk",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  delayed: {
    label: "Delayed",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
  critical: {
    label: "Critical",
    className: "border-red-400 bg-red-100 text-red-800 dark:border-red-600 dark:bg-red-900 dark:text-red-200",
  },
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [project, users] = await Promise.all([getProjectByCode(id), getUsers()]);

  if (!project) {
    notFound();
  }

  const [dashboard, metrics, health, forecast, schedule, scheduleProgress] = await Promise.all([
    getProjectDashboard(project.projectCode),
    getProjectMetrics(project.projectCode),
    getProjectHealth(project.projectCode),
    getProjectForecast(project.projectCode),
    getProjectSchedule(project.projectCode),
    getScheduleProgress(project.projectCode),
  ]);

  const status = statusConfig[project.status] ?? statusConfig["not-started"];
  const healthBadge = healthConfig[project.health ?? ""] ?? null;
  const managerName = project.managerId
    ? (users.find((u) => u.id === project.managerId)?.name ?? project.managerId)
    : "Unassigned";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground text-sm">{project.projectCode}</p>
        </div>
        <div className="flex gap-2">
          <PermissionGate permission="projects.update">
            <Button asChild variant="outline">
              <Link href={`/dashboard/projects/${project.projectCode}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </PermissionGate>
          <PermissionGate permission="projects.delete">
            <DeleteProjectDialog projectId={project.projectCode} projectTitle={project.title} />
          </PermissionGate>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Badge className={status.className}>{status.label}</Badge>
                {healthBadge && <Badge className={healthBadge.className}>{healthBadge.label}</Badge>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Progress value={dashboard?.summary?.progress ?? project.progress} className="h-2 flex-1" />
                <span className="font-medium text-sm tabular-nums">
                  {dashboard?.summary?.progress ?? project.progress}%
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Project Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-sm">{managerName}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {formatDate(project.plannedStart)}
                  {" — "}
                  {formatDate(project.plannedFinish)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-normal text-muted-foreground text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics */}
        <TabsContent value="metrics" className="mt-4">
          {metrics ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{metrics.totalTasks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{metrics.completedTasks}</p>
                  <p className="text-muted-foreground text-xs">{metrics.overdueTaskPercentage}% overdue rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Overdue Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl text-red-600 tabular-nums">{metrics.overdueTasks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">On Hold</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{metrics.onHoldTasks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Schedule Variance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`font-semibold text-2xl tabular-nums ${metrics.scheduleVariance >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {metrics.scheduleVariance > 0 ? "+" : ""}
                    {metrics.scheduleVariance}%
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">
                    Schedule Performance Index
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{metrics.schedulePerformanceIndex}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Metrics not available.</p>
          )}
        </TabsContent>

        {/* Health */}
        <TabsContent value="health" className="mt-4">
          {health ? (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={(healthConfig[health.health] ?? healthConfig["at-risk"]).className}>
                      {(healthConfig[health.health] ?? healthConfig["at-risk"]).label}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Health Score</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-3">
                    <Progress value={health.score} className="h-2 flex-1" />
                    <span className="font-medium text-sm tabular-nums">{health.score}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Schedule Variance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`font-semibold text-lg tabular-nums ${health.scheduleVarianceDays <= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {health.scheduleVarianceDays > 0 ? "+" : ""}
                      {health.scheduleVarianceDays}d
                    </p>
                  </CardContent>
                </Card>
              </div>
              {health.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-1">
                      {health.recommendations.map((rec) => (
                        <li key={rec} className="text-sm">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Health data not available.</p>
          )}
        </TabsContent>

        {/* Schedule */}
        <TabsContent value="schedule" className="mt-4">
          {schedule ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <PermissionGate permission="projects.update">
                  <RecalculateScheduleButton projectCode={project.projectCode} />
                </PermissionGate>
              </div>
              {scheduleProgress && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-normal text-muted-foreground text-sm">Actual Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                      <Progress value={scheduleProgress.actualProgress ?? 0} className="h-2 flex-1" />
                      <span className="font-medium text-sm tabular-nums">
                        {scheduleProgress.actualProgress ?? "—"}%
                      </span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-normal text-muted-foreground text-sm">Planned Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                      <Progress value={scheduleProgress.plannedProgress ?? 0} className="h-2 flex-1" />
                      <span className="font-medium text-sm tabular-nums">
                        {scheduleProgress.plannedProgress ?? "—"}%
                      </span>
                    </CardContent>
                  </Card>
                </div>
              )}
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Timeline</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Planned Start</p>
                      <p className="font-medium">{schedule.plannedStart ? formatDate(schedule.plannedStart) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Planned Finish</p>
                      <p className="font-medium">{schedule.plannedFinish ? formatDate(schedule.plannedFinish) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Forecast Finish</p>
                      <p className="font-medium">
                        {schedule.forecastFinish ? formatDate(schedule.forecastFinish) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Actual Start</p>
                      <p className="font-medium">{schedule.actualStart ? formatDate(schedule.actualStart) : "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Schedule data not available.</p>
          )}
        </TabsContent>

        {/* Forecast */}
        <TabsContent value="forecast" className="mt-4">
          {forecast ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Forecast Finish</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-sm">{formatDate(forecast.forecastFinish)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Remaining Working Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{forecast.remainingWorkingDays}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Forecast Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{forecast.forecastDuration} days</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Forecast data not available.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
