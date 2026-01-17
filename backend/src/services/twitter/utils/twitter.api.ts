export async function twitterPostTweet(accessToken: string, text: string) {
  const res = await fetch('https://api.x.com/2/tweets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Twitter API error (${res.status}): ${txt}`);
  }

  return res.json();
}