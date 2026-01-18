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

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getTokenFromStorage();

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${API_BASE_URL}${path}`;
  console.log("[apiFetch]", options.method ?? "GET", url);

  const res = await fetch(url, { ...options, headers });

  const ct = res.headers.get("content-type") ?? "";
  console.log("[apiFetch]", res.status, url, "content-type:", ct);

  return res;
}

// api.ts (only the relevant part)

export type CatalogService = {
  id: string;
  displayName?: string;
  color?: string;
  iconKey?: string;
  actions?: any[];
  reactions?: any[];
};

export type CatalogResponse = { services: CatalogService[] };

// web/src/lib/api.ts

export type Catalog = {
  services: {
    id: string;
    displayName: string;
    actions: { id: string; name: string }[];
    reactions: { id: string; name: string }[];
  }[];
};

function normalizeCatalog(data: any): Catalog {
  const servicesRaw = Array.isArray(data)
    ? data
    : Array.isArray(data?.services)
      ? data.services
      : [];

  return {
    services: servicesRaw
      .filter((s: any) => s?.id)
      .map((s: any) => ({
        id: String(s.id),
        displayName: String(s?.displayName ?? s?.name ?? s?.id ?? "Service"),

        actions: Array.isArray(s?.actions)
          ? s.actions
              .filter((a: any) => a?.id)
              .map((a: any) => ({
                id: String(a.id),
                name: String(a?.displayName ?? a?.name ?? a?.id ?? ""),
              }))
          : [],

        reactions: Array.isArray(s?.reactions)
          ? s.reactions
              .filter((r: any) => r?.id)
              .map((r: any) => ({
                id: String(r.id),
                name: String(r?.displayName ?? r?.name ?? r?.id ?? ""),
              }))
          : [],
      })),
  };
}


export async function apiGetCatalog(): Promise<Catalog> {
  let res = await apiFetch("/services/catalog", { method: "GET" });

  if (!res.ok) {
    res = await apiFetch("/services", { method: "GET" });
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to load services catalog");
  }

  const data = await res.json();
  return normalizeCatalog(data);
}

