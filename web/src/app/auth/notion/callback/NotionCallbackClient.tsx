'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NotionCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      router.replace('/services?error=notion');
      return;
    }

    fetch(`${API_URL}/oauth/notion/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        router.replace('/services?connected=notion');
      })
      .catch(() => {
        router.replace('/services?error=notion');
      });
  }, [router, searchParams]);

  return <p>Connecting to Notion…</p>;
}
