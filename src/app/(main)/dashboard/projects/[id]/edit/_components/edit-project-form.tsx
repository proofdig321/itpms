"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { ProjectFormValues } from "@/lib/schemas/project";
import { updateProject } from "@/lib/services/projects";
import type { User } from "@/types/user";

import { ProjectForm } from "../../../_components/project-form";

interface EditProjectFormProps {
  projectId: string;
  defaultValues: ProjectFormValues;
  users: User[];
}

export function EditProjectForm({ projectId, defaultValues, users }: EditProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      await updateProject(projectId, values);
      toast.success("Project updated successfully.");
      router.push("/dashboard/projects");
    } catch {
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProjectForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel="Update Project"
      isSubmitting={isSubmitting}
      users={users}
    />
  );
}
