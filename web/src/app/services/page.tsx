"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function ServicesPage() {
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
      <h1>Services</h1>
      <p>
        This page will list all services connected to your account. For now, it
        is protected by a simple simulated authentication layer.
      </p>
    </div>
  );
}
