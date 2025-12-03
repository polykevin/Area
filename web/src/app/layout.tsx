import "./globals.css";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "AREA – Web Client",
  description: "Web client for the AREA automation platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main
            style={{
              minHeight: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="app-root">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
