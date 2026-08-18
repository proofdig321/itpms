"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { approveTask, rejectTask } from "@/lib/services/tasks";

interface TaskApprovalActionsProps {
  taskId: string;
  taskName: string;
}

export function TaskApprovalActions({ taskId, taskName }: TaskApprovalActionsProps) {
  const router = useRouter();
  const [showReject, setShowReject] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveTask(taskId);
      toast.success("Task approved.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve task.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("A rejection reason is required.");
      return;
    }
    setIsRejecting(true);
    try {
      await rejectTask(taskId, rejectReason.trim());
      toast.success("Task rejected.");
      setShowReject(false);
      setRejectReason("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject task.");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleApprove} disabled={isApproving}>
        <Check className="h-4 w-4" />
        {isApproving ? "Approving..." : "Approve"}
      </Button>
      <Button variant="outline" className="text-destructive" onClick={() => setShowReject(true)}>
        <X className="h-4 w-4" />
        Reject
      </Button>

      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Task — {taskName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rejectReason">Rejection Reason</Label>
            <Textarea
              id="rejectReason"
              placeholder="Explain why this task is being rejected..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReject(false)} disabled={isRejecting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting || !rejectReason.trim()}>
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
