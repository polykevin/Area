"use client";

import { useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string;
};

type Action = {
  id: string;
  label: string;
  serviceId: string;
};

type Reaction = {
  id: string;
  label: string;
  serviceId: string;
};

const SERVICES: Service[] = [
  {
    id: "github",
    name: "GitHub",
    description: "React to repository events: commits, PRs, issues, releases.",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Use incoming emails, labels or threads as triggers.",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send messages to channels or users when something happens.",
  },
];

const ACTIONS: Action[] = [
  { id: "github_push", label: "New commit pushed on main", serviceId: "github" },
  { id: "github_issue", label: "New issue created", serviceId: "github" },
  { id: "gmail_label", label: "Email gets a specific label", serviceId: "gmail" },
  { id: "gmail_from", label: "Email from a specific sender", serviceId: "gmail" },
  { id: "discord_message", label: "Message posted in a channel", serviceId: "discord" },
];

const REACTIONS: Reaction[] = [
  { id: "discord_notify", label: "Send a message on Discord", serviceId: "discord" },
  { id: "gmail_send", label: "Send an email", serviceId: "gmail" },
  { id: "drive_upload", label: "Upload a file to Google Drive", serviceId: "github" }, // exemple
];

type Step = 1 | 2 | 3 | 4;

export function AreaWizard() {
  const [step, setStep] = useState<Step>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  const canGoNext =
    (step === 1 && selectedService) ||
    (step === 2 && selectedAction) ||
    (step === 3 && selectedReaction) ||
    step === 4;

  function goNext() {
    if (!canGoNext) return;
    setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
  }

  function goBack() {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  function handleSubmit() {
    console.log("AREA created (simulated):", {
      name,
      note,
      service: selectedService,
      action: selectedAction,
      reaction: selectedReaction,
    });
    alert("AREA creation is simulated. Later this will call the backend.");
  }

  return (
    <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
      <WizardHeader step={step} />

      <div style={{ marginTop: "1.5rem" }}>
        {step === 1 && (
          <StepService
            selectedService={selectedService}
            setSelectedService={(svc) => {
              setSelectedService(svc);
              setSelectedAction(null);
              setSelectedReaction(null);
            }}
          />
        )}

        {step === 2 && selectedService && (
          <StepAction
            selectedService={selectedService}
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
          />
        )}

        {step === 3 && (
          <StepReaction
            selectedReaction={selectedReaction}
            setSelectedReaction={setSelectedReaction}
          />
        )}

        {step === 4 && (
          <StepSummary
            name={name}
            setName={setName}
            note={note}
            setNote={setNote}
            selectedService={selectedService}
            selectedAction={selectedAction}
            selectedReaction={selectedReaction}
          />
        )}
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          style={{
            padding: "0.4rem 0.9rem",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.4)",
            background: "transparent",
            color: "#e5e7eb",
            fontSize: "0.85rem",
            cursor: step === 1 ? "default" : "pointer",
            opacity: step === 1 ? 0.4 : 1,
          }}
        >
          Back
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: 999,
              border: "none",
              background: canGoNext ? "#2563eb" : "#1f2937",
              color: "#f9fafb",
              fontSize: "0.9rem",
              cursor: canGoNext ? "pointer" : "default",
            }}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: "0.45rem 1.1rem",
              borderRadius: 999,
              border: "none",
              background: "#22c55e",
              color: "#0b1120",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Create AREA
          </button>
        )}
      </div>
    </div>
  );
}

