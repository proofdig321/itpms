import "server-only";

import { auditEntries as mockAudit, notifications as mockNotifications } from "@/data/system";
import type { AuditEntry, Notification } from "@/types/system";

export async function getNotifications(): Promise<Notification[]> {
  try {
    return mockNotifications;
  } catch {
    return [];
  }
}

export async function getAuditEntries(): Promise<AuditEntry[]> {
  try {
    return mockAudit;
  } catch {
    return [];
  }
}
