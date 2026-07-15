"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WbsNodeFormValues } from "@/lib/schemas/wbs";
import { createWbsNode, deleteWbsNode, updateWbsNode } from "@/lib/services/wbs-mutations";
import type { User } from "@/types/user";
import type { WbsNode } from "@/types/wbs";

import { WbsNodeForm } from "./wbs-node-form";

interface AddWbsNodeDialogProps {
  projectCode: string;
  parentId: string | null;
  parentName?: string;
  users?: User[];
}

export function AddWbsNodeDialog({ projectCode, parentId, parentName, users = [] }: AddWbsNodeDialogProps) {
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create WBS node.";
      toast.error(message);
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
          defaultValues={{ parentId, level: parentId ? "phase" : "project" }}
          users={users}
        />
      </DialogContent>
    </Dialog>
  );
}

interface WbsNodeActionsProps {
  node: WbsNode;
  users?: User[];
}

export function WbsNodeActions({ node, users = [] }: WbsNodeActionsProps) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (values: WbsNodeFormValues) => {
    setIsSubmitting(true);
    try {
      await updateWbsNode(node.id, values);
      toast.success("WBS node updated.");
      setShowEdit(false);
      router.refresh();
    } catch {
      toast.error("Failed to update WBS node.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      setShowDelete(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setShowEdit(true)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={() => setShowDelete(true)}>
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit &quot;{node.name}&quot;</DialogTitle>
          </DialogHeader>
          <WbsNodeForm
            onSubmit={handleUpdate}
            submitLabel="Update"
            isSubmitting={isSubmitting}
            defaultValues={{
              name: node.name,
              description: node.description ?? "",
              level: node.level,
              ownerId: node.ownerId,
              plannedStart: node.plannedStart ?? "",
              plannedFinish: node.plannedFinish ?? "",
              parentId: node.parentId,
            }}
            users={users}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete WBS Node</AlertDialogTitle>
            <AlertDialogDescription>
              Delete &quot;{node.name}&quot; and all its children? This action cannot be undone.
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
    </>
  );
}

// Keep legacy exports for backward compatibility
export const EditWbsNodeDialog = WbsNodeActions;
export const DeleteWbsNodeDialog = (_props: { node: WbsNode }) => null;
