"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AreaWizard } from "@/components/AreaWizard";
import { apiFetch } from "@/lib/api";
import type { Area } from "@/types/area";

export default function NewAreaPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isReady, user, router]);

  async function handleCreate(area: Area) {
    try {
      const dto = {
        name: area.name,
        description: area.description,
        actionService: area.actionService,
        actionType: area.actionType,
        actionParams: area.actionParams,
        reactionService: area.reactionService,
        reactionType: area.reactionType,
        reactionParams: area.reactionParams,
        active: area.active
      };

      const res = await apiFetch("/areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        console.error(await res.text());
        alert("Failed to create AREA");
        return;
      }

      router.push("/areas");
    } catch (err) {
      console.error(err);
      alert("Network Error");
    }
  }

  if (!isReady || !user) {
    return null;
  }

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
      <header style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 600,
            marginBottom: "0.3rem",
          }}
        >
          Create a new AREA
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Define the action and the reaction that will be automated.
        </p>
      </header>

      <AreaWizard onCreate={handleCreate} />
    </div>
  );
}
