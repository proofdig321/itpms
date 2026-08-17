"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { TaskFormValues } from "@/lib/schemas/task";
import { createTask } from "@/lib/services/tasks";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";

import { TaskForm } from "../../_components/task-form";

interface CreateTaskFormProps {
  projects: Project[];
  users: User[];
}

export function CreateTaskForm({ projects, users }: CreateTaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      await createTask(values.projectCode, values);
      toast.success("Task created successfully.");
      router.push("/dashboard/planning/tasks");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TaskForm
      onSubmit={handleSubmit}
      submitLabel="Create Task"
      isSubmitting={isSubmitting}
      projects={projects}
      users={users}
    />
  );
}
