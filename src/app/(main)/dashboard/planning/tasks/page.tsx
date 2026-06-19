import { Suspense } from "react";

import Link from "next/link";

import { Plus } from "lucide-react";

import { PermissionGate } from "@/components/permission-gate";
import { Button } from "@/components/ui/button";
import { getTasks } from "@/lib/services/tasks";

import { TasksTable } from "./_components/tasks-table";
import { TasksTableSkeleton } from "./_components/tasks-table-skeleton";

async function TasksContent() {
  const tasks = await getTasks();
  return <TasksTable data={tasks} />;
}

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm">Manage project tasks and work assignments.</p>
        </div>
        <PermissionGate permission="planning.edit">
          <Button asChild>
            <Link href="/dashboard/planning/tasks/create">
              <Plus className="h-4 w-4" />
              Create Task
            </Link>
          </Button>
        </PermissionGate>
      </div>
      <Suspense fallback={<TasksTableSkeleton />}>
        <TasksContent />
      </Suspense>
    </div>
  );
}
