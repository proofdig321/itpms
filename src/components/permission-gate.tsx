"use client";

import type { ReactNode } from "react";

import { getUserPermissionsContext } from "@/lib/auth/auth-service";
import { can, hasRole } from "@/lib/auth/permissions";

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const ctx = getUserPermissionsContext();

  // No session — allow all (not yet authenticated via Azure)
  if (!ctx) return children;

  // ict-admin has full access
  if (hasRole("ict-admin", ctx)) return children;

  // Other roles — check specific permission
  if (can(permission, ctx)) return children;

  return fallback;
}
