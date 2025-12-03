"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  email: string;
};

type AuthContextValue = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialisation côté client uniquement
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem("area-user");
    if (!raw) return null;

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  // Synchroniser le user vers localStorage quand il change
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      window.localStorage.setItem("area-user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("area-user");
    }
  }, [user]);

  function login(email: string) {
    setUser({ email });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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