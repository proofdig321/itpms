import "server-only";

import { cookies } from "next/headers";

/**
 * Returns standard headers for server-side API requests.
 * Reads Bearer token from Next.js request cookies.
 */
export async function getServerAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // cookies() may throw in certain edge runtime contexts
  }

  return headers;
}
