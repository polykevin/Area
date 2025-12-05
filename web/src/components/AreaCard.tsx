"use client";

import type { Area } from "@/types/area";

type Props = {
  area: Area;
};

export function AreaCard({ area }: Props) {
  const isActive = area.status === "active";

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(148,163,184,0.35)",
        padding: "1rem 1.2rem",
        background: "rgba(15,23,42,0.95)",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "#e5e7eb",
          }}
        >
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
            background: isActive
              ? "rgba(22,163,74,0.15)"
              : "rgba(30,64,175,0.15)",
          }}
        >
          {isActive ? "Active" : "Paused"}
        </span>
      </div>

      {area.description && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "#9ca3af",
            marginTop: "0.15rem",
          }}
        >
          {area.description}
        </p>
      )}

      <p
        style={{
          fontSize: "0.8rem",
          color: "#cbd5f5",
          marginTop: "0.25rem",
        }}
      >
        <strong>When</strong> {area.triggerService} / {area.triggerAction}
        <br />
        <strong>Then</strong> {area.reactionService} / {area.reactionAction}
      </p>

      <p
        style={{
          fontSize: "0.75rem",
          color: "#64748b",
          marginTop: "0.35rem",
        }}
      >
        Created on{" "}
        {new Date(area.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
}