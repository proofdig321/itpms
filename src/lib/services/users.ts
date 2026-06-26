import type { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

// Mock fallback when API is unavailable
const mockUsers: User[] = [
  { id: "mock-1", name: "Thabo Mokoena", email: "thabo@municipality.gov.za" },
  { id: "mock-2", name: "Naledi Dlamini", email: "naledi@municipality.gov.za" },
  { id: "mock-3", name: "Sipho Nkosi", email: "sipho@municipality.gov.za" },
];

export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { Accept: "application/json", "ngrok-skip-browser-warning": "true" },
      next: { revalidate: 60 },
    });

    if (!response.ok) return mockUsers;

    const json = await response.json();
    const data = Array.isArray(json) ? json : (json.data ?? []);

    return data.map((u: Record<string, unknown>) => ({
      id: u.id as string,
      name: u.name as string,
      email: u.email as string,
    }));
  } catch {
    return mockUsers;
  }
}
