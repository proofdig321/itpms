"use client";

import { Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from "@/types/project";

interface ProjectSelectorProps {
  projects: Project[];
  selectedCode: string;
}

export function ProjectSelector({ projects, selectedCode }: ProjectSelectorProps) {
  return (
    <Suspense fallback={<div className="h-8 w-64 animate-pulse rounded-md bg-muted" />}>
      <ProjectSelectorInner projects={projects} selectedCode={selectedCode} />
    </Suspense>
  );
}

function ProjectSelectorInner({ projects, selectedCode }: ProjectSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (code: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", code);
    router.push(`/dashboard/planning?${params.toString()}`);
  };

  if (projects.length === 0) return null;

  return (
    <Select value={selectedCode} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder="Select project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((p) => (
          <SelectItem key={p.projectCode} value={p.projectCode}>
            {p.projectCode} — {p.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
