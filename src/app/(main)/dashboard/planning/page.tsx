import { Suspense } from "react";

import { getMilestones } from "@/lib/services/planning";

import { PlanningTable } from "./_components/planning-table";
import { PlanningTableSkeleton } from "./_components/planning-table-skeleton";

async function PlanningContent() {
  const milestones = await getMilestones();
  return <PlanningTable data={milestones} />;
}

export default function PlanningPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Planning</h1>
        <p className="text-muted-foreground text-sm">Project milestones, scheduling, and assignments.</p>
      </div>
      <Suspense fallback={<PlanningTableSkeleton />}>
        <PlanningContent />
      </Suspense>
    </div>
  );
}
