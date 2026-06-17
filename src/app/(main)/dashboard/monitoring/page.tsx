import {
  getMilestoneOverview,
  getPortfolioSummary,
  getRecentActivity,
  getStatusDistribution,
} from "@/lib/services/monitoring";

import { KpiCards } from "./_components/kpi-cards";
import { MilestoneOverviewCard } from "./_components/milestone-overview";
import { RecentActivityFeed } from "./_components/recent-activity";
import { StatusDistributionCard } from "./_components/status-distribution";

export default async function MonitoringPage() {
  const [summary, distribution, milestones, activity] = await Promise.all([
    getPortfolioSummary(),
    getStatusDistribution(),
    getMilestoneOverview(),
    getRecentActivity(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Monitoring</h1>
        <p className="text-muted-foreground text-sm">Portfolio health, progress tracking, and executive visibility.</p>
      </div>
      <KpiCards data={summary} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatusDistributionCard data={distribution} />
        <MilestoneOverviewCard data={milestones} />
        <RecentActivityFeed data={activity} />
      </div>
    </div>
  );
}
