"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AreaWizard } from "@/components/AreaWizard";
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

  function handleCreate(area: Area) {
    // TODO: send to backend later
    // now it's just log and redirect to /areas
    console.log("Created AREA (mock):", area);
    router.push("/areas");
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
