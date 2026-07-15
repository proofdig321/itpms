import { z } from "zod";

export const wbsLevels = ["project", "phase", "deliverable", "work-package", "task", "sub-task"] as const;
export const wbsStatuses = ["not-started", "in-progress", "completed"] as const;

export const wbsNodeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  level: z.enum(wbsLevels, { message: "Please select a level." }),
  ownerId: z.string().nullable(),
  plannedStart: z.string().optional(),
  plannedFinish: z.string().optional(),
  parentId: z.string().nullable(),
});

export type WbsNodeFormValues = z.infer<typeof wbsNodeFormSchema>;
