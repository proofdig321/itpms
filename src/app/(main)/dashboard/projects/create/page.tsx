import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsers } from "@/lib/services/users";

import { CreateProjectForm } from "./_components/create-project-form";

export default async function CreateProjectPage() {
  const users = await getUsers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Create Project</h1>
        <p className="text-muted-foreground text-sm">Submit a new project to the ICT portfolio.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProjectForm users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
