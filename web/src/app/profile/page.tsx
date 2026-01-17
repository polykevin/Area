"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user, logout, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
  }, [isReady, user, router]);

  if (!isReady || !user) return null;

  const displayName =
    user.name || (user.email ? user.email.split("@")[0] : "User");
  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "6rem 3rem 3rem",
        backgroundColor: "#020617",
        color: "#e5e7eb",
      }}
    >
      {/* Header */}
      <header
        style={{
          maxWidth: 980,
          margin: "0 auto 1.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 260 }}>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: "0.45rem",
            }}
          >
            Account
          </p>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 650,
              margin: 0,
              marginBottom: "0.35rem",
              color: "#f9fafb",
            }}
          >
            Profile
          </h1>

          <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.95rem" }}>
            Manage your AREA identity and session.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Avatar */}
          <div
            aria-hidden="true"
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              display: "grid",
              placeItems: "center",
              color: "#0b1120",
              fontWeight: 700,
              boxShadow: "0 12px 30px rgba(37, 99, 235, 0.25)",
              border: "1px solid rgba(148,163,184,0.35)",
            }}
          >
            {initial}
          </div>

          <div style={{ lineHeight: 1.15 }}>
            <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>
              {displayName}
            </p>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/areas")}
            className="btn-hero-secondary"
            style={{
              padding: "0.45rem 0.8rem",
              borderRadius: 999,
              fontSize: "0.85rem",
            }}
            aria-label="Back to My AREAs"
          >
            Back
          </button>
        </div>
      </header>

      {/* Content grid */}
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
          gap: "1.25rem",
        }}
      >
        {/* Left card: Account */}
        <section
          aria-label="Account information"
          style={{
            background: "rgba(15,23,42,0.95)",
            borderRadius: 20,
            border: "1px solid rgba(148,163,184,0.35)",
            padding: "1.5rem 1.6rem",
            boxShadow:
              "0 18px 45px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
          }}
        >
          <div
            style={{
              marginBottom: "1.1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  margin: 0,
                  marginBottom: "0.25rem",
                  color: "#f9fafb",
                }}
              >
                Account information
              </h2>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#9ca3af" }}>
                Basic information about your AREA identity.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              rowGap: "1rem",
              borderTop: "1px solid rgba(148,163,184,0.2)",
              paddingTop: "1.1rem",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>
                Display name
              </p>
              <p style={{ margin: 0, marginTop: "0.25rem", fontWeight: 600 }}>
                {displayName}
              </p>
            </div>

            <div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>
                Email
              </p>
              <p style={{ margin: 0, marginTop: "0.25rem", fontWeight: 600 }}>
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Right card: Danger zone */}
        <section
          aria-label="Danger zone"
          style={{
            background: "rgba(15,23,42,0.95)",
            borderRadius: 20,
            border: "1px solid rgba(248,113,113,0.4)",
            padding: "1.5rem 1.6rem",
            boxShadow:
              "0 18px 45px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
            height: "fit-content",
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 650,
              margin: 0,
              marginBottom: "0.35rem",
              color: "#fecaca",
            }}
          >
            Danger zone
          </h2>

          <p style={{ margin: 0, fontSize: "0.85rem", color: "#fca5a5" }}>
            Session and account related actions.
          </p>

          <div
            style={{
              marginTop: "1.1rem",
              paddingTop: "1.1rem",
              borderTop: "1px solid rgba(248,113,113,0.25)",
              display: "grid",
              gap: "0.85rem",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#fecaca" }}>
                Logout
              </p>
              <p
                style={{
                  margin: 0,
                  marginTop: "0.25rem",
                  fontSize: "0.8rem",
                  color: "#fca5a5",
                }}
              >
                End your current session on this browser.
              </p>
            </div>

            <button
              type="button"
              className="btn-profile-logout"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Logout
            </button>

            <p style={{ margin: 0, fontSize: "0.78rem", color: "#fca5a5" }}>
              More controls will be added later (revoke tokens, delete account, ...).
            </p>
          </div>
        </section>
      </div>

      {/* Responsive tweak (simple, sans Tailwind) */}
      <style jsx>{`
        @media (max-width: 900px) {
          main {
            padding: 6rem 1.25rem 2.5rem !important;
          }
          div[style*="gridTemplateColumns: minmax(0, 2fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}