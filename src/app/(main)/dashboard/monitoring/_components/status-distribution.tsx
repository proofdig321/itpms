import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatusDistribution } from "@/data/monitoring";

interface StatusDistributionProps {
  data: StatusDistribution[];
}

const statusStyle: Record<StatusDistribution["status"], { label: string; bar: string; badge: string }> = {
  "on-track": {
    label: "On Track",
    bar: "bg-green-500",
    badge: "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  "at-risk": {
    label: "At Risk",
    bar: "bg-amber-500",
    badge: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  delayed: {
    label: "Delayed",
    bar: "bg-red-500",
    badge: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export function StatusDistributionCard({ data }: StatusDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Portfolio Health</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex h-3 w-full overflow-hidden rounded-full">
          {data.map(({ status, percentage }) => (
            <div key={status} className={`${statusStyle[status].bar} h-full`} style={{ width: `${percentage}%` }} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {data.map(({ status, count, percentage }) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${statusStyle[status].bar}`} />
                <span className="text-sm">{statusStyle[status].label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusStyle[status].badge}>{count}</Badge>
                <span className="text-muted-foreground text-sm tabular-nums">{percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
