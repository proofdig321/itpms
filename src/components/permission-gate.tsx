"use client";

import type { ReactNode } from "react";

import { getUserPermissionsContext } from "@/lib/auth/auth-service";
import { can, mockUserContext, type Permission } from "@/lib/auth/permissions";

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  // Use real session if available, otherwise fall back to mock for development
  const context = getUserPermissionsContext() ?? mockUserContext;

  if (!can(permission, context)) {
    return fallback;
  }
  return children;
}
