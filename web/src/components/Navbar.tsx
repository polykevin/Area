"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export function Navbar() {
  const { user, isReady } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isReady) {
    return null;
  }

  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "");
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

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
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          <Link
            href="/services"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            Services
          </Link>

          <Link
            href="/areas"
            style={{
              color: "#e5e7eb",
              textDecoration: "none",
              fontSize: "0.9rem",
            }}
          >
            My AREA
          </Link>

          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.3rem 0.6rem",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.4)",
                background: "rgba(15,23,42,0.9)",
                cursor: "pointer",
              }}
            >
              {/* Avatar rond */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "999px",
                  background: "linear-gradient(135deg,#3d3ea3ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#0b1120",
                }}
              >
                {initial}
              </div>

              {/* Nom */}
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#e5e7eb",
                  maxWidth: 120,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textAlign: "left",
                }}
              >
                {displayName}
              </span>
            </button>

            {isMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: 8,
                  minWidth: 220,
                  background: "#020617",
                  borderRadius: 16,
                  border: "1px solid rgba(148,163,184,0.35)",
                  boxShadow:
                    "0 18px 45px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,1)",
                  padding: "0.75rem 0.9rem",
                }}
              >
                <div
                  style={{
                    marginBottom: "0.7rem",
                    paddingBottom: "0.7rem",
                    borderBottom: "1px solid rgba(148,163,184,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.15rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#9ca3af",
                    }}
                  >
                    Signed in as
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "#e5e7eb",
                      fontWeight: 500,
                    }}
                  >
                    {user.email}
                  </span>
                </div>

                <Link
                  href="/profile"
                  style={{
                    display: "block",
                    padding: "0.45rem 0.25rem",
                    fontSize: "0.9rem",
                    color: "#e5e7eb",
                    textDecoration: "none",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/login" className="btn-nav-secondary">
            Sign in
          </Link>
          <Link href="/register">
            <button type="button" className="btn-nav-primary">
              Get Started
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}