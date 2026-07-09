export type Role = "ict-admin" | "ict-manager" | "project-manager" | "team-member";

export type Permission =
  | "projects.create"
  | "projects.view"
  | "projects.update"
  | "projects.delete"
  | "tasks.create"
  | "tasks.view"
  | "tasks.update"
  | "tasks.delete"
  | "wbs.create"
  | "wbs.view"
  | "wbs.update"
  | "wbs.delete"
  | "users.create"
  | "users.view"
  | "users.update"
  | "users.delete";

export interface UserPermissionsContext {
  roles: string[];
  permissions: string[];
}

export function can(permission: string, user: UserPermissionsContext): boolean {
  return user.permissions.includes(permission);
}

export function hasRole(role: string, user: UserPermissionsContext): boolean {
  return user.roles.includes(role);
}

export const roleDefaults: Record<Role, Permission[]> = {
  "ict-admin": [
    "projects.create",
    "projects.view",
    "projects.update",
    "projects.delete",
    "tasks.create",
    "tasks.view",
    "tasks.update",
    "tasks.delete",
    "wbs.create",
    "wbs.view",
    "wbs.update",
    "wbs.delete",
    "users.create",
    "users.view",
    "users.update",
    "users.delete",
  ],
  "ict-manager": [
    "projects.create",
    "projects.view",
    "projects.update",
    "tasks.create",
    "tasks.view",
    "tasks.update",
    "wbs.create",
    "wbs.view",
    "wbs.update",
    "users.view",
  ],
  "project-manager": [
    "projects.create",
    "projects.view",
    "projects.update",
    "tasks.create",
    "tasks.view",
    "tasks.update",
    "tasks.delete",
    "wbs.create",
    "wbs.view",
    "wbs.update",
    "wbs.delete",
  ],
  "team-member": ["projects.view", "tasks.view", "tasks.update", "wbs.view"],
};
