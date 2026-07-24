import "server-only";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
  meta?: Record<string, unknown>;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        success: false,
        error: { code: "NETWORK_ERROR", message: `Request failed with status ${response.status}` },
      }));
      throw new Error(error.error.message);
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: JSON.stringify(body) });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request<void>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(BASE_URL);
