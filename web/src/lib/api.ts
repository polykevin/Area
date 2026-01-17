// src/lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type AuthResponse = {
  access_token: string;
  user: {
    id: string | number;
    email: string;
  };
};

const STORAGE_KEY = "area-auth";

type ApiErrorPayload = {
  message?: string | string[];
};

async function safeErrorMessage(res: Response): Promise<string | null> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "message" in data) {
      const { message } = data as ApiErrorPayload;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.join(", ");
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await safeErrorMessage(res);
    throw new Error(errorText || "Login failed");
  }

  return res.json();
}

export async function apiRegister(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await safeErrorMessage(res);
    throw new Error(errorText || "Registration failed");
  }

  return res.json();
}

function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getTokenFromStorage();

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}

export type CatalogService = {
  id: string;
  displayName: string;
  actions: { id?: string; name?: string }[];
  reactions: { id?: string; name?: string }[];
};

export async function apiGetCatalog(): Promise<{ services: CatalogService[] }> {
  const res = await apiFetch("/services/catalog", { method: "GET" });

  if (!res.ok) {
    const errorText = await safeErrorMessage(res);
    throw new Error(errorText || "Failed to load service catalog");
  }

  return res.json();
}