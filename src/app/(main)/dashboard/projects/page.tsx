import { Suspense } from "react";

import Link from "next/link";

import { Plus } from "lucide-react";

import { PermissionGate } from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/services/projects";

import { ProjectsTable } from "./_components/projects-table";
import { ProjectsTableSkeleton } from "./_components/projects-table-skeleton";

async function ProjectsContent() {
  const projects = await getProjects();
  return <ProjectsTable data={projects} />;
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage and monitor ICT project portfolio.</p>
        </div>
        <PermissionGate permission="projects.create">
          <Button asChild>
            <Link href="/dashboard/projects/create">
              <Plus className="h-4 w-4" />
              Create Project
            </Link>
          </Button>
        </PermissionGate>
      </div>
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}
