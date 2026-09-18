import Link from "next/link";

import { FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

interface NoProjectsStateProps {
  title?: string;
  description?: string;
}

export function NoProjectsState({
  title = "No projects available",
  description = "Planning views are scoped to a project. Create a project first to manage its work breakdown, tasks, and schedule.",
}: NoProjectsStateProps) {
  return (
    <Empty className="min-h-[60vh]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/dashboard/projects">Go to Projects</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
