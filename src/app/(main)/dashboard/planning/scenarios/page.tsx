import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const scenarios = [
  {
    id: "s1",
    title: "Resource Reduction",
    description: "Impact of reducing project team by 20%.",
    status: "analysed",
    impact: "Schedule extends by 3 weeks, critical path shifts.",
  },
  {
    id: "s2",
    title: "Budget Reduction",
    description: "Impact of 15% budget cut on ITPMS-001.",
    status: "pending",
    impact: "Fibre installation deferred to Phase 2.",
  },
  {
    id: "s3",
    title: "Procurement Delay",
    description: "Vendor delivery delayed by 4 weeks.",
    status: "analysed",
    impact: "Go-live pushed to August 2025, contingency consumed.",
  },
  {
    id: "s4",
    title: "Scope Increase",
    description: "Addition of 3 remote sites to network upgrade.",
    status: "pending",
    impact: "Pending analysis by backend.",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  analysed: {
    label: "Analysed",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  pending: {
    label: "Pending",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
};

export default function ScenariosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Scenario Planning</h1>
        <p className="text-muted-foreground text-sm">What-if analysis — scenarios do not affect approved baselines.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((s) => {
          const status = statusConfig[s.status];
          return (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{s.title}</CardTitle>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <span className="font-medium">Impact:</span> {s.impact}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
