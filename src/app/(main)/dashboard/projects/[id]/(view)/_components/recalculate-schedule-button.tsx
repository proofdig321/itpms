"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { recalculateSchedule } from "@/lib/services/projects";

export function RecalculateScheduleButton({ projectCode }: { projectCode: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    try {
      await recalculateSchedule(projectCode);
      toast.success("Schedule recalculated.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to recalculate schedule.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
      <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Recalculating..." : "Recalculate Schedule"}
    </Button>
  );
}
