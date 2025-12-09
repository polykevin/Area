"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { API_BASE_URL } from "@/lib/api";

type MeResponse = {
  id: number;
  email: string;
  provider?: string;
  createdAt?: string;
  services?: string[];
};

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginFromApi } = useAuth();
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("access_token");

    if (error || !token) {
      setMessage("Google authentication failed. Redirecting to login...");
      const timeout = setTimeout(() => {
        router.replace("/login?error=google_failed");
      }, 2000);
      return () => clearTimeout(timeout);
    }

    // token is guaranteed to be present past this point
    const accessToken = token;

    async function finishLogin() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const me: MeResponse = await res.json();

        loginFromApi(
          {
            id: me.id,
            email: me.email,
          },
          accessToken,
        );

        router.replace("/areas");
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Google authentication failed";
        setMessage(msg);
        const timeout = setTimeout(() => {
          router.replace("/login?error=google_failed");
        }, 2000);
        return () => clearTimeout(timeout);
      }
    }

    void finishLogin();
  }, [searchParams, router, loginFromApi]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e5e7eb",
      }}
    >
      <p>{message}</p>
    </div>
  );
}
