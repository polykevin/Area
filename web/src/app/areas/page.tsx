"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { AreaCard } from "@/components/AreaCard";

const MOCK_AREAS = [
  {
    name: "GitHub → Discord alerts",
    description:
      "Notify a Discord channel whenever a new commit is pushed on the main branch.",
    trigger: "a new commit is pushed on GitHub (main branch)",
    reaction: "send a message to a specific Discord channel",
    enabled: true,
  },
  {
    name: "New Gmail label → Drive backup",
    description:
      "When an email is labeled 'Invoices', automatically save its attachments to Google Drive.",
    trigger: "an email receives the label 'Invoices' in Gmail",
    reaction: "upload all attachments to a Drive folder",
    enabled: false,
  },
  {
    name: "GitHub issue → Gmail notification",
    description:
      "Alert via Gmail when a new issue is created on a monitored repository.",
    trigger: "a new issue is opened on a GitHub repository",
    reaction: "send a summary email to your inbox",
    enabled: true,
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
  }, [user, isReady, router]);

  if (!isReady || !user) {
    return null;
  }

  const enabledCount = MOCK_AREAS.filter((a) => a.enabled).length;

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
          textAlign: "center",
          maxWidth: 720,
          marginInline: "auto",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          My AREA
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#cbd5e1",
            marginBottom: "0.75rem",
          }}
        >
          An AREA links one <strong>Action</strong> to one{" "}
          <strong>REAction</strong>.
        </p>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#94a3b8",
            marginBottom: "1.2rem",
          }}
        >
          <strong>{enabledCount}</strong> enabled ·{" "}
          <strong>{MOCK_AREAS.length}</strong> total
        </p>

        <div style={{ marginTop: "0.3rem" }}>
          <Link href="/areas/new">
            <button
              type="button"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 999,
                border: "none",
                background: "#2563eb",
                color: "#f9fafb",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              + Create a new AREA
            </button>
          </Link>
        </div>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          maxWidth: 960,
          marginInline: "auto",
        }}
      >
        {MOCK_AREAS.map((area) => (
          <AreaCard key={area.name} {...area} />
        ))}
      </section>
    </main>
  );
}
