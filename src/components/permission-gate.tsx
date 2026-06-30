"use client";

import type { ReactNode } from "react";

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ children }: PermissionGateProps) {
  // RBAC enforcement disabled until backend permission strings are aligned.
  // All authenticated users see all actions.
  // Re-enable when Mr Nkosi confirms permission strings match:
  // "projects.create", "projects.edit", "projects.delete", etc.
  return children;
}
