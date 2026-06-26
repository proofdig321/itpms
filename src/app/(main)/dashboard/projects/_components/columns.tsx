"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Project } from "@/types/project";

const statusConfig: Record<Project["status"], { label: string; className: string }> = {
  "on-track": {
    label: "On Track",
    className:
      "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300",
  },
  "at-risk": {
    label: "At Risk",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  delayed: {
    label: "Delayed",
    className: "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300",
  },
  completed: {
    label: "Completed",
    className: "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
  "not-started": {
    label: "Not Started",
    className: "border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400",
  },
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "projectCode",
    header: "Code",
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Link href={`/dashboard/projects/${project.id}`} className="hover:underline">
          {project.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Project["status"];
      const config = statusConfig[status];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number;
      return (
        <div className="flex items-center gap-2">
          <Progress value={progress} className="h-2 w-20" />
          <span className="text-muted-foreground text-sm">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "managerId",
    header: "Manager",
  },
  {
    accessorKey: "endDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("endDate") as string;
      return new Date(date).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <Button asChild variant="ghost" size="icon-sm" aria-label={`Edit ${project.title}`}>
          <Link href={`/dashboard/projects/${project.id}/edit`}>
            <Pencil className="h-3.5 w-3.5" />
          </Link>
        </Button>
      );
    },
  },
];
