"use client";

import type { ReactNode } from "react";

import { can, mockUserContext, type Permission } from "@/lib/auth/permissions";

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  // Uses mock context now. Will later consume from auth provider / Laravel session.
  if (!can(permission, mockUserContext)) {
    return fallback;
  }
  return children;
}
