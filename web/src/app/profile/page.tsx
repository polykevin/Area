"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user, logout, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  if (!isReady || !user) {
    return null;
  }

  const displayName =
    user.name ||
    (user.email ? user.email.split("@")[0] : "User");

  return (
    <div
      style={{
        paddingTop: "6rem",
        paddingBottom: "4rem",
        maxWidth: 900,
        margin: "0 auto",
        color: "#e5e7eb",
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 600,
            marginBottom: "0.35rem",
          }}
        >
          Profile
        </h1>
        <p
          style={{
            color: "#9ca3af",
            fontSize: "0.95rem",
          }}
        >
          Manage your account settings.
        </p>
      </header>

      {/* Account information card */}
      <section
        style={{
          background: "rgba(15,23,42,0.95)",
          borderRadius: 20,
          border: "1px solid rgba(148,163,184,0.35)",
          padding: "1.4rem 1.6rem",
          marginBottom: "1.5rem",
          boxShadow:
            "0 18px 45px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
        }}
      >
        <div
          style={{
            marginBottom: "1.2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                marginBottom: "0.15rem",
              }}
            >
              Account Information
            </h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
              }}
            >
              Your personal account details.
            </p>
          </div>

          <button
            type="button"
            style={{
              padding: "0.4rem 0.9rem",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.5)",
              background: "transparent",
              color: "#e5e7eb",
              fontSize: "0.8rem",
              cursor: "not-allowed",
              opacity: 0.5,
            }}
          >
            Edit (soon)
          </button>
        </div>

        {/* Name + email */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            rowGap: "1rem",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginBottom: "0.25rem",
              }}
            >
              Name
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              {displayName}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginBottom: "0.25rem",
              }}
            >
              Email
            </p>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section
        style={{
          background: "rgba(15,23,42,0.95)",
          borderRadius: 20,
          border: "1px solid rgba(248,113,113,0.5)",
          padding: "1.4rem 1.6rem",
          boxShadow:
            "0 18px 45px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
        }}
      >
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            marginBottom: "0.2rem",
            color: "#fecaca",
          }}
        >
          Danger Zone
        </h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#fca5a5",
            marginBottom: "1rem",
          }}
        >
          Irreversible actions related to your account.
        </p>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          style={{
            padding: "0.55rem 1.1rem",
            borderRadius: 999,
            border: "none",
            background: "#ef4444",
            color: "#f9fafb",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </section>
    </div>
  );
}