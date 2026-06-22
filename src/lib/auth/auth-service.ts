import type { UserPermissionsContext } from "./permissions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
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
  if (typeof window !== "undefined" && "cookieStore" in window) {
    (window as unknown as { cookieStore: { set: (opts: Record<string, unknown>) => void } }).cookieStore.set({
      name: "auth_token",
      value: token,
      path: "/",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
    });
    (window as unknown as { cookieStore: { set: (opts: Record<string, unknown>) => void } }).cookieStore.set({
      name: "auth_user",
      value: encodeURIComponent(JSON.stringify(user)),
      path: "/",
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
    });
  }
}

export function clearSession(): void {
  if (typeof window !== "undefined" && "cookieStore" in window) {
    (window as unknown as { cookieStore: { delete: (name: string) => void } }).cookieStore.delete("auth_token");
    (window as unknown as { cookieStore: { delete: (name: string) => void } }).cookieStore.delete("auth_user");
  }
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
  if (!user || !user.role || !user.permissions) return null;
  return {
    role: user.role as UserPermissionsContext["role"],
    permissions: user.permissions as UserPermissionsContext["permissions"],
  };
}
