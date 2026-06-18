export type Role = "ict-admin" | "ict-manager" | "project-manager" | "viewer";

export type Permission =
  | "projects.create"
  | "projects.edit"
  | "projects.delete"
  | "planning.view"
  | "planning.edit"
  | "monitoring.view"
  | "wbs.view"
  | "wbs.edit";

export interface UserPermissionsContext {
  role: Role;
  permissions: Permission[];
}

export function can(permission: Permission, user: UserPermissionsContext): boolean {
  return user.permissions.includes(permission);
}

export const roleDefaults: Record<Role, Permission[]> = {
  "ict-admin": [
    "projects.create",
    "projects.edit",
    "projects.delete",
    "planning.view",
    "planning.edit",
    "monitoring.view",
    "wbs.view",
    "wbs.edit",
  ],
  "ict-manager": ["projects.create", "projects.edit", "planning.view", "monitoring.view", "wbs.view"],
  "project-manager": ["projects.create", "planning.view", "monitoring.view", "wbs.view"],
  viewer: ["monitoring.view", "wbs.view"],
};

export const mockUserContext: UserPermissionsContext = {
  role: "ict-admin",
  permissions: roleDefaults["ict-admin"],
};
