"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { user: User; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    if (user && token) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token, isReady]);

  function loginFromApi(newUser: User, newToken: string) {
    setUser(newUser);
    setToken(newToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
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