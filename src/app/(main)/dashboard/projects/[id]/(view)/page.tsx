import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { PermissionGate } from "@/components/permission-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProjectById } from "@/lib/services/projects";

import { DeleteProjectDialog } from "./_components/delete-project-dialog";

const statusConfig: Record<string, { label: string; className: string }> = {
  "on-track": {
    label: "On Track",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  "at-risk": {
    label: "At Risk",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  delayed: {
    label: "Delayed",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
  completed: {
    label: "Completed",
    className: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  "not-started": {
    label: "Not Started",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const status = statusConfig[project.status];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground text-sm">{project.projectCode}</p>
        </div>
        <div className="flex gap-2">
          <PermissionGate permission="projects.edit">
            <Button asChild variant="outline">
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </PermissionGate>
          <PermissionGate permission="projects.delete">
            <DeleteProjectDialog projectId={project.id} projectTitle={project.title} />
          </PermissionGate>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Badge className={status.className}>{status.label}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Progress value={project.progress} className="h-2 flex-1" />
            <span className="font-medium text-sm tabular-nums">{project.progress}%</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Project Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-sm">{project.manager}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-normal text-muted-foreground text-sm">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {new Date(project.startDate).toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" — "}
              {new Date(project.endDate).toLocaleDateString("en-ZA", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal text-muted-foreground text-sm">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{project.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
