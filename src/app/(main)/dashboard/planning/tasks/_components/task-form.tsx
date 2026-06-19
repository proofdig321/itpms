"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type TaskFormValues, taskFormSchema, taskPriorities, taskStatuses, taskTypes } from "@/lib/schemas/task";

const typeLabels: Record<(typeof taskTypes)[number], string> = {
  planning: "Planning",
  design: "Design",
  procurement: "Procurement",
  implementation: "Implementation",
  testing: "Testing",
  training: "Training",
  documentation: "Documentation",
  closure: "Closure",
};

const priorityLabels: Record<(typeof taskPriorities)[number], string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const statusLabels: Record<(typeof taskStatuses)[number], string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
  "on-hold": "On Hold",
};

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function TaskForm({ defaultValues, onSubmit, submitLabel = "Save Task", isSubmitting = false }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "implementation",
      priority: "medium",
      status: "not-started",
      duration: 1,
      plannedStart: "",
      plannedFinish: "",
      actualStart: "",
      actualFinish: "",
      percentComplete: 0,
      assignee: "",
      wbsNodeId: "",
      ...defaultValues,
    },
  });

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup className="gap-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-name">Task Name</FieldLabel>
              <Input {...field} id="task-name" placeholder="Enter task name" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="task-description"
                placeholder="Describe the task"
                rows={3}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-type">Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-type" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {typeLabels[t]}
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
            name="priority"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-priority" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskPriorities.map((p) => (
                      <SelectItem key={p} value={p}>
                        {priorityLabels[p]}
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
            name="status"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-status">Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-status" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Controller
            control={form.control}
            name="duration"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-duration">Duration (days)</FieldLabel>
                <Input
                  id="task-duration"
                  type="number"
                  min={1}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 1)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="percentComplete"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-percent">Complete (%)</FieldLabel>
                <Input
                  id="task-percent"
                  type="number"
                  min={0}
                  max={100}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="assignee"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-assignee">Assignee</FieldLabel>
                <Input {...field} id="task-assignee" placeholder="Assigned person" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="plannedStart"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-start">Planned Start</FieldLabel>
                <Input {...field} id="task-start" type="date" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="plannedFinish"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-finish">Planned Finish</FieldLabel>
                <Input {...field} id="task-finish" type="date" aria-invalid={fieldState.invalid} />
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
