import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProcurementItems } from "@/lib/services/procurement";

const stageConfig: Record<string, { label: string; className: string }> = {
  specification: {
    label: "Specification",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
  rfq: {
    label: "RFQ",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  evaluation: {
    label: "Evaluation",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  adjudication: {
    label: "Adjudication",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  award: {
    label: "Awarded",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  delivery: {
    label: "Delivery",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

export default async function ProcurementPage() {
  const items = await getProcurementItems();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Procurement</h1>
        <p className="text-muted-foreground text-sm">SCM procurement tracking and stage management.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Procurement Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const stage = stageConfig[item.stage];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="whitespace-nowrap">{item.description}</TableCell>
                      <TableCell>{item.projectCode}</TableCell>
                      <TableCell>
                        <Badge className={stage.className}>{stage.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(item.estimatedValue)}</TableCell>
                      <TableCell>
                        {new Date(item.targetDate).toLocaleDateString("en-ZA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{item.vendor ?? "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
