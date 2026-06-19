import type { TaskDependency } from "@/types/dependency";

export type { TaskDependency };

export const dependencies: TaskDependency[] = [
  {
    id: "d1",
    sourceTaskId: "t1",
    targetTaskId: "t2",
    type: "finish-to-start",
  },
  {
    id: "d2",
    sourceTaskId: "t2",
    targetTaskId: "t3",
    type: "finish-to-start",
  },
  {
    id: "d3",
    sourceTaskId: "t3",
    targetTaskId: "t4",
    type: "finish-to-start",
  },
];
