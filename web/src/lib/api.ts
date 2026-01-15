import { useAuth } from "@/components/AuthProvider";

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

async function safeErrorMessage(res: Response): Promise<string | null> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === "object" && "message" in data) {
      const { message } = data as { message?: unknown };
      if (typeof message === "string") return message;
      if (Array.isArray(message) && message.every((m) => typeof m === "string"))
        return message.join(", ");
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
    headers: {
      "Content-Type": "application/json",
    },
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await safeErrorMessage(res);
    throw new Error(errorText || "Registration failed");
  }

  return res.json();
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  let token: string | null = null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { token?: string };
      token = parsed.token || null;
    } catch {}
  }

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
}
