import Image from "next/image";

type ServiceCardProps = {
  name: string;
  description: string;
  category: string;
  isConnected: boolean;
  logoSrc: string;
  actionsCount?: number;
  reactionsCount?: number;
  onConnect?: () => void;
};

export function ServiceCard({
  name,
  description,
  category,
  isConnected,
  logoSrc,
  actionsCount,
  reactionsCount,
  onConnect,
}: ServiceCardProps) {
  return (
    <article
      style={{
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.35)",
        padding: "1rem 1.25rem",
        background: "rgba(15,23,42,0.95)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Badge logo */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(148,163,184,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 6,
            }}
          >
            <Image
              src={logoSrc}
              alt={`${name} logo`}
              width={32}
              height={32}
              style={{
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </div>

          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#f9fafb" }}>
              {name}
            </h3>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#9ca3af" }}>
              {category}
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: "0.75rem",
            padding: "0.2rem 0.7rem",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.5)",
            color: isConnected ? "#4ade80" : "#e5e7eb",
            background: isConnected ? "rgba(22,163,74,0.15)" : "rgba(15,23,42,1)",
            whiteSpace: "nowrap",
          }}
        >
          {isConnected ? "Connected" : "Not connected"}
        </span>
      </header>

      <p style={{ margin: 0, fontSize: "0.85rem", color: "#cbd5e1" }}>{description}</p>

      {(actionsCount !== undefined || reactionsCount !== undefined) && (
        <p style={{ margin: 0, fontSize: "0.78rem", color: "#94a3b8" }}>
          {actionsCount ?? 0} Actions · {reactionsCount ?? 0} REActions
        </p>
      )}

      <div style={{ marginTop: "0.6rem" }}>
        <button
          type="button"
          onClick={onConnect}
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: 999,
            border: isConnected ? "1px solid rgba(148,163,184,0.6)" : "none",
            background: isConnected ? "transparent" : "#2563eb",
            color: "#f9fafb",
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          {isConnected ? "Manage" : "Connect"}
        </button>
      </div>
    </article>
  );
}