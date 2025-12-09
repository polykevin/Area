"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
  searchParams: SearchParams; // on le garde pour la signature mais on ne s'y fie plus
};

type JwtPayload = {
  sub: number | string;
  email: string;
  iat?: number;
  exp?: number;
};

function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (e) {
    console.error("Failed to parse JWT", e);
    return null;
  }
}

export default function GoogleCallbackClient({ searchParams }: Props) {
  const router = useRouter();
  const { loginFromApi } = useAuth();

  useEffect(() => {
    // ✅ Lire directement la query string réelle
    const qs = typeof window !== "undefined" ? window.location.search : "";
    const params = new URLSearchParams(qs);

    // On essaie plusieurs noms, au cas où le back change un jour
    const accessToken =
      params.get("access_token") ||
      params.get("token") ||
      params.get("accessToken") ||
      (typeof searchParams.access_token === "string"
        ? searchParams.access_token
        : undefined);

    if (!accessToken) {
      console.error("No access token found in Google callback URL", {
        qs,
        searchParams,
      });
      router.replace("/login?error=missing_token");
      return;
    }

    const payload = parseJwt(accessToken);

    if (!payload || !payload.email || !payload.sub) {
      console.error("Invalid JWT payload in Google callback", payload);
      router.replace("/login?error=invalid_token");
      return;
    }

    const user = {
      id: typeof payload.sub === "string" ? Number(payload.sub) : payload.sub,
      email: payload.email,
    };

    // hydrate AuthProvider comme après apiLogin
    loginFromApi(user as any, accessToken);

    router.replace("/areas");
  }, [router, loginFromApi, searchParams]);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#e5e7eb",
      }}
    >
      <p>Completing Google sign-in...</p>
    </div>
  );
}