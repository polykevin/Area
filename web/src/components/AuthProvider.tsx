"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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

function readStoredAuth(): { user: User | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null };

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { user: null, token: null };

  try {
    const parsed = JSON.parse(raw) as { user?: User; token?: string };
    return {
      user: parsed.user ?? null,
      token: typeof parsed.token === "string" ? parsed.token : null,
    };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const { user, token } = readStoredAuth();
    setUser(user);
    setToken(token);
    setIsReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = readStoredAuth();
      setUser(next.user);
      setToken(next.token);
      setIsReady(true);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function loginFromApi(newUser: User, newToken: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: newUser, token: newToken }),
      );
    }
    setUser(newUser);
    setToken(newToken);
    setIsReady(true);
  }

  function logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setUser(null);
    setToken(null);
    setIsReady(true);
  }

  const value = useMemo(
    () => ({ user, token, loginFromApi, logout, isReady }),
    [user, token, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
