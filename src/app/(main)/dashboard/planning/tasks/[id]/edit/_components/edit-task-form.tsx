"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { TaskFormValues } from "@/lib/schemas/task";
import { updateTask } from "@/lib/services/tasks";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";
import type { WbsNode } from "@/types/wbs";

import { TaskForm } from "../../../_components/task-form";

interface EditTaskFormProps {
  taskId: string;
  defaultValues: TaskFormValues;
  projects: Project[];
  wbsNodes: WbsNode[];
  users: User[];
}

export function EditTaskForm({ taskId, defaultValues, projects, wbsNodes, users }: EditTaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      await updateTask(taskId, values);
      toast.success("Task updated successfully.");
      router.push("/dashboard/planning/tasks");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TaskForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel="Update Task"
      isSubmitting={isSubmitting}
      projects={projects}
      wbsNodes={wbsNodes}
      users={users}
    />
  );
}
