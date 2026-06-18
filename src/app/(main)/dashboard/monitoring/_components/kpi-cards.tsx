import { AlertTriangle, CheckCircle2, FolderKanban, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioSummary } from "@/types/monitoring";

interface KpiCardsProps {
  data: PortfolioSummary;
}

const kpis = [
  { key: "totalProjects", label: "Total Projects", icon: FolderKanban },
  { key: "activeProjects", label: "Active Projects", icon: TrendingUp },
  { key: "delayedProjects", label: "Delayed Projects", icon: AlertTriangle },
  { key: "completedProjects", label: "Completed", icon: CheckCircle2 },
] as const;

export function KpiCards({ data }: KpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="font-normal text-muted-foreground text-sm">{label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl tabular-nums">{data[key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
