import { z } from "zod";

export const wbsLevels = ["project", "phase", "deliverable", "work-package", "task", "sub-task"] as const;
export const wbsStatuses = ["not-started", "in-progress", "completed"] as const;

export const wbsNodeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  level: z.enum(wbsLevels, { message: "Please select a level." }),
  status: z.enum(wbsStatuses, { message: "Please select a status." }),
  progress: z
    .number()
    .int({ message: "Progress must be a whole number." })
    .min(0, { message: "Progress cannot be less than 0." })
    .max(100, { message: "Progress cannot exceed 100." }),
  assignee: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  parentId: z.string().nullable(),
});

export type WbsNodeFormValues = z.infer<typeof wbsNodeFormSchema>;
