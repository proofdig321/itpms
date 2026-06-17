import { Suspense } from "react";

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
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Projects</h1>
        <p className="text-muted-foreground text-sm">Manage and monitor ICT project portfolio.</p>
      </div>
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}
