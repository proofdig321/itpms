import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBaselinesByProject } from "@/lib/services/analytics";
import { getProjectById, getProjects } from "@/lib/services/projects-queries";

import { ProjectSelector } from "../_components/project-selector";
import { ProjectSync } from "../_components/project-sync";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("T")[0].split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${day} ${months[Number.parseInt(month) - 1]} ${year}`;
}

interface ChangeImpactPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function ChangeImpactPage({ searchParams }: ChangeImpactPageProps) {
  const params = await searchParams;
  const projects = await getProjects();
  const fallback = projects[0]?.projectCode ?? "";
  const selectedCode = params.project ?? "";

  if (!selectedCode) {
    return <ProjectSync basePath="/dashboard/planning/change-impact" fallbackCode={fallback} />;
  }

  const selectedProject = projects.find((p) => p.projectCode === selectedCode);
  const [baselines, project] = await Promise.all([
    getBaselinesByProject(selectedCode),
    selectedProject ? getProjectById(selectedProject.id) : Promise.resolve(undefined),
  ]);

  const approvedBaseline = baselines.find((b) => b.status === "approved");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Change Impact Analysis</h1>
          <p className="text-muted-foreground text-sm">Compare current plan against approved baseline.</p>
        </div>
        <ProjectSelector projects={projects} selectedCode={selectedCode} basePath="/dashboard/planning/change-impact" />
      </div>

      {!approvedBaseline ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="font-medium text-sm">No approved baseline available</p>
            <p className="mt-1 text-muted-foreground text-sm">
              A baseline must be approved before impact analysis can be performed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">
              {selectedCode} — Baseline v{approvedBaseline.version} vs Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dimension</TableHead>
                    <TableHead>Baseline</TableHead>
                    <TableHead>Current</TableHead>
                    <TableHead>Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Budget</TableCell>
                    <TableCell className="tabular-nums">{formatCurrency(approvedBaseline.totalCost)}</TableCell>
                    <TableCell className="tabular-nums">—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Start Date</TableCell>
                    <TableCell>{formatDate(approvedBaseline.startDate)}</TableCell>
                    <TableCell>{project ? formatDate(project.plannedStart) : "—"}</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">End Date</TableCell>
                    <TableCell>{formatDate(approvedBaseline.endDate)}</TableCell>
                    <TableCell>{project ? formatDate(project.plannedFinish) : "—"}</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Scope</TableCell>
                    <TableCell className="max-w-[200px] truncate">{approvedBaseline.scope}</TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>—</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
