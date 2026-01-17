"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function TrelloCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 🔥 Trello token est dans le HASH (#token=...)
    const hash = window.location.hash; // "#token=ATTA..."
    const token = hash.startsWith("#token=")
      ? hash.replace("#token=", "")
      : null;

    const state = searchParams.get("state");

    if (!token) {
      console.error("No Trello token found in hash");
      return;
    }

    async function finalize() {
      try {
        await apiFetch("/oauth/trello/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, state }),
        });

        // Nettoie l'URL + redirection propre
        router.replace("/services?connected=true");
      } catch (err) {
        console.error("Trello OAuth failed", err);
      }
    }

    finalize();
  }, [router, searchParams]);

  return <div>Finalizing Trello connection…</div>;
}
