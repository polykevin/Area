"use client";
import { ServiceCard } from "@/components/ServiceCard";
import { useEffect, useState } from "react";

const MOCK_SERVICES = [
  {
    name: "GitHub",
    category: "Developer tools",
    description:
      "Triggers based on commits, pull requests, issues and releases in your repositories.",
    isConnected: false,
    logoSrc: "/services/github.png",
    actionsCount: 3,
    reactionsCount: 2,
  },
  {
    name: "google",
    category: "Communication",
    description:
      "React to incoming emails, labels or threads to automate notifications and workflows.",
    isConnected: false,
    logoSrc: "/services/gmail.png",
    actionsCount: 2,
    reactionsCount: 2,
  },
  {
    name: "Discord",
    category: "Chat & Community",
    description:
      "Send messages to channels or DMs when an Action is triggered on another service.",
    isConnected: false,
    logoSrc: "/services/discord.png",
    actionsCount: 1,
    reactionsCount: 2,
  },
  {
    name: "Google Drive",
    category: "Storage",
    description:
      "Create files, move documents or update folders when an Action occurs somewhere else.",
    isConnected: false,
    logoSrc: "/services/drive.png",
    actionsCount: 2,
    reactionsCount: 1,
  },
];

export default function ServicesPage() {
  const [connectedServices, setConnectedServices] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const savedToken = localStorage.getItem("token");

    if (!savedToken) return;

    const fetchServices = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        const user = await res.json();
        if (user?.services) {setConnectedServices(user.services);console.log(user.services)};
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();

    if (connected) {
      window.history.replaceState({}, document.title, "/services");
    }
  }, []);

  const handleServiceConnect = (serviceName: string) => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      alert("You must be logged in first.");
      return;
    }

    const payload = JSON.parse(atob(savedToken.split('.')[1]));
    const userId = payload.sub;

    window.location.assign(
      `${process.env.NEXT_PUBLIC_API_URL}/oauth/${serviceName}/url?userId=${userId}`
    );
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
          <strong>{connectedCount}</strong> connected · <strong>{MOCK_SERVICES.length}</strong> available
        </p>
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
        {MOCK_SERVICES.map((service) => (
          <ServiceCard
            key={service.name}
            {...service}
            isConnected={connectedServices.includes(service.name)}
            onConnect={() => handleServiceConnect(service.name)}
          />
        ))}
      </div>
    </div>
  );
}
