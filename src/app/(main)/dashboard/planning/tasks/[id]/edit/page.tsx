import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/lib/services/projects-queries";
import { getTaskById } from "@/lib/services/tasks-queries";
import { getUsers } from "@/lib/services/users";
import { getWbsByProject } from "@/lib/services/wbs";

import { EditTaskForm } from "./_components/edit-task-form";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const [task, projects, users] = await Promise.all([getTaskById(id), getProjects(), getUsers()]);

  if (!task) {
    notFound();
  }

  const wbsNodes = await getWbsByProject(task.projectCode);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Edit Task</h1>
        <p className="text-muted-foreground text-sm">{task.name}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditTaskForm
            taskId={task.id}
            defaultValues={{
              projectCode: task.projectCode,
              wbsNodeId: task.wbsNodeId ?? "",
              name: task.name,
              description: task.description,
              type: task.type,
              priority: task.priority,
              duration: task.duration ?? 1,
              plannedStart: task.plannedStart,
              plannedFinish: task.plannedFinish,
              plannedCost: task.plannedCost ? Number(task.plannedCost) : undefined,
              assignments: task.assignments.map(({ userId, role, allocation }) => ({ userId, role, allocation })),
              dependencies: task.predecessorDependencies.map(
                ({ predecessorTaskId, dependencyType, lag, lead, mandatory }) => ({
                  predecessorTaskId,
                  dependencyType,
                  lag,
                  lead,
                  mandatory,
                }),
              ),
            }}
            projects={projects}
            wbsNodes={wbsNodes}
            users={users}
          />
        </CardContent>
      </Card>
    </div>
  );
}
