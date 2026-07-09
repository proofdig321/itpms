"use client";

import type { ReactNode } from "react";

import { getUserPermissionsContext } from "@/lib/auth/auth-service";
import { can } from "@/lib/auth/permissions";

interface PermissionGateProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const ctx = getUserPermissionsContext();

  // If no session (user not authenticated via Azure yet), allow all — prevents lockout during dev
  if (!ctx) return children;

  if (can(permission, ctx)) return children;

  return fallback;
}
