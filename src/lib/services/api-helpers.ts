import { clearSession, getSessionToken } from "@/lib/auth/auth-service";

/**
 * Returns standard headers for API requests.
 * Includes Bearer token if available (client-side via document.cookie).
 * For server components, use getServerAuthHeaders() from server-api-helpers.ts.
 */
export function getAuthHeaders(contentType?: "json"): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  if (contentType === "json") {
    headers["Content-Type"] = "application/json";
  }

  const token = getSessionToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Checks response for 401 Unauthorized.
 * If detected, clears session and redirects to login.
 * Returns true if the response is a 401 (caller should abort).
 */
export function handleUnauthorized(response: Response): boolean {
  if (response.status === 401) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/auth/v2/login";
    }
    return true;
  }
  return false;
}
