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
export const taskStatuses = ["draft", "not-started", "in-progress", "completed", "on-hold"] as const;

export const taskFormSchema = z.object({
  projectCode: z.string().min(1, { message: "Project is required." }),
  wbsNodeId: z.string().min(1, { message: "WBS node is required." }),
  name: z.string().min(1, { message: "Task name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  type: z.enum(taskTypes, { message: "Please select a task type." }),
  priority: z.enum(taskPriorities, { message: "Please select a priority." }),
  status: z.enum(taskStatuses, { message: "Please select a status." }),
  plannedStart: z.string().min(1, { message: "Planned start is required." }),
  plannedFinish: z.string().min(1, { message: "Planned finish is required." }),
  assigneeId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
