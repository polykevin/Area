"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { Area } from "@/types/area";
import { apiFetch, apiGetCatalog, type CatalogService } from "@/lib/api";

type ParamRow = { key: string; value: string };

function rowsToObject(rows: ParamRow[]) {
  const obj: Record<string, string> = {};
  for (const r of rows) {
    const k = r.key.trim();
    if (!k) continue;
    obj[k] = r.value;
  }
  return obj;
}

function safeParseJson(json: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(json) as unknown;
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
    return null;
  } catch {
    return null;
  }
}

export default function NewAreaPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState<CatalogService[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [actionServiceId, setActionServiceId] = useState<string>("");
  const [actionId, setActionId] = useState<string>("");

  const [reactionServiceId, setReactionServiceId] = useState<string>("");
  const [reactionId, setReactionId] = useState<string>("");

  const [actionParamsRows, setActionParamsRows] = useState<ParamRow[]>([{ key: "", value: "" }]);
  const [reactionParamsRows, setReactionParamsRows] = useState<ParamRow[]>([{ key: "", value: "" }]);

  const [advancedActionJson, setAdvancedActionJson] = useState(false);
  const [advancedReactionJson, setAdvancedReactionJson] = useState(false);

  const [actionParamsJson, setActionParamsJson] = useState("{}");
  const [reactionParamsJson, setReactionParamsJson] = useState("{}");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!user) router.replace("/login");
  }, [isReady, user, router]);

  useEffect(() => {
    if (!isReady || !user) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiGetCatalog();
        const services = res?.services ?? [];
        setCatalog(services);

        const firstActionService = services.find((s) => (s.actions ?? []).length > 0);
        const firstReactionService = services.find((s) => (s.reactions ?? []).length > 0);

        if (firstActionService) {
          setActionServiceId(firstActionService.id);
          setActionId(firstActionService.actions?.[0]?.id ?? "");
        }
        if (firstReactionService) {
          setReactionServiceId(firstReactionService.id);
          setReactionId(firstReactionService.reactions?.[0]?.id ?? "");
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load catalog";
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [isReady, user]);

  const actionService = useMemo(
    () => catalog.find((s) => s.id === actionServiceId),
    [catalog, actionServiceId],
  );
  const reactionService = useMemo(
    () => catalog.find((s) => s.id === reactionServiceId),
    [catalog, reactionServiceId],
  );

  useEffect(() => {
    if (!actionService) return;
    const first = actionService.actions?.[0]?.id ?? "";
    setActionId(first);
  }, [actionServiceId]); 

  useEffect(() => {
    if (!reactionService) return;
    const first = reactionService.reactions?.[0]?.id ?? "";
    setReactionId(first);
  }, [reactionServiceId]);

  async function handleCreate() {
    setError(null);

    if (!name.trim()) {
      setError("Please provide a name for your AREA.");
      return;
    }
    if (!actionServiceId || !actionId) {
      setError("Please select an Action service and an Action.");
      return;
    }
    if (!reactionServiceId || !reactionId) {
      setError("Please select a Reaction service and a Reaction.");
      return;
    }

    const actionParams = advancedActionJson
      ? safeParseJson(actionParamsJson)
      : rowsToObject(actionParamsRows);

    const reactionParams = advancedReactionJson
      ? safeParseJson(reactionParamsJson)
      : rowsToObject(reactionParamsRows);

    if (advancedActionJson && !actionParams) {
      setError("Invalid JSON for Action params.");
      return;
    }
    if (advancedReactionJson && !reactionParams) {
      setError("Invalid JSON for Reaction params.");
      return;
    }

    const dto: Omit<Area, "id"> = {
      name: name.trim(),
      description: description.trim(),
      actionService: actionServiceId,
      actionType: actionId,
      actionParams: actionParams ?? {},
      reactionService: reactionServiceId,
      reactionType: reactionId,
      reactionParams: reactionParams ?? {},
      active: true,
    };

    try {
      setSubmitting(true);
      const res = await apiFetch("/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      if (!res.ok) {
        const t = await res.text();
        setError(t || "Failed to create AREA");
        return;
      }

      router.push("/areas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  function ParamEditor({
    title,
    rows,
    setRows,
    advanced,
    setAdvanced,
    jsonValue,
    setJsonValue,
    placeholder,
  }: {
    title: string;
    rows: ParamRow[];
    setRows: (v: ParamRow[]) => void;
    advanced: boolean;
    setAdvanced: (v: boolean) => void;
    jsonValue: string;
    setJsonValue: (v: string) => void;
    placeholder: string;
  }) {
    return (
      <section
        style={{
          marginTop: "0.75rem",
          borderRadius: 14,
          border: "1px solid rgba(148,163,184,0.25)",
          padding: "0.9rem",
          background: "rgba(2,6,23,0.55)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600, color: "#e5e7eb" }}>{title}</h3>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
            <input
              type="checkbox"
              checked={advanced}
              onChange={(e) => setAdvanced(e.target.checked)}
            />
            Advanced JSON
          </label>
        </div>

        {!advanced ? (
          <>
            <p style={{ margin: "0.35rem 0 0.75rem", fontSize: "0.8rem", color: "#94a3b8" }}>
              Add optional parameters as key/value pairs (you can leave empty).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {rows.map((r, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem" }}>
                  <input
                    className="form-input"
                    value={r.key}
                    onChange={(e) => {
                      const next = [...rows];
                      next[idx] = { ...next[idx], key: e.target.value };
                      setRows(next);
                    }}
                    placeholder="key (ex: to)"
                  />
                  <input
                    className="form-input"
                    value={r.value}
                    onChange={(e) => {
                      const next = [...rows];
                      next[idx] = { ...next[idx], value: e.target.value };
                      setRows(next);
                    }}
                    placeholder="value (ex: team@example.com)"
                  />
                  <button
                    type="button"
                    className="btn-dark"
                    style={{ padding: "0.45rem 0.7rem", borderRadius: 10 }}
                    onClick={() => {
                      const next = rows.filter((_, i) => i !== idx);
                      setRows(next.length ? next : [{ key: "", value: "" }]);
                    }}
                    aria-label="Remove parameter"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-dark"
              style={{ marginTop: "0.75rem", width: "100%" }}
              onClick={() => setRows([...rows, { key: "", value: "" }])}
            >
              Add parameter
            </button>
          </>
        ) : (
          <>
            <p style={{ margin: "0.35rem 0 0.75rem", fontSize: "0.8rem", color: "#94a3b8" }}>
              Provide a JSON object (ex: {"{ \"channel\": \"#general\" }"}).
            </p>
            <textarea
              value={jsonValue}
              onChange={(e) => setJsonValue(e.target.value)}
              rows={5}
              className="form-input"
              style={{ resize: "vertical" }}
              placeholder={placeholder}
            />
          </>
        )}
      </section>
    );
  }

  if (!isReady || !user) return null;

  if (loading) {
    return (
      <div style={{ paddingTop: "6rem", textAlign: "center", color: "#e5e7eb" }}>
        Loading service catalog...
      </div>
    );
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
        <h1 style={{ fontSize: "1.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
          Create a new AREA
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
          Pick an Action (When…) and a Reaction (Then…).
        </p>
      </header>

      <div
        style={{
          borderRadius: 20,
          border: "1px solid rgba(148,163,184,0.35)",
          padding: "1.5rem 1.7rem",
          background: "rgba(15,23,42,0.96)",
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        {error && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.75rem 0.9rem",
              borderRadius: 12,
              border: "1px solid rgba(248,113,113,0.5)",
              background: "rgba(248,113,113,0.12)",
              color: "#fecaca",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Basic info */}
        <div style={{ display: "grid", gap: "0.9rem" }}>
          <div>
            <label className="form-label" htmlFor="area-name">
              Name
            </label>
            <input
              id="area-name"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Gmail -> Slack notification"
            />
          </div>

          <div>
            <label className="form-label" htmlFor="area-desc">
              Description (optional)
            </label>
            <textarea
              id="area-desc"
              className="form-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short explanation of what this automation does."
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Action */}
        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
            When (Action)
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.75rem" }}>
            <div>
              <label className="form-label" htmlFor="action-service">
                Service
              </label>
              <select
                id="action-service"
                className="form-input"
                value={actionServiceId}
                onChange={(e) => setActionServiceId(e.target.value)}
              >
                {catalog
                  .filter((s) => (s.actions ?? []).length > 0)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.displayName ?? s.id}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="action-id">
                Trigger
              </label>
              <select
                id="action-id"
                className="form-input"
                value={actionId}
                onChange={(e) => setActionId(e.target.value)}
              >
                {(actionService?.actions ?? []).map((a, idx) => (
                  <option key={`${a.id ?? "action"}-${idx}`} value={a.id ?? ""}>
                    {a.name ?? a.id ?? "Unnamed action"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ParamEditor
            title="Action parameters"
            rows={actionParamsRows}
            setRows={setActionParamsRows}
            advanced={advancedActionJson}
            setAdvanced={setAdvancedActionJson}
            jsonValue={actionParamsJson}
            setJsonValue={setActionParamsJson}
            placeholder='{"from":"boss@company.com"}'
          />
        </section>

        {/* Reaction */}
        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
            Then (Reaction)
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.75rem" }}>
            <div>
              <label className="form-label" htmlFor="reaction-service">
                Service
              </label>
              <select
                id="reaction-service"
                className="form-input"
                value={reactionServiceId}
                onChange={(e) => setReactionServiceId(e.target.value)}
              >
                {catalog
                  .filter((s) => (s.reactions ?? []).length > 0)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.displayName ?? s.id}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="reaction-id">
                Reaction
              </label>
              <select
                id="reaction-id"
                className="form-input"
                value={reactionId}
                onChange={(e) => setReactionId(e.target.value)}
              >
                {(reactionService?.reactions ?? []).map((r, idx) => (
                  <option key={`${r.id ?? "reaction"}-${idx}`} value={r.id ?? ""}>
                    {r.name ?? r.id ?? "Unnamed reaction"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ParamEditor
            title="Reaction parameters"
            rows={reactionParamsRows}
            setRows={setReactionParamsRows}
            advanced={advancedReactionJson}
            setAdvanced={setAdvancedReactionJson}
            jsonValue={reactionParamsJson}
            setJsonValue={setReactionParamsJson}
            placeholder='{"to":"team@company.com","subject":"Hello"}'
          />
        </section>

        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button
            type="button"
            className="btn-dark"
            onClick={() => router.push("/areas")}
            disabled={submitting}
            style={{ borderRadius: 999, padding: "0.55rem 1rem" }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={submitting}
            style={{
              padding: "0.55rem 1.1rem",
              borderRadius: 999,
              border: "none",
              background: "#16a34a",
              color: "#f9fafb",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {submitting ? "Creating..." : "Create AREA"}
          </button>
        </div>
      </div>
    </div>
  );
}