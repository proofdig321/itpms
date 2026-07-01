"use client";

import { Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlanningStore } from "@/stores/planning/planning-store";
import type { Project } from "@/types/project";

interface ProjectSelectorProps {
  projects: Project[];
  selectedCode: string;
  basePath?: string;
}

export function ProjectSelector({ projects, selectedCode, basePath = "/dashboard/planning" }: ProjectSelectorProps) {
  return (
    <Suspense fallback={<div className="h-8 w-64 animate-pulse rounded-md bg-muted" />}>
      <ProjectSelectorInner projects={projects} selectedCode={selectedCode} basePath={basePath} />
    </Suspense>
  );
}

function ProjectSelectorInner({ projects, selectedCode, basePath }: ProjectSelectorProps & { basePath: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSelectedProjectCode = usePlanningStore((s) => s.setSelectedProjectCode);

  const handleChange = (code: string) => {
    setSelectedProjectCode(code);
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", code);
    router.push(`${basePath}?${params.toString()}`);
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
