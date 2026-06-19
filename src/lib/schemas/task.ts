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
export const taskStatuses = ["not-started", "in-progress", "completed", "on-hold"] as const;

export const taskFormSchema = z.object({
  name: z.string().min(1, { message: "Task name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  type: z.enum(taskTypes, { message: "Please select a task type." }),
  priority: z.enum(taskPriorities, { message: "Please select a priority." }),
  status: z.enum(taskStatuses, { message: "Please select a status." }),
  duration: z.number().int().min(1, { message: "Duration must be at least 1 day." }),
  plannedStart: z.string().min(1, { message: "Planned start is required." }),
  plannedFinish: z.string().min(1, { message: "Planned finish is required." }),
  actualStart: z.string().optional(),
  actualFinish: z.string().optional(),
  percentComplete: z
    .number()
    .int()
    .min(0, { message: "Cannot be less than 0." })
    .max(100, { message: "Cannot exceed 100." }),
  assignee: z.string().optional(),
  wbsNodeId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
