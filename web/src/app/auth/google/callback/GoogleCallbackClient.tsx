"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
  searchParams: SearchParams;
};

export default function GoogleCallbackClient({ searchParams }: Props) {
  const router = useRouter();
  const { loginFromApi } = useAuth();

  useEffect(() => {
    // À adapter selon ce que ton backend renvoie dans l’URL
    const token =
      typeof searchParams.token === "string" ? searchParams.token : undefined;
    const error =
      typeof searchParams.error === "string" ? searchParams.error : undefined;

    if (error) {
      console.error("Google auth error:", error);
      router.replace("/login?error=google_auth_failed");
      return;
    }


    router.replace("/areas");
  }, [searchParams, router, loginFromApi]);

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