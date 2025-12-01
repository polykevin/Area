import Link from "next/link";

export default function AreasPage() {
  return (
    <div>
      <h1>My AREA</h1>
      <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
        This page will show all AREA configured by the user (Action → Reaction).
        The web client only displays configuration and sends changes to the
        backend. All automation is executed server-side.
      </p>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/areas/new">+ Create a new AREA</Link>
      </div>
    </div>
  );
}
