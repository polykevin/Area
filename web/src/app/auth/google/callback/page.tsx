import { Suspense } from "react";
import GoogleCallbackClient from "./GoogleCallbackClient";

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "70vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#e5e7eb" }}>
          <p>Completing Google sign-in...</p>
        </div>
      }
    >
      <GoogleCallbackClient />
    </Suspense>
  );
}
