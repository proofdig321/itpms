import { AlertTriangle, CheckCircle2, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { MilestoneOverview } from "@/types/monitoring";

interface MilestoneOverviewProps {
  data: MilestoneOverview;
}

export function MilestoneOverviewCard({ data }: MilestoneOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Milestone Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-sm">Average Progress</span>
            <span className="font-medium text-sm tabular-nums">{data.averageProgress}%</span>
          </div>
          <Progress value={data.averageProgress} className="h-2" />
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Total Milestones</span>
            </div>
            <span className="font-medium text-sm tabular-nums">{data.totalMilestones}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm">Completed</span>
            </div>
            <span className="font-medium text-sm tabular-nums">{data.completedMilestones}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm">Overdue</span>
            </div>
            <span className="font-medium text-sm tabular-nums">{data.overdueMilestones}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
