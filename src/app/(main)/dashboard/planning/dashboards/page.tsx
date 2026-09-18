import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCriticalPath, getEvmByProject, getForecast } from "@/lib/services/analytics";
import { getCostItemsByProject } from "@/lib/services/costs";
import { getProcurementByProject } from "@/lib/services/procurement";
import { getProjects } from "@/lib/services/projects-queries";
import { getResourcesByProject } from "@/lib/services/resources";
import { getRisksByProject } from "@/lib/services/risks";

import { NoProjectsState } from "../_components/no-projects-state";
import { ProjectSelector } from "../_components/project-selector";
import { ProjectSync } from "../_components/project-sync";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

interface PlanningDashboardsPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function PlanningDashboardsPage({ searchParams }: PlanningDashboardsPageProps) {
  const params = await searchParams;
  const projects = await getProjects();
  const fallback = projects[0]?.projectCode ?? "";
  const selectedCode = params.project ?? "";

  if (projects.length === 0) {
    return <NoProjectsState />;
  }

  if (!selectedCode) {
    return <ProjectSync basePath="/dashboard/planning/dashboards" fallbackCode={fallback} />;
  }

  const [evm, _forecast, criticalTasks, costs, risks, resources, procurement] = await Promise.all([
    getEvmByProject(selectedCode),
    getForecast(selectedCode),
    getCriticalPath(selectedCode),
    getCostItemsByProject(selectedCode),
    getRisksByProject(selectedCode),
    getResourcesByProject(selectedCode),
    getProcurementByProject(selectedCode),
  ]);

  const totalBudget = costs.reduce((sum, c) => sum + c.estimatedAmount, 0);
  const totalSpent = costs.reduce((sum, c) => sum + (c.actualAmount ?? 0), 0);
  const criticalCount = criticalTasks.filter((t) => t.isCritical).length;
  const highRisks = risks.filter((r) => r.probability === "high" || r.impact === "high");
  const delayedProcurement = procurement.filter((p) => p.stage !== "award" && p.stage !== "delivery");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Planning Dashboards</h1>
          <p className="text-muted-foreground text-sm">Project Manager and ICT Director views.</p>
        </div>
        <ProjectSelector projects={projects} selectedCode={selectedCode} basePath="/dashboard/planning/dashboards" />
      </div>

      <Tabs defaultValue="pm">
        <TabsList>
          <TabsTrigger value="pm">Project Manager</TabsTrigger>
          <TabsTrigger value="director">ICT Director</TabsTrigger>
        </TabsList>

        <TabsContent value="pm" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Budget Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg tabular-nums">{formatCurrency(totalSpent)}</p>
                <p className="text-muted-foreground text-xs">of {formatCurrency(totalBudget)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Critical Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl tabular-nums">{criticalCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Resources Assigned</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl tabular-nums">{resources.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">High Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl tabular-nums">{highRisks.length}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="director" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Schedule Status</CardTitle>
              </CardHeader>
              <CardContent>
                {evm && evm.spiIndex < 1 ? (
                  <Badge className="border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300">
                    Behind Schedule
                  </Badge>
                ) : (
                  <Badge className="border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300">
                    On Schedule
                  </Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Cost Overruns</CardTitle>
              </CardHeader>
              <CardContent>
                {evm && evm.costVariance < 0 ? (
                  <p className="font-semibold text-lg text-red-600 tabular-nums">
                    {formatCurrency(Math.abs(evm.costVariance))}
                  </p>
                ) : (
                  <p className="font-semibold text-green-600 text-lg">None</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Procurement Delays</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl tabular-nums">{delayedProcurement.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">
                  EVM — {evm ? `SPI ${evm.spiIndex.toFixed(2)} / CPI ${evm.cpiIndex.toFixed(2)}` : "No data"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {evm ? (
                  <div className="flex items-center gap-2">
                    <Progress value={Math.min(evm.spiIndex * 100, 100)} className="h-2 flex-1" />
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">—</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
