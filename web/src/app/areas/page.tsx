"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function AreasPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div>
      <h1>My AREA</h1>
      <p style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
        This page will display your configured automations (Action → REAction).
        For now, it is just a protected placeholder.
      </p>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/areas/new" className="card-link">
          + Create a new AREA
        </Link>
      </div>
    </div>
  );
}
