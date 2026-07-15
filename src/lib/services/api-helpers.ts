import { getSessionToken } from "@/lib/auth/auth-service";

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
