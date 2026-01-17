'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NotionCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      router.replace('/services?error=notion');
      return;
    }

    const exchange = async () => {
      try {
        const res = await fetch(
          `${API_URL}/oauth/notion/service-callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state ?? '')}`
        );

        if (!res.ok) {
          throw new Error('Notion OAuth failed');
        }

        router.replace('/services?connected=notion');
      } catch (err) {
        console.error(err);
        router.replace('/services?error=notion');
      }
    };

    exchange();
  }, [router, searchParams]);

  return <p>Connecting to Notion…</p>;
}
