import { z } from "zod";

export const projectStatuses = ["on-track", "at-risk", "delayed", "completed", "not-started"] as const;

const baseProjectFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  managerId: z.string().min(1, { message: "Manager is required." }),
  plannedStart: z.string().min(1, { message: "Planned start date is required." }),
  plannedFinish: z.string().min(1, { message: "Planned finish date is required." }),
});

export const projectFormSchema = baseProjectFormSchema.superRefine((data, ctx) => {
  if (data.plannedStart && data.plannedFinish && data.plannedFinish < data.plannedStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Planned finish cannot be before planned start.",
      path: ["plannedFinish"],
    });
  }
});

export type ProjectFormValues = z.infer<typeof baseProjectFormSchema>;
