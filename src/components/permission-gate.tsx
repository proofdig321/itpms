"use client";

import type { ReactNode } from "react";

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ children }: PermissionGateProps) {
  // RBAC enforcement disabled until backend returns full permission set
  // (projects.*, tasks.*, wbs.*). Currently only users.* is returned.
  // Re-enable when Mzo confirms all permission strings are live.
  return children;
}
