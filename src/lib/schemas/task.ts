import { z } from "zod";

export const taskTypes = [
  "planning",
  "design",
  "procurement",
  "implementation",
  "testing",
  "training",
  "documentation",
  "closure",
] as const;
export const taskPriorities = ["critical", "high", "medium", "low"] as const;
export const taskStatuses = [
  "draft",
  "not-started",
  "in-progress",
  "completed",
  "on-hold",
  "pending-approval",
  "cancelled",
] as const;

export const assignmentSchema = z.object({
  userId: z.string().min(1, { message: "User is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  allocation: z.number().min(0).max(100, { message: "Allocation must be 0-100." }),
});

export const dependencySchema = z.object({
  predecessorTaskId: z.string().min(1, { message: "Predecessor task is required." }),
  dependencyType: z.enum(["FS", "SS", "FF", "SF"]),
  lag: z.number().int().min(0),
  lead: z.number().int().min(0),
  mandatory: z.boolean(),
});

export const taskFormSchema = z.object({
  projectCode: z.string().min(1, { message: "Project is required." }),
  wbsNodeId: z.string().min(1, { message: "WBS node is required." }),
  name: z.string().min(1, { message: "Task name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  type: z.enum(taskTypes, { message: "Please select a task type." }),
  priority: z.enum(taskPriorities, { message: "Please select a priority." }),
  duration: z.number().min(1, { message: "Duration must be at least 1 working day." }),
  plannedStart: z.string().min(1, { message: "Planned start is required." }),
  plannedFinish: z.string().min(1, { message: "Planned finish is required." }),
  plannedCost: z.number().min(0).optional(),
  assignments: z.array(assignmentSchema),
  dependencies: z.array(dependencySchema),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type DependencyFormValue = z.infer<typeof dependencySchema>;
