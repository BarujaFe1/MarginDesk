import type { DemoResponse, ProposalInput, MarginBreakdown } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchDemo(): Promise<DemoResponse> {
  return getJson<DemoResponse>("/api/demo");
}

export function calculateMargin(proposal: ProposalInput): Promise<{ margin: MarginBreakdown }> {
  return postJson<{ margin: MarginBreakdown }>("/api/margin/calculate", proposal);
}
