import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      {/* Tagline */}
      <p
        style={{
          fontSize: "0.8rem",
          background: "rgba(255,255,255,0.08)",
          padding: "0.25rem 0.7rem",
          borderRadius: "999px",
          display: "inline-block",
          marginBottom: "1.2rem",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        ⚡ Action-REACTION Platform
      </p>

      {/* Main Title */}
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 700,
          marginBottom: "0.8rem",
          color: "#f9fafb",
        }}
      >
        <span style={{ color: "#eceef2ff" }}>Connect Actions,</span>
        <span style={{ color: "#60a5fa" }}>Trigger REActions</span>
      </h1>

      {/* Description */}
      <p
        style={{
          maxWidth: "600px",
          margin: "0 auto 2rem",
          fontSize: "1rem",
          color: "#94a3b8",
          lineHeight: "1.6rem",
        }}
      >
        An automation platform inspired by IFTTT and Zapier. Connect services
        like GitHub, Gmail, Discord, and more. When an Action happens,
        automatically trigger a REAction.
      </p>

      {/* Team Section */}
      <p style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "#cbd5e1" }}>
        Meet the Team
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={avatarStyle}></div>
        <div style={avatarStyle}></div>
        <div style={avatarStyle}></div>
        <div style={avatarStyle}></div>
        <div style={avatarStyle}></div>
      </div>

      <p
        style={{
          color: "#1d4ed8",
          marginBottom: "2rem",
          fontSize: "1.2rem",
          fontWeight: 700,
        }}
      >
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Link href="/register">
          <button className="btn-primary" style={{ width: "150px" }}>
            Get Started Free
          </button>
        </Link>

        <Link href="/login">
          <button
            style={{
              width: "150px",
              borderRadius: 10,
              padding: "0.55rem",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.05)",
              color: "#f9fafb",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
}

const avatarStyle: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.12)",
};
