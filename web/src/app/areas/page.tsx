"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { Area } from "@/types/area";
import { AreaCard } from "@/components/AreaCard";

const MOCK_AREAS: Area[] = [
  {
    id: "1",
    name: "Sync GitHub issues to Discord",
    description: "When a new issue is created on GitHub, send a message to Discord.",
    status: "active",
    triggerService: "GitHub",
    triggerAction: "New issue in repository",
    reactionService: "Discord",
    reactionAction: "Send message to channel",
    createdAt: new Date().toISOString(),
    triggerType: "webhook",
  },
  {
    id: "2",
    name: "Morning summary by email",
    description: "Every day at 8 AM, send me a summary email.",
    status: "paused",
    triggerService: "Scheduler",
    triggerAction: "Every day at 08:00",
    reactionService: "Gmail",
    reactionAction: "Send email",
    createdAt: new Date().toISOString(),
    triggerType: "polling",
  },
];

export default function AreasPage() {
  const { user, isReady } = useAuth();
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

  const areas: Area[] = MOCK_AREAS;

  return (
    <div
      style={{
        paddingTop: "6rem",
        paddingBottom: "3rem",
        maxWidth: 960,
        margin: "0 auto",
        color: "#e5e7eb",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 600,
              marginBottom: "0.3rem",
            }}
          >
            My AREAs
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
            Automations that connect your services together.
          </p>
        </div>

        <Link href="/areas/new">
          <button
            type="button"
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: 999,
              border: "none",
              background: "#2563eb",
              color: "#f9fafb",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            + New AREA
          </button>
        </Link>
      </header>

      {areas.length === 0 ? (
        <div
          style={{
            borderRadius: 18,
            border: "1px dashed rgba(148,163,184,0.5)",
            padding: "1.5rem",
            textAlign: "center",
            background: "rgba(15,23,42,0.8)",
          }}
        >
          <p style={{ marginBottom: "0.7rem" }}>
            You do not have any AREA yet.
          </p>
          <Link href="/areas/new">
            <button
              type="button"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 999,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Create your first AREA
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          {areas.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      )}
    </div>
  );
}
