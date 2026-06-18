import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMilestones } from "@/lib/services/planning";
import { getWbsByProject } from "@/lib/services/wbs";

import { PlanningTable } from "./_components/planning-table";
import { PlanningTableSkeleton } from "./_components/planning-table-skeleton";
import { WbsTree } from "./_components/wbs-tree";

async function MilestonesContent() {
  const milestones = await getMilestones();
  return <PlanningTable data={milestones} />;
}

async function WbsContent() {
  const nodes = await getWbsByProject("ITPMS-001");
  return <WbsTree nodes={nodes} />;
}

export default function PlanningPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Planning</h1>
        <p className="text-muted-foreground text-sm">Project milestones, scheduling, and work breakdown structure.</p>
      </div>
      <Tabs defaultValue="wbs">
        <TabsList>
          <TabsTrigger value="wbs">Work Breakdown</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value="wbs" className="mt-4">
          <Suspense fallback={<PlanningTableSkeleton />}>
            <WbsContent />
          </Suspense>
        </TabsContent>
        <TabsContent value="milestones" className="mt-4">
          <Suspense fallback={<PlanningTableSkeleton />}>
            <MilestonesContent />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
