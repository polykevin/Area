import "./globals.css";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "AREA – Web Client",
  description: "Web client for the AREA automation platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div className="app-root">{children}</div>
        </main>
      </body>
    </html>
  );
}
