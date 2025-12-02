import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "AREA – Web Client",
  description: "Web client for the AREA automation platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-root">{children}</div>
      </body>
    </html>
  );
}
