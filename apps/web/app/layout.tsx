import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarginDesk — Live Demo | Proposal Margin Desk",
  description:
    "MVP lab: turn service proposals into margin decisions — price floor, scope risk, planned hours and profit tracking. Three synthetic demo proposals.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
