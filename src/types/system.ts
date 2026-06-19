export type NotificationType =
  | "milestone-due"
  | "task-delayed"
  | "baseline-approval"
  | "critical-path-change"
  | "resource-conflict"
  | "schedule-slippage";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  projectCode: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
}
