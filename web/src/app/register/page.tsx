"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function handleSubmit(e: FormEvent) {
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

    setIsError(false);
    setMessage("Simulated registration. Backend logic will be added later.");
    console.log("Simulated register with:", { email, password });
  }

  return (
    <div className="card" style={{ textAlign: "center" }}>
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

        <button type="submit" className="btn-primary">
          Sign up
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
        Already have an account?{" "}
        <Link href="/login" className="card-link">
          Sign in
        </Link>
      </p>
    </div>
  );
}
