import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarginDesk — Proposal Margin Desk",
  description:
    "Turn service proposals into margin decisions: price floor, scope risk, planned hours and profit tracking.",
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
