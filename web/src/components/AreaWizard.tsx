"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import type { Area } from "@/types/area";
import { apiFetch } from "@/lib/api";

type WizardStep = 1 | 2 | 3;

type Catalog = {
  services: Array<{
    id: string;
    displayName: string;
    actions: Array<{ id: string; name: string }>;
    reactions: Array<{ id: string; name: string }>;
  }>;
};

type Props = {
  onCreate(area: Area): void;
};

type Field = {
  key: string;
  label: string;
  type: "text" | "textarea";
  required?: boolean;
  placeholder?: string;
};

function getActionFields(serviceId: string, actionId: string): Field[] {
  if (serviceId === "google" && actionId === "new_email") {
    return [
      {
        key: "folder",
        label: "Folder",
        type: "text",
        required: true,
        placeholder: "INBOX",
      },
    ];
  }
  return [];
}

function getReactionFields(serviceId: string, reactionId: string): Field[] {
  if (serviceId === "google" && reactionId === "send_email") {
    return [
      { key: "to", label: "To", type: "text", required: true, placeholder: "you@example.com" },
      { key: "subject", label: "Subject", type: "text", required: true, placeholder: "Hello" },
      { key: "body", label: "Body", type: "textarea", required: true, placeholder: "Your message..." },
    ];
  }
  return [];
}

export function AreaWizard({ onCreate }: Props) {
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Catalog
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // Step 2 (Action)
  const [actionService, setActionService] = useState("");
  const [actionType, setActionType] = useState("");
  const [actionParams, setActionParams] = useState<Record<string, string>>({});

  // Step 3 (Reaction)
  const [reactionService, setReactionService] = useState("");
  const [reactionType, setReactionType] = useState("");
  const [reactionParams, setReactionParams] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoadingCatalog(true);
        setCatalogError(null);

        const res = await apiFetch("/services/catalog", { method: "GET" });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to load services catalog");
        }

        const data = (await res.json()) as Catalog;
        setCatalog(data);

        // Preselect first service/action/reaction
        const first = data.services?.[0];
        if (first) {
          setActionService(first.id);
          setActionType(first.actions?.[0]?.id || "");
          setReactionService(first.id);
          setReactionType(first.reactions?.[0]?.id || "");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load catalog";
        setCatalogError(msg);
      } finally {
        setLoadingCatalog(false);
      }
    }

    loadCatalog();
  }, []);

  const services = catalog?.services ?? [];

  const actionServiceDef = useMemo(
    () => services.find((s) => s.id === actionService) ?? null,
    [services, actionService]
  );

  const reactionServiceDef = useMemo(
    () => services.find((s) => s.id === reactionService) ?? null,
    [services, reactionService]
  );

  const actionFields = useMemo(
    () => getActionFields(actionService, actionType),
    [actionService, actionType]
  );

  const reactionFields = useMemo(
    () => getReactionFields(reactionService, reactionType),
    [reactionService, reactionType]
  );

  function handleNext(e: FormEvent) {
    e.preventDefault();

    if (step === 1) {
      if (!name.trim()) {
        alert("Please give a name to your AREA.");
        return;
      }
    }

    if (step === 2) {
      // validate action fields
      for (const f of actionFields) {
        if (f.required && !actionParams[f.key]?.trim()) {
          alert(`Please fill: ${f.label}`);
          return;
        }
      }
    }

    if (step === 3) {
      // validate reaction fields
      for (const f of reactionFields) {
        if (f.required && !reactionParams[f.key]?.trim()) {
          alert(`Please fill: ${f.label}`);
          return;
        }
      }

      const newArea: Area = {
        name: name.trim(),
        description: description.trim(),
        actionService,
        actionType,
        actionParams,
        reactionService,
        reactionType,
        reactionParams,
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

  function setField(
    setter: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    key: string,
    value: string
  ) {
    setter((prev) => ({ ...prev, [key]: value }));
  }

  if (loadingCatalog) {
    return (
      <div style={{ textAlign: "center", color: "#e5e7eb" }}>
        Loading services...
      </div>
    );
  }

  if (catalogError) {
    return (
      <div style={{ color: "#fca5a5", background: "rgba(127,29,29,0.25)", padding: "1rem", borderRadius: 12 }}>
        Failed to load services catalog: {catalogError}
      </div>
    );
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
      <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: "0.8rem" }}>
        Step {step} of 3
      </p>

      {step === 1 && (
        <>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.8rem" }}>
            Define your AREA
          </h2>

          <div style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="name" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Gmail automation"
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
            <label htmlFor="description" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
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
          <h2 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.8rem" }}>
            Choose Action
          </h2>

          <div style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="action-service" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
              Service
            </label>
            <select
              id="action-service"
              value={actionService}
              onChange={(e) => {
                const nextService = e.target.value;
                setActionService(nextService);
                const def = services.find((s) => s.id === nextService);
                setActionType(def?.actions?.[0]?.id || "");
                setActionParams({});
              }}
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
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="action-type" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
              Action
            </label>
            <select
              id="action-type"
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                setActionParams({});
              }}
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
              {(actionServiceDef?.actions ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {actionFields.length > 0 && (
            <div style={{ marginTop: "0.6rem" }}>
              {actionFields.map((f) => (
                <div key={f.key} style={{ marginBottom: "0.9rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                    {f.label}
                  </label>
                  <input
                    value={actionParams[f.key] ?? ""}
                    onChange={(e) => setField(setActionParams, f.key, e.target.value)}
                    placeholder={f.placeholder ?? ""}
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
              ))}
            </div>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.8rem" }}>
            Choose Reaction
          </h2>

          <div style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="reaction-service" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
              Service
            </label>
            <select
              id="reaction-service"
              value={reactionService}
              onChange={(e) => {
                const nextService = e.target.value;
                setReactionService(nextService);
                const def = services.find((s) => s.id === nextService);
                setReactionType(def?.reactions?.[0]?.id || "");
                setReactionParams({});
              }}
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
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="reaction-type" style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
              Reaction
            </label>
            <select
              id="reaction-type"
              value={reactionType}
              onChange={(e) => {
                setReactionType(e.target.value);
                setReactionParams({});
              }}
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
              {(reactionServiceDef?.reactions ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {reactionFields.length > 0 && (
            <div style={{ marginTop: "0.6rem" }}>
              {reactionFields.map((f) => (
                <div key={f.key} style={{ marginBottom: "0.9rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                    {f.label}
                  </label>

                  {f.type === "textarea" ? (
                    <textarea
                      value={reactionParams[f.key] ?? ""}
                      onChange={(e) => setField(setReactionParams, f.key, e.target.value)}
                      placeholder={f.placeholder ?? ""}
                      rows={4}
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
                  ) : (
                    <input
                      value={reactionParams[f.key] ?? ""}
                      onChange={(e) => setField(setReactionParams, f.key, e.target.value)}
                      placeholder={f.placeholder ?? ""}
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
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: "1.1rem", display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
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