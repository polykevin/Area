"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiRegister } from "@/lib/api";

export default function RegisterPage() {
  const { loginFromApi } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !password || !confirm) {
      setIsError(true);
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsError(false);
      setMessage(null);

      const res = await apiRegister(email, password);

      loginFromApi(res.user, res.access_token);
      router.push("/areas");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed.";
      setIsError(true);
      setMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleSignIn() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card"
        style={{
          textAlign: "center",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <h1 className="card-title">Create an account</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-field" style={{ textAlign: "left" }}>
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field" style={{ textAlign: "left" }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-field" style={{ textAlign: "left" }}>
            <label className="form-label" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {message && (
          <p
            className={
              "message " + (isError ? "message-error" : "message-success")
            }
          >
            {message}
          </p>
        )}

        {/* Separator */}
        <div
          style={{
            margin: "1rem 0",
            color: "#94a3b8",
            fontSize: "0.8rem",
          }}
        >
          — or —
        </div>

        {/* Google Button (Dark, With Border) */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          style={{
            width: "100%",
            background: "rgba(15,23,42,0.9)",
            color: "#f9fafb",
            borderRadius: 999,
            padding: "0.55rem",
            border: "1px solid rgba(148,163,184,0.6)",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>

        <p className="card-footer">
          Already have an account?{" "}
          <Link href="/login" className="card-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
