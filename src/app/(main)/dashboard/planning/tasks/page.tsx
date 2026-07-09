import { Suspense } from "react";

import Link from "next/link";

import { Plus } from "lucide-react";

import { PermissionGate } from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/services/projects";
import { getTasksByProject } from "@/lib/services/tasks";

import { ProjectSelector } from "../_components/project-selector";
import { ProjectSync } from "../_components/project-sync";
import { TasksTable } from "./_components/tasks-table";
import { TasksTableSkeleton } from "./_components/tasks-table-skeleton";

interface TasksPageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const projects = await getProjects();
  const fallback = projects[0]?.projectCode ?? "";
  const selectedCode = params.project ?? "";

  if (!selectedCode) {
    return <ProjectSync basePath="/dashboard/planning/tasks" fallbackCode={fallback} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm">Manage project tasks and work assignments.</p>
        </div>
        <div className="flex items-center gap-2">
          <ProjectSelector projects={projects} selectedCode={selectedCode} basePath="/dashboard/planning/tasks" />
          <PermissionGate permission="tasks.create">
            <Button asChild>
              <Link href="/dashboard/planning/tasks/create">
                <Plus className="h-4 w-4" />
                Create Task
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </div>
      <Suspense fallback={<TasksTableSkeleton />}>
        <TasksContent projectCode={selectedCode} />
      </Suspense>
    </div>
  );
}

async function TasksContent({ projectCode }: { projectCode: string }) {
  const tasks = await getTasksByProject(projectCode);
  return <TasksTable data={tasks} />;
}
