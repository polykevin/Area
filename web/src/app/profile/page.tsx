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
    user.name || (user.email ? user.email.split("@")[0] : "User");

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "6rem 3rem 3rem",
        backgroundColor: "#020617",
        color: "#e5e7eb",
      }}
    >
      {/* Header global */}
      <header
        style={{
          maxWidth: 900,
          margin: "0 auto 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "0.3rem",
            }}
          >
            Account
          </p>
          <h1
            style={{
              fontSize: "1.9rem",
              fontWeight: 600,
              marginBottom: "0.3rem",
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
            Manage your AREA account and security.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          
        </div>
      </header>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.3fr)",
          gap: "1.5rem",
        }}
      >
        <section
          style={{
            background: "rgba(15,23,42,0.95)",
            borderRadius: 20,
            border: "1px solid rgba(148,163,184,0.35)",
            padding: "1.6rem 1.7rem",
            boxShadow:
              "0 18px 45px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
          }}
        >
          <div
            style={{
              marginBottom: "1.4rem",
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
                Basic information about your AREA identity.
              </p>
            </div>

            <button
              type="button"
              className="btn-profile-edit"
            >
              Edit (soon)
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr)",
              rowGap: "1.1rem",
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

        <section
          style={{
            background: "rgba(15,23,42,0.95)",
            borderRadius: 20,
            border: "1px solid rgba(248,113,113,0.4)",
            padding: "1.6rem 1.7rem",
            boxShadow:
              "0 18px 45px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              marginBottom: "0.25rem",
              color: "#fecaca",
            }}
          >
            Danger Zone
          </h2>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#fca5a5",
              marginBottom: "1.1rem",
            }}
          >
            Session and account related critical actions.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#fecaca",
                  marginBottom: "0.2rem",
                }}
              >
                Logout
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#fca5a5",
                  marginBottom: "0.55rem",
                }}
              >
                Ends your current session on this browser.
              </p>

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
            </div>

            <div
              style={{
                marginTop: "0.8rem",
                paddingTop: "0.7rem",
                borderTop: "1px solid rgba(248,113,113,0.3)",
              }}
            >
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "#fca5a5",
                }}
              >
                More account controls will be available later (delete account,
                revoke tokens, ...).
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
