"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { ProjectFormValues } from "@/lib/schemas/project";
import { createProject } from "@/lib/services/projects";

import { ProjectForm } from "../../_components/project-form";

export function CreateProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      await createProject(values);
      toast.success("Project created successfully.");
      router.push("/dashboard/projects");
    } catch {
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" isSubmitting={isSubmitting} />;
}
