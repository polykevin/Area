import Link from "next/link";
import type { CSSProperties } from "react";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 1.5rem",
  color: "#f9fafb",
  background: "transparent",
};

const heroCardStyle: CSSProperties = {
  maxWidth: 760,
  textAlign: "center",
  padding: "3rem 2.5rem",
  borderRadius: 32,
  border: "1px solid rgba(148,163,184,0.35)",
  background:
    "radial-gradient(circle at top, rgba(148,163,184,0.18), transparent 60%) rgba(15,23,42,0.88)",
  boxShadow:
    "0 30px 80px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,1)",
};

const avatarStyle: CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "999px",
  background: "conic-gradient(from 160deg, #22c55e)",
  opacity: 0.75,
};

export default function HomePage() {
  return (
    <main style={pageStyle}>
      <section style={heroCardStyle}>
        <p
          style={{
            fontSize: "0.8rem",
            background: "rgba(15,23,42,0.9)",
            padding: "0.25rem 0.7rem",
            borderRadius: "999px",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "1.2rem",
            border: "1px solid rgba(148,163,184,0.6)",
          }}
        >
          <span>⚡</span>
          <span>Action–REACTION Automation Platform</span>
        </p>

        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            marginBottom: "0.8rem",
          }}
        >
          <span>Connect Actions, </span>
          <span style={{ color: "#60a5fa" }}>Trigger REActions</span>
        </h1>

        <p
          style={{
            maxWidth: 600,
            margin: "0 auto 1.8rem",
            fontSize: "1rem",
            color: "#94a3b8",
            lineHeight: "1.6rem",
          }}
        >
          An automation platform inspired by IFTTT and Zapier. Connect services
          like GitHub, Gmail, Discord, and more. When an Action happens,
          automatically trigger a REAction.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "1.8rem",
            fontSize: "0.85rem",
          }}
        >
          <div
            style={{
              padding: "0.35rem 0.9rem",
              borderRadius: 999,
              background: "rgba(37,99,235,0.18)",
              border: "1px solid rgba(59,130,246,0.7)",
            }}
          >
            Action
          </div>
          <span style={{ fontSize: "1.2rem" }}>➜</span>
          <div
            style={{
              padding: "0.35rem 0.9rem",
              borderRadius: 999,
              background: "rgba(56,189,248,0.15)",
              border: "1px solid rgba(56,189,248,0.7)",
            }}
          >
            REAction
          </div>
        </div>

        <p
          style={{
            fontSize: "0.85rem",
            color: "#9ca3af",
            marginBottom: "2rem",
          }}
        >
          Example: “When a GitHub issue is created, send a message to Discord.”
        </p>

        <p
          style={{
            fontSize: "0.9rem",
            marginBottom: "0.7rem",
            color: "#cbd5e1",
          }}
        >
          Built by a passionate AREA team
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Link href="/register">
            <button
              className="btn-hero-primary"
              style={{ width: 160 }}
            >
              Get Started Free
            </button>
          </Link>

          <Link href="/login">
            <button
              className="btn-hero-secondary"
              style={{ width: 150 }}
            >
              Sign in
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}