"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { useEffect, useState } from "react";

type Service = {
  key: string; // provider key used by backend routes: /oauth/:provider/...
  name: string; // display name in UI
  category: string;
  description: string;
  logoSrc: string;
  actionsCount: number;
  reactionsCount: number;
};

const SERVICES: Service[] = [
  {
    key: "github",
    name: "GitHub",
    category: "Developer tools",
    description:
      "Triggers based on commits, pull requests, issues and releases in your repositories.",
    logoSrc: "/services/github.png",
    actionsCount: 3,
    reactionsCount: 2,
  },
  {
    key: "google",
    name: "Gmail",
    category: "Communication",
    description:
      "React to incoming emails, labels or threads to automate notifications and workflows.",
    logoSrc: "/services/gmail.png",
    actionsCount: 2,
    reactionsCount: 2,
  },
  {
    key: "discord",
    name: "Discord",
    category: "Chat & Community",
    description:
      "Send messages to channels or DMs when an Action is triggered on another service.",
    logoSrc: "/services/discord.png",
    actionsCount: 1,
    reactionsCount: 2,
  },
  {
    key: "drive",
    name: "Google Drive",
    category: "Storage",
    description:
      "Create files, move documents or update folders when an Action occurs somewhere else.",
    logoSrc: "/services/drive.png",
    actionsCount: 2,
    reactionsCount: 1,
  },
];

export default function ServicesPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [connectedServices, setConnectedServices] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  async function fetchMeAndServices(authToken: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        throw new Error(`auth/me failed (${res.status})`);
      }

      const user = await res.json();

      // Expecting something like: { id: 123, services: ['google', 'github', ...], ... }
      if (typeof user?.id === "number") setUserId(user.id);
      if (Array.isArray(user?.services)) setConnectedServices(user.services);

      // helpful debug
      console.log("me:", user);
    } catch (err) {
      console.error("Failed to fetch /auth/me:", err);
    } finally {
      setReady(true);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");

    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setReady(true);
      return;
    }

    fetchMeAndServices(savedToken);

    if (connected) {
      // remove ?connected=... after returning from oauth callback redirect
      window.history.replaceState({}, document.title, "/services");
    }
  }, []);

  const handleServiceConnect = (providerKey: string) => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      alert("You must be logged in first.");
      return;
    }

    if (!userId) {
      alert("User not loaded yet. Refresh and try again.");
      return;
    }

    // This matches your backend signature:
    // GET /oauth/:provider/url?userId=<id>
    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/oauth/${providerKey}/url?userId=${userId}`;
  };

  const connectedCount = connectedServices.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "6rem 3rem 3rem",
        backgroundColor: "#020617",
        color: "#e5e7eb",
      }}
    >
      <header
        style={{
          textAlign: "center",
          maxWidth: 640,
          marginInline: "auto",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Services
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#cbd5e1", marginBottom: "0.75rem" }}>
          Connect external services to AREA.
        </p>
        <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          <strong>{connectedCount}</strong> connected · <strong>{SERVICES.length}</strong> available
        </p>

        {!ready && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#94a3b8" }}>
            Loading…
          </p>
        )}
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          maxWidth: 960,
          marginInline: "auto",
        }}
      >
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.key}
            {...service}
            // IMPORTANT: compare against provider keys, not display names
            isConnected={connectedServices.includes(service.key)}
            onConnect={() => handleServiceConnect(service.key)}
          />
        ))}
      </div>
    </div>
  );
}
