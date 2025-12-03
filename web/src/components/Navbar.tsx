"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        width: "100%",
        padding: "1rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#fff",
          textDecoration: "none",
        }}
      >
        ⚡ AREA
      </Link>

      {user ? (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.85rem",
              color: "#e5e7eb",
            }}
          >
            {user.email}
          </span>
          <button
            type="button"
            onClick={logout}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(15,23,42,0.8)",
              color: "#f9fafb",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            href="/login"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Sign in
          </Link>
          <Link href="/register">
            <button
              style={{
                padding: "0.45rem 0.95rem",
                borderRadius: 999,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
