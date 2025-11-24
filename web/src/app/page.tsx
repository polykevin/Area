export default async function Home() {
  const res = await fetch("http://localhost:8081", { cache: "no-store" });
  const data = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">AREA</h1>
      <p>Backend: {data.message}</p>
    </main>
  );
}
