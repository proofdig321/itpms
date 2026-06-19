import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCostItems } from "@/lib/services/costs";

const categoryLabels: Record<string, string> = {
  labour: "Labour",
  hardware: "Hardware",
  software: "Software",
  licenses: "Licenses",
  consulting: "Consulting",
  training: "Training",
  travel: "Travel",
  contingency: "Contingency",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

export default async function CostsPage() {
  const items = await getCostItems();
  const totalEstimated = items.reduce((sum, i) => sum + i.estimatedAmount, 0);
  const totalActual = items.reduce((sum, i) => sum + (i.actualAmount ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Cost Planning</h1>
        <p className="text-muted-foreground text-sm">Project cost estimates and expenditure tracking.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Cost Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="text-right">Estimated</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">{item.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryLabels[item.category]}</Badge>
                    </TableCell>
                    <TableCell>{item.projectCode}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(item.estimatedAmount)}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.actualAmount ? formatCurrency(item.actualAmount) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="justify-between text-sm">
          <span>
            Total Estimated: <strong>{formatCurrency(totalEstimated)}</strong>
          </span>
          <span>
            Total Actual: <strong>{formatCurrency(totalActual)}</strong>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
