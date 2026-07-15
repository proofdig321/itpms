"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type TaskFormValues, taskFormSchema, taskPriorities, taskTypes } from "@/lib/schemas/task";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";
import type { WbsNode } from "@/types/wbs";

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

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  projects: Project[];
  wbsNodes: WbsNode[];
  users: User[];
}

export function TaskForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save Task",
  isSubmitting = false,
  projects,
  wbsNodes,
  users,
}: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      projectCode: "",
      wbsNodeId: "",
      name: "",
      description: "",
      type: "implementation",
      priority: "medium",
      duration: 1,
      plannedStart: "",
      plannedFinish: "",
      assignments: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "assignments",
  });

  const selectedProjectCode = form.watch("projectCode");
  const filteredWbsNodes = wbsNodes.filter((n) => n.projectCode === selectedProjectCode);

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="projectCode"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-project">Project</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-project" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.projectCode} value={p.projectCode}>
                        {p.projectCode} — {p.title}
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
            name="wbsNodeId"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-wbs">WBS Node</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-wbs" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select WBS node" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredWbsNodes.map((n) => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.code} — {n.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field className="gap-1.5" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="task-type">Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="task-type" className="w-full">
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
                  <SelectTrigger id="task-priority" className="w-full">
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

        <Controller
          control={form.control}
          name="duration"
          render={({ field, fieldState }) => (
            <Field className="gap-1.5 sm:max-w-[200px]" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-duration">Duration (working days)</FieldLabel>
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

        {/* Assignments */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <FieldLabel>Assignments</FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ userId: "", role: "", allocation: 100 })}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-muted-foreground text-sm">No assignments. Click "Add" to assign team members.</p>
          )}

          {fields.map((item, index) => (
            <div key={item.id} className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_80px_auto]">
              <Controller
                control={form.control}
                name={`assignments.${index}.userId`}
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel className="text-xs">User</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name={`assignments.${index}.role`}
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel className="text-xs">Role</FieldLabel>
                    <Input {...field} placeholder="e.g. Technician" aria-invalid={fieldState.invalid} />
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name={`assignments.${index}.allocation`}
                render={({ field, fieldState }) => (
                  <Field className="gap-1">
                    <FieldLabel className="text-xs">%</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      aria-invalid={fieldState.invalid}
                    />
                  </Field>
                )}
              />
              <div className="flex items-end">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(index)} aria-label="Remove">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
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
