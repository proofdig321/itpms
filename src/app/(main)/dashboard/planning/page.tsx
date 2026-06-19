import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDependenciesByProject } from "@/lib/services/dependencies";
import { getMilestones } from "@/lib/services/planning";
import { getTasksByProject } from "@/lib/services/tasks";
import { getWbsByProject } from "@/lib/services/wbs";

import { GanttTimeline } from "./_components/gantt-timeline";
import { PlanningTable } from "./_components/planning-table";
import { PlanningTableSkeleton } from "./_components/planning-table-skeleton";
import { WbsTree } from "./_components/wbs-tree";

async function MilestonesContent() {
  const milestones = await getMilestones();
  return <PlanningTable data={milestones} />;
}

async function WbsContent() {
  const nodes = await getWbsByProject("ITPMS-001");
  return <WbsTree nodes={nodes} projectCode="ITPMS-001" />;
}

async function GanttContent() {
  const tasks = await getTasksByProject("ITPMS-001");
  const taskIds = tasks.map((t) => t.id);
  const deps = await getDependenciesByProject(taskIds);
  return <GanttTimeline tasks={tasks} dependencies={deps} />;
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
          <TabsTrigger value="gantt">Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value="wbs" className="mt-4">
          <Suspense fallback={<PlanningTableSkeleton />}>
            <WbsContent />
          </Suspense>
        </TabsContent>
        <TabsContent value="gantt" className="mt-4">
          <Suspense fallback={<PlanningTableSkeleton />}>
            <GanttContent />
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
