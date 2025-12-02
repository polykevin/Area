"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setIsError(true);
      setMessage("Please fill in both fields.");
      return;
    }

    setIsError(false);
    setMessage("Simulated login. Backend authentication coming soon!");
    console.log("Simulated login with:", { email, password });
  }

  function handleForgotPassword() {
    setIsError(false);
    setMessage("Forgot password flow is not implemented yet.");
  }

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h1 className="card-title">Sign in</h1>

      <form onSubmit={handleSubmit}>
        {/* EMAIL */}
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
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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

        <div style={{ margin: "0.5rem 0 1.25rem" }}>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-button"
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className="btn-primary">
          Sign in
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

      <p className="card-footer">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="card-link">
          Sign up
        </Link>
      </p>
    </div>
  );
}
