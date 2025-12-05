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

function readStoredAuth(): { user: User | null; token: string | null } {
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<{ user: User | null; token: string | null }>({
    user: null,
    token: null,
  });
  const { user, token } = authState;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = readStoredAuth();
    setAuthState(stored);
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
    setAuthState({ user: newUser, token: newToken });
  }

  function logout() {
    setAuthState({ user: null, token: null });
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
