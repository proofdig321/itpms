import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBaselinesByProject } from "@/lib/services/analytics";
import { getProjectById } from "@/lib/services/projects";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

export default async function ChangeImpactPage() {
  const [baselines, project] = await Promise.all([getBaselinesByProject("ITPMS-001"), getProjectById("1")]);

  const approvedBaseline = baselines.find((b) => b.status === "approved");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Change Impact Analysis</h1>
        <p className="text-muted-foreground text-sm">Compare current plan against approved baseline.</p>
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
              ITPMS-001 — Baseline v{approvedBaseline.version} vs Current Plan
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
                    <TableCell className="tabular-nums">{formatCurrency(2950000)}</TableCell>
                    <TableCell className="tabular-nums text-red-600">
                      {formatCurrency(2950000 - approvedBaseline.totalCost)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Start Date</TableCell>
                    <TableCell>
                      {new Date(approvedBaseline.startDate).toLocaleDateString("en-ZA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {project
                        ? new Date(project.plannedStart).toLocaleDateString("en-ZA", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>No change</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">End Date</TableCell>
                    <TableCell>
                      {new Date(approvedBaseline.endDate).toLocaleDateString("en-ZA", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>15 Jul 2025</TableCell>
                    <TableCell className="text-red-600">+15 days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Scope</TableCell>
                    <TableCell className="max-w-[200px] truncate">{approvedBaseline.scope}</TableCell>
                    <TableCell>Unchanged</TableCell>
                    <TableCell>No change</TableCell>
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
