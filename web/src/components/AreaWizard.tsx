"use client";

import { useState, FormEvent } from "react";
import type { Area } from "@/types/area";

type WizardStep = 1 | 2 | 3;

type Props = {
  onCreate(area: Area): void;
};

const ACTION_SERVICES = ["Gmail"];
const REACTION_SERVICES = ["Gmail"];

export function AreaWizard({ onCreate }: Props) {
  const [step, setStep] = useState<WizardStep>(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [triggerService, setTriggerService] = useState("google");
  const [triggerAction, setTriggerAction] = useState("new_email");
  const [actionParams, setActionParams] = useState("{}");

  const [reactionService, setReactionService] = useState("google");
  const [reactionAction, setReactionAction] = useState("send_email");
  const [reactionParams, setReactionParams] = useState("{}");

  function handleNext(e: FormEvent) {
    e.preventDefault();
    if (step === 3) {
      let parsedActionParams: any = {};
      let parsedReactionParams: any = {};

      try {
        parsedActionParams = JSON.parse(actionParams);
      } catch {
        alert("Invalid JSON in action params");
        return;
      }

      try {
        parsedReactionParams = JSON.parse(reactionParams);
      } catch {
        alert("Invalid JSON in reaction params");
        return;
      }

      const newArea: Area = {
        name: name,
        description: description,
        actionService: triggerService,
        actionType: triggerAction,
        actionParams: parsedActionParams,
        reactionService,
        reactionType: reactionAction,
        reactionParams: parsedReactionParams,
        active: true,
      };
      onCreate(newArea);
      return;
    }
    setStep((prev) => (prev + 1) as WizardStep);
  }

  function handleBack() {
    setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as WizardStep)));
  }

  return (
    <form
      onSubmit={handleNext}
      style={{
        borderRadius: 20,
        border: "1px solid rgba(148,163,184,0.35)",
        padding: "1.5rem 1.7rem",
        background: "rgba(15,23,42,0.96)",
        maxWidth: 640,
        margin: "0 auto",
        color: "#e5e7eb",
      }}
    >
      <p
        style={{
          fontSize: "0.85rem",
          color: "#9ca3af",
          marginBottom: "0.8rem",
        }}
      >
        Step {step} of 3
      </p>

      {step === 1 && (
        <>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              marginBottom: "0.8rem",
            }}
          >
            Define your AREA
          </h2>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My GitHub → Discord automation"
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="description"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what this AREA does."
              rows={3}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                resize: "vertical",
              }}
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              marginBottom: "0.8rem",
            }}
          >
            Choose Action
          </h2>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="trigger-service"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Action service
            </label>
            <select
              id="trigger-service"
              value={triggerService}
              onChange={(e) => setTriggerService(e.target.value)}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
              }}
            >
              {ACTION_SERVICES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="trigger-action"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Action
            </label>
            <input
              id="trigger-action"
              value={triggerAction}
              onChange={(e) => setTriggerAction(e.target.value)}
              placeholder="New issue in repository"
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="action-params">Action Params (JSON)</label>
            <textarea
              id="action-params"
              value={actionParams}
              onChange={(e) => setActionParams(e.target.value)}
              placeholder='{"folder": "Inbox"}'
              rows={3}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                resize: "vertical",
              }}
            />
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              marginBottom: "0.8rem",
            }}
          >
            Choose Reaction
          </h2>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="reaction-service"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Reaction service
            </label>
            <select
              id="reaction-service"
              value={reactionService}
              onChange={(e) => setReactionService(e.target.value)}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
              }}
            >
              {REACTION_SERVICES.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "0.9rem" }}>
            <label
              htmlFor="reaction-action"
              style={{
                display: "block",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              Reaction
            </label>
            <input
              id="reaction-action"
              value={reactionAction}
              onChange={(e) => setReactionAction(e.target.value)}
              placeholder="Send message to channel"
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="reaction-params">Reaction Params (JSON)</label>
            <textarea
              id="reaction-params"
              value={reactionParams}
              onChange={(e) => setReactionParams(e.target.value)}
              placeholder='{"channel": "#general"}'
              rows={3}
              style={{
                width: "100%",
                padding: "0.45rem 0.6rem",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                fontSize: "0.9rem",
                resize: "vertical",
              }}
            />
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "1.1rem",
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.6)",
            background: "transparent",
            color: step === 1 ? "#6b7280" : "#e5e7eb",
            cursor: step === 1 ? "default" : "pointer",
            fontSize: "0.85rem",
          }}
        >
          Back
        </button>

        <button
          type="submit"
          style={{
            padding: "0.45rem 1.1rem",
            borderRadius: 999,
            border: "none",
            background: step === 3 ? "#16a34a" : "#2563eb",
            color: "#f9fafb",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {step === 3 ? "Create AREA" : "Next"}
        </button>
      </div>
    </form>
  );
}
