import { cookies } from "next/headers";

/**
 * Returns standard headers for server-side API requests.
 * Reads Bearer token from Next.js request cookies.
 * Only call this from server components / route handlers.
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
    // cookies() throws when called outside of a server context — safe to ignore
  }

  return headers;
}
