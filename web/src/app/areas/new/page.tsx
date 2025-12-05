"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { AreaWizard } from "@/components/AreaWizard";

export default function NewAreaPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, isReady, router]);

  if (!isReady || !user) {
    return null;
  }

  return (
    <div>
      <AreaWizard />
    </div>
  );
}