import type { User } from "@/types/user";

import { getServerAuthHeaders } from "./server-api-helpers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function getUsers(): Promise<User[]> {
  if (!API_BASE_URL) return [];
  try {
    const headers = await getServerAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const json = await response.json();
    const data = Array.isArray(json) ? json : (json.data ?? []);
    return data.map((u: Record<string, unknown>) => ({
      id: u.id as string,
      name: u.name as string,
      email: u.email as string,
    }));
  } catch {
    return [];
  }
}
