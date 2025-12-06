import { ServiceCard } from "@/components/ServiceCard";

const MOCK_SERVICES = [
  {
    name: "GitHub",
    category: "Developer tools",
    description:
      "Triggers based on commits, pull requests, issues and releases in your repositories.",
    isConnected: true,
    logoSrc: "/services/github.png",
    actionsCount: 3,
    reactionsCount: 2,
  },
  {
    name: "Gmail",
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
  const connectedCount = MOCK_SERVICES.filter(
    (s) => s.isConnected
  ).length;

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
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Services
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#cbd5e1",
            marginBottom: "0.75rem",
          }}
        >
          Connect external services to AREA.
        </p>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#94a3b8",
          }}
        >
          <strong>{connectedCount}</strong> connected ·{" "}
          <strong>{MOCK_SERVICES.length}</strong> available
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
          <ServiceCard key={service.name} {...service} />
        ))}
      </div>
    </div>
  );
}
