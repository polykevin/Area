"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TrelloCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash; 
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("token");

    const state = searchParams.get("state");

    if (!token || !state) {
      console.error("Missing token or state");
      return;
    }

    fetch("http://localhost:8080/oauth/trello/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, state }),
    })
      .then(() => {
        router.push("/services?connected=trello");
      })
      .catch(console.error);
  }, []);

  return <p>Connecting Trello…</p>;
}
