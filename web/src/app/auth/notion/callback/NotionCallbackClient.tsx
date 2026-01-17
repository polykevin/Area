"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
  searchParams: SearchParams;
};

export default function NotionCallbackClient({ searchParams }: Props) {
  const router = useRouter();

  useEffect(() => {
    const code =
      typeof searchParams.code === "string" ? searchParams.code : undefined;
    const state =
      typeof searchParams.state === "string" ? searchParams.state : undefined;

    if (!code) {
      router.replace("/services?error=notion");
      return;
    }

    const exchange = async () => {
      try {
        const res = await fetch(
          `${API_URL}/oauth/notion/service-callback?code=${encodeURIComponent(
            code
          )}&state=${encodeURIComponent(state ?? "")}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Notion OAuth failed");
        }

        router.replace("/services?connected=notion");
      } catch {
        router.replace("/services?error=notion");
      }
    };

    exchange();
  }, [router, searchParams]);

  return <p>Connecting to Notion…</p>;
}
