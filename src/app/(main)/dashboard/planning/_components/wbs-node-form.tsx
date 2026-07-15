"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type WbsNodeFormValues, wbsLevels, wbsNodeFormSchema } from "@/lib/schemas/wbs";
import type { User } from "@/types/user";

const levelLabels: Record<(typeof wbsLevels)[number], string> = {
  project: "Project",
  phase: "Phase",
  deliverable: "Deliverable",
  "work-package": "Work Package",
  task: "Task",
  "sub-task": "Sub-task",
};

interface WbsNodeFormProps {
  defaultValues?: Partial<WbsNodeFormValues>;
  onSubmit: (values: WbsNodeFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  users?: User[];
}

export function WbsNodeForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  isSubmitting = false,
  users = [],
}: WbsNodeFormProps) {
  const form = useForm<WbsNodeFormValues>({
    resolver: zodResolver(wbsNodeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      level: "task",
      ownerId: null,
      plannedStart: "",
      plannedFinish: "",
      parentId: null,
      ...defaultValues,
    },
  });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FieldGroup className="gap-3">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="wbs-name">Name</FieldLabel>
              <Input {...field} id="wbs-name" placeholder="Enter name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="wbs-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="wbs-description"
                placeholder="Optional description"
                rows={2}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="level"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="wbs-level">Level</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="wbs-level" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {wbsLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {levelLabels[level]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="ownerId"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="wbs-owner">Responsible Person</FieldLabel>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger id="wbs-owner" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="plannedStart"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="wbs-start">Planned Start</FieldLabel>
                <Input {...field} id="wbs-start" type="date" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="plannedFinish"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="wbs-end">Planned Finish</FieldLabel>
                <Input {...field} id="wbs-end" type="date" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
