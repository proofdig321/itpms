export type Role = "ict-admin" | "ict-manager" | "project-manager" | "team-member";

export type Permission =
  | "projects.create"
  | "projects.view"
  | "projects.update"
  | "projects.delete"
  | "projects.start"
  | "projects.complete"
  | "projects.close"
  | "projects.archive"
  | "tasks.create"
  | "tasks.view"
  | "tasks.update"
  | "tasks.delete"
  | "tasks.reset"
  | "tasks.approve"
  | "tasks.update-progress"
  | "tasks.hold"
  | "tasks.resume"
  | "tasks.reject"
  | "tasks.cancel"
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
