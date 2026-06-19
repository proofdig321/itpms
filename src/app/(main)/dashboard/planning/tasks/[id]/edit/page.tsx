import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTaskById } from "@/lib/services/tasks";

import { EditTaskForm } from "./_components/edit-task-form";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

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
              name: task.name,
              description: task.description,
              type: task.type,
              priority: task.priority,
              status: task.status,
              duration: task.duration,
              plannedStart: task.plannedStart,
              plannedFinish: task.plannedFinish,
              actualStart: task.actualStart ?? "",
              actualFinish: task.actualFinish ?? "",
              percentComplete: task.percentComplete,
              assignee: task.assignee ?? "",
              wbsNodeId: task.wbsNodeId ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
