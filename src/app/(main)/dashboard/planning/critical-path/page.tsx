import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCriticalPath } from "@/lib/services/analytics";

export default async function CriticalPathPage() {
  const tasks = await getCriticalPath("ITPMS-001");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Critical Path</h1>
        <p className="text-muted-foreground text-sm">Backend-computed critical tasks, float, and project duration.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">
            ITPMS-001 — Critical Path Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                    <TableCell>
                      {new Date(task.plannedStart).toLocaleDateString("en-ZA", { month: "short", day: "numeric" })}
                    </TableCell>
                    <TableCell>
                      {new Date(task.plannedFinish).toLocaleDateString("en-ZA", { month: "short", day: "numeric" })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
