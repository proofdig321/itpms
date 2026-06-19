export type DependencyType = "finish-to-start" | "start-to-start" | "finish-to-finish" | "start-to-finish";

export interface TaskDependency {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  type: DependencyType;
}
