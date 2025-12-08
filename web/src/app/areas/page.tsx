"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { Area } from "@/types/area";
import { AreaCard } from "@/components/AreaCard";
import { apiFetch } from "@/lib/api";
import { v4 as uuidv4 } from "uuid";

export default function AreasPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const [areas, setAreas] = useState<Area[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

    useEffect(() => {
    if (!user) return;

    async function loadAreas() {
      try {
        const res = await apiFetch("/areas", {
          method: "GET",
        });

        if (!res.ok) {
          console.error("Failed to fetch areas:", await res.text());
          setAreas([]);
          return;
        }

        const data = await res.json();
        setAreas(data);
      } catch (err) {
        console.error("Network error:", err);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    }

    loadAreas();
  }, [user]);

  if (!isReady || !user) {
    return null;
  }

   if (loading) {
    return (
      <div style={{ paddingTop: "6rem", textAlign: "center", color: "#e5e7eb" }}>
        Loading your AREAs...
      </div>
    );
  }

  const noAreas = !areas || areas.length === 0;

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

      {noAreas ? (
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
            <AreaCard key={uuidv4()} area={area} />
          ))}
        </div>
      )}
    </div>
  );
}
