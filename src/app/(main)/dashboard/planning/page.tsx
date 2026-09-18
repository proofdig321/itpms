import { Suspense } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMilestones } from "@/lib/services/planning";
import { getProjects } from "@/lib/services/projects-queries";
import { getTasksByProject } from "@/lib/services/tasks-queries";
import { getUsers } from "@/lib/services/users";
import { getWbsByProject } from "@/lib/services/wbs";

import { GanttTimeline } from "./_components/gantt-timeline";
import { NoProjectsState } from "./_components/no-projects-state";
import { PlanningTable } from "./_components/planning-table";
import { PlanningTableSkeleton } from "./_components/planning-table-skeleton";
import { ProjectSelector } from "./_components/project-selector";
import { ProjectSync } from "./_components/project-sync";
import { WbsTree } from "./_components/wbs-tree";

interface PlanningPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function PlanningPage({ searchParams }: PlanningPageProps) {
  const params = await searchParams;
  const projects = await getProjects();
  const fallback = projects[0]?.projectCode ?? "";
  const selectedCode = params.project ?? "";

  if (projects.length === 0) {
    return <NoProjectsState />;
  }

  if (!selectedCode) {
    return <ProjectSync basePath="/dashboard/planning" fallbackCode={fallback} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Planning</h1>
          <p className="text-muted-foreground text-sm">Project milestones, scheduling, and work breakdown structure.</p>
        </div>
        <ProjectSelector projects={projects} selectedCode={selectedCode} />
      </div>
      <Tabs defaultValue="wbs">
        <TabsList>
          <TabsTrigger value="wbs">Work Breakdown</TabsTrigger>
          <TabsTrigger value="gantt">Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value="wbs" className="mt-4">
          <Suspense fallback={<PlanningTableSkeleton />}>
            <WbsContent projectCode={selectedCode} />
          </Suspense>
        </TabsContent>
        <TabsContent value="gantt" className="mt-4">
          <Suspense fallback={<PlanningTableSkeleton />}>
            <GanttContent projectCode={selectedCode} />
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

async function WbsContent({ projectCode }: { projectCode: string }) {
  const [nodes, users] = await Promise.all([getWbsByProject(projectCode), getUsers()]);
  return <WbsTree nodes={nodes} projectCode={projectCode} users={users} />;
}

async function GanttContent({ projectCode }: { projectCode: string }) {
  const tasks = await getTasksByProject(projectCode);
  return <GanttTimeline tasks={tasks} />;
}

async function MilestonesContent() {
  const milestones = await getMilestones();
  return <PlanningTable data={milestones} />;
}
