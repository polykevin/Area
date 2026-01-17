"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiGetCatalog, CatalogService, apiFetch } from "@/lib/api";

type UiMeta = {
  category: string;
  description: string;
  logoSrc: string;
};

const UI_META: Record<string, UiMeta> = {
  google: {
    category: "Communication",
    description: "Gmail & Google services automation.",
    logoSrc: "/services/gmail.png",
  },
  github: {
    category: "Developer tools",
    description: "Automate issues, PRs, and repository events.",
    logoSrc: "/services/github.png",
  },
  gitlab: {
    category: "Developer tools",
    description: "Automate issues and merge requests on GitLab.",
    logoSrc: "/services/gitlab.png",
  },
  slack: {
    category: "Chat & Community",
    description: "Send messages to Slack when an action triggers.",
    logoSrc: "/services/slack.png",
  },
  discord: {
    category: "Chat & Community",
    description: "Send messages to Discord channels.",
    logoSrc: "/services/discord.png",
  },
  dropbox: {
    category: "Storage",
    description: "Automate file events and uploads in Dropbox.",
    logoSrc: "/services/dropbox.png",
  },
  trello: {
    category: "Project management",
    description: "Automate card creation and workflow tasks.",
    logoSrc: "/services/trello.png",
  },
  notion: {
    category: "Productivity",
    description: "Create pages and notes in Notion.",
    logoSrc: "/services/notion.png",
  },
  twitter: {
    category: "Social",
    description: "Automate tweets and mentions.",
    logoSrc: "/services/twitter.png",
  },
  instagram: {
    category: "Social",
    description: "Trigger automations on new Instagram media.",
    logoSrc: "/services/instagram.png",
  },
  weather: {
    category: "Utilities",
    description: "Trigger workflows on weather updates.",
    logoSrc: "/services/weather.png",
  },
  clock: {
    category: "Utilities",
    description: "Schedule workflows with time triggers.",
    logoSrc: "/services/clock.png",
  },
};

export default function ServicesPage() {
  const { user, token, isReady } = useAuth();

  const [catalog, setCatalog] = useState<CatalogService[]>([]);
  const [connectedServices, setConnectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) return;

    async function loadAll() {
      try {
        setLoading(true);

        const catalogRes = await apiGetCatalog();
        setCatalog(catalogRes.services ?? []);

        const meRes = await apiFetch("/auth/me", { method: "GET" });
        const meData: unknown = await meRes.json();

        if (meData && typeof meData === "object" && "services" in meData) {
          const services = (meData as { services?: string[] }).services ?? [];
          setConnectedServices(services);
        } else {
          if (meData && typeof meData === "object" && "serviceAuth" in meData) {
            const arr = (meData as any).serviceAuth as Array<{
              serviceName?: string;
              service?: string;
            }>;
            const isString = (v: unknown): v is string => typeof v === "string" && v.length > 0;

            const services = Array.isArray(arr)
              ? arr.map((s) => s.serviceName ?? s.service).filter(isString)
              : [];
            
            setConnectedServices(services);
          }
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get("connected")) {
          window.history.replaceState({}, "", "/services");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [isReady, token]);

  const servicesUi = useMemo(() => {
    return catalog.map((s) => {
      const meta = UI_META[s.id] ?? {
        category: "Other",
        description: "Service available in AREA.",
        logoSrc: "/services/default.png",
      };

      return {
        id: s.id,
        name: s.displayName || s.id,
        category: meta.category,
        description: meta.description,
        logoSrc: meta.logoSrc,
        actionsCount: Array.isArray(s.actions) ? s.actions.length : 0,
        reactionsCount: Array.isArray(s.reactions) ? s.reactions.length : 0,
      };
    });
  }, [catalog]);

  const connectedCount = connectedServices.length;

  const handleServiceConnect = (serviceId: string) => {
    if (!token || !user) {
      alert("You must be logged in first.");
      return;
    }

    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth/${serviceId}/url?userId=${user.id}`;
  };

  if (!isReady) return null;

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
          maxWidth: 680,
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
          <strong>{connectedCount}</strong> connected ·{" "}
          <strong>{servicesUi.length}</strong> available
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: "center", color: "#cbd5e1" }}>
          Loading services...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
            maxWidth: 960,
            marginInline: "auto",
          }}
        >
          {servicesUi.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              category={service.category}
              description={service.description}
              logoSrc={service.logoSrc}
              actionsCount={service.actionsCount}
              reactionsCount={service.reactionsCount}
              isConnected={connectedServices.includes(service.id)}
              onConnect={() => handleServiceConnect(service.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}