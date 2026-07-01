"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { usePlanningStore } from "@/stores/planning/planning-store";

interface ProjectSyncProps {
  basePath: string;
  fallbackCode: string;
}

export function ProjectSync({ basePath, fallbackCode }: ProjectSyncProps) {
  const router = useRouter();
  const stored = usePlanningStore((s) => s.selectedProjectCode);

  useEffect(() => {
    const code = stored || fallbackCode;
    if (code) {
      router.replace(`${basePath}?project=${code}`);
    }
  }, [stored, fallbackCode, basePath, router]);

  return null;
}
