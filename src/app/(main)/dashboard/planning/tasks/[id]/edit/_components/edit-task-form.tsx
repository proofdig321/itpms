"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { TaskFormValues } from "@/lib/schemas/task";
import { updateTask } from "@/lib/services/tasks";

import { TaskForm } from "../../../_components/task-form";

interface EditTaskFormProps {
  taskId: string;
  defaultValues: TaskFormValues;
}

export function EditTaskForm({ taskId, defaultValues }: EditTaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      await updateTask(taskId, values);
      toast.success("Task updated successfully.");
      router.push("/dashboard/planning/tasks");
    } catch {
      toast.error("Failed to update task.");
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
    />
  );
}
