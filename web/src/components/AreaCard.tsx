type AreaCardProps = {
  name: string;
  description: string;
  trigger: string;
  reaction: string;
  enabled: boolean;
};

export function AreaCard({
  name,
  description,
  trigger,
  reaction,
  enabled,
}: AreaCardProps) {
  return (
    <article
      style={{
        borderRadius: 18,
        border: "1px solid rgba(148,163,184,0.35)",
        padding: "1rem 1.25rem",
        background: "rgba(15,23,42,0.95)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 600,
            color: "#f9fafb",
          }}
        >
          {name}
        </h3>

        <span
          style={{
            fontSize: "0.75rem",
            padding: "0.2rem 0.7rem",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.5)",
            color: enabled ? "#4ade80" : "#e5e7eb",
            background: enabled ? "rgba(22,163,74,0.15)" : "rgba(15,23,42,1)",
            whiteSpace: "nowrap",
          }}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </header>

      <p
        style={{
          margin: 0,
          fontSize: "0.85rem",
          color: "#cbd5e1",
        }}
      >
        {description}
      </p>

      <div
        style={{
          marginTop: "0.4rem",
          fontSize: "0.85rem",
          color: "#e5e7eb",
        }}
      >
        <p style={{ margin: 0 }}>
          <span style={{ color: "#60a5fa", fontWeight: 500 }}>When</span>{" "}
          {trigger}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ color: "#22c55e", fontWeight: 500 }}>Then</span>{" "}
          {reaction}
        </p>
      </div>

      <div
        style={{
          marginTop: "0.7rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
          fontSize: "0.8rem",
        }}
      >
        <button
          type="button"
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "transparent",
            color: "#f9fafb",
            cursor: "pointer",
          }}
        >
          Edit
        </button>

        <button
          type="button"
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: 999,
            border: "none",
            background: enabled ? "#ef4444" : "#22c55e",
            color: "#f9fafb",
            cursor: "pointer",
          }}
        >
          {enabled ? "Disable" : "Enable"}
        </button>
      </div>
    </article>
  );
}