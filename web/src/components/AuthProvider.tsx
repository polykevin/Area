"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  ReactNode,
} from "react";

type User = {
  id?: string | number;
  email: string;
  name?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loginFromApi: (user: User, token: string) => void;
  logout: () => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "area-auth";

type AuthSnapshot = { user: User | null; token: string | null; isReady: boolean };

const listeners = new Set<() => void>();
const SERVER_SNAPSHOT: AuthSnapshot = { user: null, token: null, isReady: false };
let authState: AuthSnapshot = SERVER_SNAPSHOT;

function parseStoredAuth(): { user: User | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { user: null, token: null };
  try {
    const parsed = JSON.parse(raw) as { user?: User; token?: string };
    if (parsed.user && typeof parsed.token === "string") {
      return { user: parsed.user, token: parsed.token };
    }
  } catch {
  }
  return { user: null, token: null };
}

function loadClientAuth() {
  const { user, token } = parseStoredAuth();
  authState = { user, token, isReady: true };
}

function getServerSnapshot(): AuthSnapshot {
  return SERVER_SNAPSHOT;
}

function getClientSnapshot(): AuthSnapshot {
  return authState;
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  if (typeof window !== "undefined") {
    if (!authState.isReady) {
      loadClientAuth();
      queueMicrotask(() => notifyListeners());
    }
    const handleStorage = () => {
      loadClientAuth();
      notifyListeners();
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", handleStorage);
    };
  }

  return () => listeners.delete(callback);
}

function notifyListeners() {
  listeners.forEach((cb) => cb());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, token, isReady } = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  function loginFromApi(newUser: User, newToken: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token: newToken }));
    }
    authState = { user: newUser, token: newToken, isReady: true };
    notifyListeners();
  }

  function logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    authState = { user: null, token: null, isReady: true };
    notifyListeners();
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loginFromApi, logout, isReady }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
