"use client";

import type { ReactNode } from "react";

import { getSessionUser, getUserPermissionsContext } from "@/lib/auth/auth-service";
import { can, mockUserContext, type Permission } from "@/lib/auth/permissions";

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const sessionUser = getSessionUser();

  // Not authenticated at all — use mock context (development mode)
  if (!sessionUser) {
    const context = mockUserContext;
    if (!can(permission, context)) return fallback;
    return children;
  }

  // Authenticated — use real permissions from session
  const context = getUserPermissionsContext();
  if (!context) {
    // User is logged in but has no permissions assigned — show all (temporary until roles configured)
    return children;
  }

  if (!can(permission, context)) return fallback;
  return children;
}
