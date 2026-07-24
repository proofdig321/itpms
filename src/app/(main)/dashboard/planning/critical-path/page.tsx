import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCriticalPath } from "@/lib/services/analytics";
import { getProjects } from "@/lib/services/projects-queries";

import { ProjectSelector } from "../_components/project-selector";
import { ProjectSync } from "../_components/project-sync";

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [, month, day] = dateStr.split("T")[0].split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[Number.parseInt(month) - 1]}`;
}

interface CriticalPathPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function CriticalPathPage({ searchParams }: CriticalPathPageProps) {
  const params = await searchParams;
  const projects = await getProjects();
  const fallback = projects[0]?.projectCode ?? "";
  const selectedCode = params.project ?? "";

  if (!selectedCode) {
    return <ProjectSync basePath="/dashboard/planning/critical-path" fallbackCode={fallback} />;
  }

  const tasks = await getCriticalPath(selectedCode);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Critical Path</h1>
          <p className="text-muted-foreground text-sm">Backend-computed critical tasks, float, and project duration.</p>
        </div>
        <ProjectSelector projects={projects} selectedCode={selectedCode} basePath="/dashboard/planning/critical-path" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">
            {selectedCode} — Critical Path Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">No critical path data available for this project.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Duration (days)</TableHead>
                    <TableHead>Float (days)</TableHead>
                    <TableHead>Critical</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Finish</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className={task.isCritical ? "bg-red-50/50 dark:bg-red-950/20" : ""}>
                      <TableCell className="whitespace-nowrap">{task.name}</TableCell>
                      <TableCell className="tabular-nums">{task.duration}</TableCell>
                      <TableCell className="tabular-nums">{task.float}</TableCell>
                      <TableCell>
                        {task.isCritical ? (
                          <Badge className="border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300">
                            Critical
                          </Badge>
                        ) : (
                          <Badge variant="outline">Non-critical</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(task.plannedStart)}</TableCell>
                      <TableCell>{formatDate(task.plannedFinish)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
