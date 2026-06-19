"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { WbsNodeFormValues } from "@/lib/schemas/wbs";
import { createWbsNode, deleteWbsNode, updateWbsNode } from "@/lib/services/wbs-mutations";
import type { WbsNode } from "@/types/wbs";

import { WbsNodeForm } from "./wbs-node-form";

interface AddWbsNodeDialogProps {
  projectCode: string;
  parentId: string | null;
  parentName?: string;
}

export function AddWbsNodeDialog({ projectCode, parentId, parentName }: AddWbsNodeDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: WbsNodeFormValues) => {
    setIsSubmitting(true);
    try {
      await createWbsNode(projectCode, { ...values, parentId });
      toast.success("WBS node created.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to create WBS node.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={parentName ? `Add child to ${parentName}` : "Add WBS node"}>
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parentName ? `Add child to "${parentName}"` : "Add WBS Node"}</DialogTitle>
        </DialogHeader>
        <WbsNodeForm
          onSubmit={handleSubmit}
          submitLabel="Create"
          isSubmitting={isSubmitting}
          defaultValues={{ parentId }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EditWbsNodeDialogProps {
  node: WbsNode;
}

export function EditWbsNodeDialog({ node }: EditWbsNodeDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: WbsNodeFormValues) => {
    setIsSubmitting(true);
    try {
      await updateWbsNode(node.id, values);
      toast.success("WBS node updated.");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Failed to update WBS node.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${node.name}`}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit "{node.name}"</DialogTitle>
        </DialogHeader>
        <WbsNodeForm
          onSubmit={handleSubmit}
          submitLabel="Update"
          isSubmitting={isSubmitting}
          defaultValues={{
            name: node.name,
            description: node.description ?? "",
            level: node.level,
            status: node.status,
            progress: node.progress,
            assignee: node.assignee ?? "",
            startDate: node.startDate ?? "",
            endDate: node.endDate ?? "",
            parentId: node.parentId,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteWbsNodeDialogProps {
  node: WbsNode;
}

export function DeleteWbsNodeDialog({ node }: DeleteWbsNodeDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWbsNode(node.id);
      toast.success("WBS node deleted.");
      router.refresh();
    } catch {
      toast.error("Failed to delete WBS node.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Delete ${node.name}`}>
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete WBS Node</AlertDialogTitle>
          <AlertDialogDescription>
            Delete &quot;{node.name}&quot; and all its children? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
