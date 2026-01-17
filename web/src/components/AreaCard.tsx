"use client";

import type { Area } from "@/types/area";

type Props = { area: Area };

export function AreaCard({ area }: Props) {
  const isActive = area.active === true;

  const whenLabel = `${area.actionService} · ${area.actionType}`;
  const thenLabel = `${area.reactionService} · ${area.reactionType}`;

  return (
    <article
      style={{
        borderRadius: 16,
        border: "1px solid rgba(148,163,184,0.35)",
        padding: "1rem 1.2rem",
        background: "rgba(15,23,42,0.95)",
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
      }}
      aria-label={`AREA ${area.name}`}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#e5e7eb" }}>
          {area.name}
        </h3>

        <span
          style={{
            fontSize: "0.75rem",
            padding: "0.2rem 0.6rem",
            borderRadius: 999,
            border: isActive
              ? "1px solid rgba(52,211,153,0.5)"
              : "1px solid rgba(148,163,184,0.4)",
            color: isActive ? "#6ee7b7" : "#9ca3af",
            background: isActive ? "rgba(22,163,74,0.15)" : "rgba(30,64,175,0.15)",
            whiteSpace: "nowrap",
          }}
        >
          {isActive ? "Active" : "Paused"}
        </span>
      </header>

      {area.description ? (
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#9ca3af" }}>
          {area.description}
        </p>
      ) : null}

      <div style={{ marginTop: "0.35rem", fontSize: "0.85rem", color: "#cbd5f5", lineHeight: 1.35 }}>
        <div>
          <strong>When</strong> {whenLabel}
        </div>
        <div>
          <strong>Then</strong> {thenLabel}
        </div>
      </div>
    </article>
  );
}