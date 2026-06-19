"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { TaskFormValues } from "@/lib/schemas/task";
import { createTask } from "@/lib/services/tasks";

import { TaskForm } from "../../_components/task-form";

export function CreateTaskForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      await createTask("ITPMS-001", values);
      toast.success("Task created successfully.");
      router.push("/dashboard/planning/tasks");
    } catch {
      toast.error("Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <TaskForm onSubmit={handleSubmit} submitLabel="Create Task" isSubmitting={isSubmitting} />;
}
