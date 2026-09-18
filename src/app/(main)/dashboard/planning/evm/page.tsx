import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEvmByProject, getForecast } from "@/lib/services/analytics";
import { getProjects } from "@/lib/services/projects-queries";

import { NoProjectsState } from "../_components/no-projects-state";
import { ProjectSelector } from "../_components/project-selector";
import { ProjectSync } from "../_components/project-sync";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

function formatIndex(value: number) {
  return value.toFixed(2);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[Number.parseInt(month) - 1]} ${year}`;
}

interface EvmPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function EvmPage({ searchParams }: EvmPageProps) {
  const params = await searchParams;
  const projects = await getProjects();
  const fallback = projects[0]?.projectCode ?? "";
  const selectedCode = params.project ?? "";

  if (projects.length === 0) {
    return <NoProjectsState />;
  }

  if (!selectedCode) {
    return <ProjectSync basePath="/dashboard/planning/evm" fallbackCode={fallback} />;
  }

  const [evm, forecast] = await Promise.all([getEvmByProject(selectedCode), getForecast(selectedCode)]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Earned Value Management</h1>
          <p className="text-muted-foreground text-sm">{selectedCode} — Performance metrics computed by backend.</p>
        </div>
        <ProjectSelector projects={projects} selectedCode={selectedCode} basePath="/dashboard/planning/evm" />
      </div>

      {!evm ? (
        <p className="text-muted-foreground text-sm">No EVM data available for this project.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Planned Value (PV)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl tabular-nums">{formatCurrency(evm.plannedValue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Earned Value (EV)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl tabular-nums">{formatCurrency(evm.earnedValue)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Actual Cost (AC)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-2xl tabular-nums">{formatCurrency(evm.actualCost)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Schedule Variance (SV)</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`font-semibold text-lg tabular-nums ${evm.scheduleVariance < 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatCurrency(evm.scheduleVariance)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">Cost Variance (CV)</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`font-semibold text-lg tabular-nums ${evm.costVariance < 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatCurrency(evm.costVariance)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">SPI</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`font-semibold text-lg tabular-nums ${evm.spiIndex < 1 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatIndex(evm.spiIndex)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-normal text-muted-foreground text-sm">CPI</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`font-semibold text-lg tabular-nums ${evm.cpiIndex < 1 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatIndex(evm.cpiIndex)}
                </p>
              </CardContent>
            </Card>
          </div>

          {forecast && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">
                    Estimate at Completion (EAC)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg tabular-nums">{formatCurrency(forecast.estimateAtCompletion)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">
                    Estimate to Complete (ETC)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg tabular-nums">{formatCurrency(forecast.estimateToComplete)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">
                    Variance at Completion (VAC)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`font-semibold text-lg tabular-nums ${forecast.varianceAtCompletion < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {formatCurrency(forecast.varianceAtCompletion)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-normal text-muted-foreground text-sm">Projected End Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg">{formatDate(forecast.projectedEndDate)}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