function WizardHeader({ step }: { step: Step }) {
  const steps = [
    { id: 1, label: "Service" },
    { id: 2, label: "Action" },
    { id: 3, label: "REAction" },
    { id: 4, label: "Summary" },
  ];

  return (
    <div>
      <h1 className="card-title" style={{ textAlign: "left", marginBottom: "0.5rem" }}>
        Create a new AREA
      </h1>
      <p
        style={{
          margin: 0,
          fontSize: "0.9rem",
          color: "#cbd5e1",
        }}
      >
        An AREA links one <strong>Action</strong> to one{" "}
        <strong>REAction</strong>. Use this wizard to configure the flow.
      </p>

      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        {steps.map((s) => {
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <div
              key={s.id}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: isActive || isDone ? 1 : 0.5,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  background: isActive
                    ? "#2563eb"
                    : isDone
                    ? "#22c55e"
                    : "transparent",
                  border: isActive || isDone ? "none" : "1px solid #4b5563",
                  color: isActive || isDone ? "#f9fafb" : "#9ca3af",
                }}
              >
                {isDone ? "✓" : s.id}
              </div>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: isActive ? "#e5e7eb" : "#9ca3af",
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepService({
  selectedService,
  setSelectedService,
}: {
  selectedService: Service | null;
  setSelectedService: (svc: Service) => void;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#e5e7eb",
          marginBottom: "0.75rem",
        }}
      >
        Choose the service that will trigger the Action.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {SERVICES.map((svc) => {
          const isActive = selectedService?.id === svc.id;
          return (
            <button
              key={svc.id}
              type="button"
              onClick={() => setSelectedService(svc)}
              style={{
                textAlign: "left",
                padding: "0.75rem 0.9rem",
                borderRadius: 12,
                border: isActive
                  ? "1px solid #2563eb"
                  : "1px solid rgba(148,163,184,0.5)",
                background: isActive ? "rgba(37,99,235,0.15)" : "transparent",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontWeight: 500,
                  marginBottom: "0.3rem",
                  color: "#f9fafb",
                }}
              >
                {svc.name}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                }}
              >
                {svc.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepAction({
  selectedService,
  selectedAction,
  setSelectedAction,
}: {
  selectedService: Service;
  selectedAction: Action | null;
  setSelectedAction: (a: Action) => void;
}) {
  const actionsForService = ACTIONS.filter(
    (a) => a.serviceId === selectedService.id
  );

  return (
    <div>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#e5e7eb",
          marginBottom: "0.75rem",
        }}
      >
        Choose the <strong>Action</strong> on{" "}
        <span style={{ color: "#60a5fa" }}>{selectedService.name}</span> that
        will start this AREA.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {actionsForService.map((action) => {
          const isActive = selectedAction?.id === action.id;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => setSelectedAction(action)}
              style={{
                textAlign: "left",
                padding: "0.6rem 0.8rem",
                borderRadius: 10,
                border: isActive
                  ? "1px solid #2563eb"
                  : "1px solid rgba(148,163,184,0.5)",
                background: isActive ? "rgba(37,99,235,0.12)" : "transparent",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#e5e7eb",
              }}
            >
              {action.label}
            </button>
          );
        })}

        {actionsForService.length === 0 && (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            No predefined actions for this service yet.
          </p>
        )}
      </div>
    </div>
  );
}

function StepReaction({
  selectedReaction,
  setSelectedReaction,
}: {
  selectedReaction: Reaction | null;
  setSelectedReaction: (r: Reaction) => void;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#e5e7eb",
          marginBottom: "0.75rem",
        }}
      >
        Choose the <strong>REAction</strong> that should run when the Action
        fires.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {REACTIONS.map((reaction) => {
          const isActive = selectedReaction?.id === reaction.id;
          return (
            <button
              key={reaction.id}
              type="button"
              onClick={() => setSelectedReaction(reaction)}
              style={{
                textAlign: "left",
                padding: "0.6rem 0.8rem",
                borderRadius: 10,
                border: isActive
                  ? "1px solid #22c55e"
                  : "1px solid rgba(148,163,184,0.5)",
                background: isActive ? "rgba(34,197,94,0.12)" : "transparent",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#e5e7eb",
              }}
            >
              {reaction.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepSummary({
  name,
  setName,
  note,
  setNote,
  selectedService,
  selectedAction,
  selectedReaction,
}: {
  name: string;
  setName: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  selectedService: Service | null;
  selectedAction: Action | null;
  selectedReaction: Reaction | null;
}) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#e5e7eb",
          marginBottom: "0.75rem",
        }}
      >
        Review your AREA before creating it. This information will be sent to
        the backend API.
      </p>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem 0.9rem",
          borderRadius: 12,
          border: "1px solid rgba(148,163,184,0.5)",
          background: "rgba(15,23,42,0.9)",
          fontSize: "0.85rem",
          color: "#e5e7eb",
        }}
      >
        <p style={{ margin: 0 }}>
          <span style={{ color: "#60a5fa", fontWeight: 500 }}>Service:</span>{" "}
          {selectedService ? selectedService.name : "Not selected"}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ color: "#60a5fa", fontWeight: 500 }}>Action:</span>{" "}
          {selectedAction ? selectedAction.label : "Not selected"}
        </p>
        <p style={{ margin: 0 }}>
          <span style={{ color: "#22c55e", fontWeight: 500 }}>REAction:</span>{" "}
          {selectedReaction ? selectedReaction.label : "Not selected"}
        </p>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <label
          className="form-label"
          htmlFor="area-name"
          style={{ display: "block", marginBottom: "0.25rem" }}
        >
          AREA name
        </label>
        <input
          id="area-name"
          className="form-input"
          placeholder="GitHub → Discord release alerts"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label
          className="form-label"
          htmlFor="area-note"
          style={{ display: "block", marginBottom: "0.25rem" }}
        >
          Optional note
        </label>
        <textarea
          id="area-note"
          className="form-input"
          style={{ minHeight: 80, resize: "vertical" }}
          placeholder="This AREA is used to notify the team each time we create a release."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </div>
  );
}