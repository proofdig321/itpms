import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRisks } from "@/lib/services/risks";

const probabilityConfig: Record<string, { label: string; className: string }> = {
  low: {
    label: "Low",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  medium: {
    label: "Medium",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  high: {
    label: "High",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

const impactConfig: Record<string, { label: string; className: string }> = {
  low: {
    label: "Low",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  medium: {
    label: "Medium",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  high: {
    label: "High",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export default async function RisksPage() {
  const risks = await getRisks();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Risk Register</h1>
        <p className="text-muted-foreground text-sm">Project risks, probability, impact, and mitigation plans.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="max-w-[200px] truncate">{risk.description}</TableCell>
                    <TableCell>{risk.projectCode}</TableCell>
                    <TableCell>
                      <Badge className={probabilityConfig[risk.probability].className}>
                        {probabilityConfig[risk.probability].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={impactConfig[risk.impact].className}>{impactConfig[risk.impact].label}</Badge>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">{risk.score}</TableCell>
                    <TableCell className="whitespace-nowrap">{risk.owner}</TableCell>
                    <TableCell>
                      {new Date(risk.dueDate).toLocaleDateString("en-ZA", { month: "short", day: "numeric" })}
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
