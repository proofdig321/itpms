"use client";

import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import type { TaskDependency } from "@/types/dependency";
import type { Task, TaskStatus } from "@/types/task";

const statusColors: Record<TaskStatus, string> = {
  draft: "bg-gray-300 dark:bg-gray-600",
  "not-started": "bg-gray-300 dark:bg-gray-600",
  "in-progress": "bg-green-500 dark:bg-green-600",
  completed: "bg-gray-400 dark:bg-gray-500",
  "on-hold": "bg-amber-500 dark:bg-amber-600",
  "pending-approval": "bg-blue-400 dark:bg-blue-600",
  cancelled: "bg-red-400 dark:bg-red-600",
};

const dependencyLabels: Record<string, string> = {
  "finish-to-start": "FS",
  "start-to-start": "SS",
  "finish-to-finish": "FF",
  "start-to-finish": "SF",
};

interface GanttTimelineProps {
  tasks: Task[];
  dependencies: TaskDependency[];
}

export function GanttTimeline({ tasks, dependencies }: GanttTimelineProps) {
  const validTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.plannedStart &&
          t.plannedFinish &&
          !Number.isNaN(new Date(t.plannedStart).getTime()) &&
          !Number.isNaN(new Date(t.plannedFinish).getTime()),
      ),
    [tasks],
  );

  const { startDate, endDate, totalDays } = useMemo(() => {
    if (validTasks.length === 0) return { startDate: new Date(), endDate: new Date(), totalDays: 1 };

    const dates = validTasks.flatMap((t) => [new Date(t.plannedStart), new Date(t.plannedFinish)]);
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
    const days = Math.max(1, Math.ceil((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24)));
    return { startDate: min, endDate: max, totalDays: days };
  }, [validTasks]);

  const taskDeps = useMemo(() => {
    const map = new Map<string, TaskDependency[]>();
    for (const dep of dependencies) {
      const existing = map.get(dep.targetTaskId) ?? [];
      existing.push(dep);
      map.set(dep.targetTaskId, existing);
    }
    return map;
  }, [dependencies]);

  const months = useMemo(() => {
    const result: { label: string; left: number }[] = [];
    const current = new Date(startDate);
    current.setDate(1);
    while (current <= endDate) {
      const offset = (current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (offset >= 0) {
        result.push({
          label: current.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" }),
          left: (offset / totalDays) * 100,
        });
      }
      current.setMonth(current.getMonth() + 1);
    }
    return result;
  }, [startDate, endDate, totalDays]);

  if (validTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
        <p className="font-medium text-sm">No tasks to display</p>
        <p className="mt-1 text-muted-foreground text-sm">Create tasks to see the timeline.</p>
      </div>
    );
  }

  const getPosition = (date: string) => {
    const d = new Date(date);
    const offset = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (offset / totalDays) * 100;
  };

  const getWidth = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const duration = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, (duration / totalDays) * 100);
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <div className="min-w-[600px]">
        {/* Month headers */}
        <div className="relative h-8 border-b bg-muted/30">
          {months.map((month) => (
            <span
              key={month.label}
              className="absolute top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
              style={{ left: `${Math.max(0, month.left)}%` }}
            >
              {month.label}
            </span>
          ))}
        </div>

        {/* Task rows */}
        <div className="divide-y">
          {tasks.map((task) => {
            const hasdates = task.plannedStart && task.plannedFinish;
            const left = hasdates ? getPosition(task.plannedStart) : 0;
            const width = hasdates ? getWidth(task.plannedStart, task.plannedFinish) : 0;
            const deps = taskDeps.get(task.id);

            return (
              <div key={task.id} className="flex items-center gap-3 px-3 py-2">
                <div className="w-40 shrink-0 truncate text-sm">{task.name}</div>
                <div className="relative h-6 flex-1">
                  <div
                    className={`absolute top-1 h-4 rounded ${statusColors[task.status]}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${task.percentComplete}% complete`}
                  >
                    {task.percentComplete > 0 && task.percentComplete < 100 && (
                      <div className="h-full rounded bg-black/20" style={{ width: `${task.percentComplete}%` }} />
                    )}
                  </div>
                </div>
                <div className="w-16 shrink-0 text-right">
                  {deps && deps.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {deps.map((d) => dependencyLabels[d.type]).join(", ")}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
