import { Skeleton } from "@/components/ui/skeleton";

export function ProjectsTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <div className="space-y-3 p-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
