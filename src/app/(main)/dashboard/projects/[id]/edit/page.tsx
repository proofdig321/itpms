import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectById } from "@/lib/services/projects";
import { getUsers } from "@/lib/services/users";

import { EditProjectForm } from "./_components/edit-project-form";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [project, users] = await Promise.all([getProjectById(id), getUsers()]);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground text-sm">
          {project.projectCode} — {project.title}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProjectForm
            projectId={project.id}
            defaultValues={{
              title: project.title,
              description: project.description,
              managerId: project.managerId ?? "",
              plannedStart: project.plannedStart ?? "",
              plannedFinish: project.plannedFinish ?? "",
            }}
            users={users}
          />
        </CardContent>
      </Card>
    </div>
  );
}
