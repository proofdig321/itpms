import { z } from "zod";

export const projectStatuses = ["on-track", "at-risk", "delayed", "completed", "not-started"] as const;

const baseProjectFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  status: z.enum(projectStatuses, { message: "Please select a valid status." }),
  progress: z
    .number()
    .int({ message: "Progress must be a whole number." })
    .min(0, { message: "Progress cannot be less than 0." })
    .max(100, { message: "Progress cannot exceed 100." }),
  manager: z.string().min(1, { message: "Manager is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().min(1, { message: "End date is required." }),
});

export const projectFormSchema = baseProjectFormSchema.superRefine((data, ctx) => {
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date cannot be before start date.",
      path: ["endDate"],
    });
  }
});

export type ProjectFormValues = z.infer<typeof baseProjectFormSchema>;
