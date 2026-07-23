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
import { getProjectById } from "@/lib/services/projects-queries";
import { getUsers } from "@/lib/services/users";

import { DeleteProjectDialog } from "./_components/delete-project-dialog";

const statusConfig: Record<string, { label: string; className: string }> = {
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
  completed: {
    label: "Completed",
    className: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  "not-started": {
    label: "Not Started",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
};

const healthConfig: Record<string, { label: string; className: string }> = {
  good: {
    label: "Good",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  warning: {
    label: "Warning",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  critical: {
    label: "Critical",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const [project, users] = await Promise.all([getProjectById(id), getUsers()]);

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
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </PermissionGate>
          <PermissionGate permission="projects.delete">
            <DeleteProjectDialog projectId={project.id} projectTitle={project.title} />
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Progress</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Progress value={dashboard?.progress ?? project.progress} className="h-2 flex-1" />
                <span className="font-medium text-sm tabular-nums">{dashboard?.progress ?? project.progress}%</span>
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
                  {new Date(project.plannedStart).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                  {" — "}
                  {new Date(project.plannedFinish).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
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
                  <p className="text-muted-foreground text-xs">{metrics.completionRate}% completion rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{metrics.inProgressTasks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Not Started</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{metrics.notStartedTasks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums text-red-600">{metrics.overdueTasks}</p>
                  <p className="text-muted-foreground text-xs">{metrics.overdueRate}% overdue rate</p>
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
                    <CardTitle className="font-normal text-muted-foreground text-sm">Overall Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={(healthConfig[health.overallHealth] ?? healthConfig.warning).className}>
                      {(healthConfig[health.overallHealth] ?? healthConfig.warning).label}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Schedule Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={(healthConfig[health.scheduleHealth] ?? healthConfig.warning).className}>
                      {(healthConfig[health.scheduleHealth] ?? healthConfig.warning).label}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Scope Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={(healthConfig[health.scopeHealth] ?? healthConfig.warning).className}>
                      {(healthConfig[health.scopeHealth] ?? healthConfig.warning).label}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {health.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-1">
                      {health.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-red-600">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {health.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-1">
                      {health.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm">
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
          {schedule || scheduleProgress ? (
            <div className="flex flex-col gap-4">
              {scheduleProgress && (
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-normal text-muted-foreground text-sm">Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                      <Progress value={scheduleProgress.overallProgress} className="h-2 flex-1" />
                      <span className="font-medium text-sm tabular-nums">{scheduleProgress.overallProgress}%</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-normal text-muted-foreground text-sm">Planned Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-3">
                      <Progress value={scheduleProgress.plannedProgress} className="h-2 flex-1" />
                      <span className="font-medium text-sm tabular-nums">{scheduleProgress.plannedProgress}%</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-normal text-muted-foreground text-sm">Schedule Variance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={`font-semibold text-lg tabular-nums ${scheduleProgress.scheduleVariance < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {scheduleProgress.scheduleVariance > 0 ? "+" : ""}
                        {scheduleProgress.scheduleVariance}%
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {schedule && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                      <div>
                        <p className="text-muted-foreground text-xs">Total Duration</p>
                        <p className="font-medium">{schedule.totalDuration} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Elapsed</p>
                        <p className="font-medium">{schedule.elapsedDays} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Remaining</p>
                        <p className="font-medium">{schedule.remainingDays} days</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Actual Start</p>
                        <p className="font-medium">
                          {schedule.actualStart
                            ? new Date(schedule.actualStart).toLocaleDateString("en-ZA", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {schedule?.tasks && schedule.tasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-normal text-muted-foreground text-sm">Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {schedule.tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 text-sm">
                          <span className="w-48 truncate font-medium">{task.name}</span>
                          <Progress value={task.percentComplete} className="h-1.5 flex-1" />
                          <span className="w-10 text-right tabular-nums text-muted-foreground text-xs">
                            {task.percentComplete}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Schedule data not available.</p>
          )}
        </TabsContent>

        {/* Forecast */}
        <TabsContent value="forecast" className="mt-4">
          {forecast ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Projected End Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-sm">
                    {new Date(forecast.projectedEndDate).toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Days Variance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`font-semibold text-2xl tabular-nums ${forecast.daysVariance > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {forecast.daysVariance > 0 ? "+" : ""}
                    {forecast.daysVariance}d
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">On Track</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    className={
                      forecast.onTrack
                        ? "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300"
                        : "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300"
                    }
                  >
                    {forecast.onTrack ? "Yes" : "No"}
                  </Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Completion Probability</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  <Progress value={forecast.completionProbability} className="h-2 flex-1" />
                  <span className="font-medium text-sm tabular-nums">{forecast.completionProbability}%</span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Remaining Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{forecast.remainingTasks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Remaining Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-2xl tabular-nums">{forecast.remainingDays}</p>
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
