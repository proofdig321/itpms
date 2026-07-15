import type { UserPermissionsContext } from "./permissions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function exchangeAzureToken(azureAccessToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/azure-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ access_token: azureAccessToken }),
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  const json = await response.json();

  // Handle both { data: { token, user } } and { token, user } formats
  const payload = json.data ?? json;

  if (!payload.token) {
    throw new Error("Invalid response from server");
  }

  return payload as AuthResponse;
}

export function setSession(token: string, user: AuthUser): void {
  if (typeof document === "undefined") return;
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
  document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
}

export function clearSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; path=/; max-age=0";
  document.cookie = "auth_user=; path=/; max-age=0";
}

export function getSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : null;
}

export function getSessionUser(): AuthUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/auth_user=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function getUserPermissionsContext(): UserPermissionsContext | null {
  const user = getSessionUser();
  if (!user?.roles?.length || !user.permissions?.length) return null;
  return {
    roles: user.roles,
    permissions: user.permissions as UserPermissionsContext["permissions"],
  };
}
