"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiLogin } from "@/lib/api";

const GOOGLE_AUTH_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080") +
  "/auth/google";

export default function LoginPage() {
  const { loginFromApi } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setIsError(true);
      setMessage("Please fill in both fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsError(false);
      setMessage(null);

      const res = await apiLogin(email, password);
      loginFromApi(res.user, res.access_token);
      router.push("/areas");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setIsError(true);
      setMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoogleSignIn() {
    window.location.href = GOOGLE_AUTH_URL;
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
        <h1 className="card-title">Sign in</h1>

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
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <input
                id="password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-button"
                style={{
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.4)",
                  padding: "0.25rem 0.6rem",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn-primary btn-press`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
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

        <div
          style={{
            margin: "1rem 0",
            fontSize: "0.8rem",
            color: "#94a3b8",
          }}
        >
          — or —
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn-dark"
          style={{ width: "100%" }}
        >
          Continue with Google
        </button>

        <p className="card-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="card-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}