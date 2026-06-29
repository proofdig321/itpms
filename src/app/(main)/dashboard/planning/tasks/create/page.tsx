import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjects } from "@/lib/services/projects";
import { getUsers } from "@/lib/services/users";
import { getWbsByProject } from "@/lib/services/wbs";

import { CreateTaskForm } from "./_components/create-task-form";

export default async function CreateTaskPage() {
  const [projects, users] = await Promise.all([getProjects(), getUsers()]);
  const wbsResults = await Promise.all(projects.map((p) => getWbsByProject(p.projectCode)));
  const wbsNodes = wbsResults.flat();

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
          <CreateTaskForm projects={projects} wbsNodes={wbsNodes} users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
