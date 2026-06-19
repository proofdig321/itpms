import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateTaskForm } from "./_components/create-task-form";

export default function CreateTaskPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Create Task</h1>
        <p className="text-muted-foreground text-sm">Add a new task to the project plan.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateTaskForm />
        </CardContent>
      </Card>
    </div>
  );
}
