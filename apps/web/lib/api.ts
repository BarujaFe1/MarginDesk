import {
  buildDemoBundle,
  calculateMargin as calcLocal,
  cloneProposal,
} from "@/lib/engine";
import type { DemoResponse, MarginBreakdown, ProposalInput } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Prefer client-side margin engine for the Vercel/GitHub Pages lab demo.
 * Optional FastAPI backend when NEXT_PUBLIC_API_URL is set (local full stack).
 */
async function tryBackend<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchDemo(activeId?: string): Promise<DemoResponse> {
  const remote = await tryBackend<DemoResponse>("/api/demo");
  if (remote) {
    if (!remote.proposals?.length) {
      const local = buildDemoBundle(activeId ?? remote.proposal.proposal_id ?? "prop-demo-001");
      return { ...remote, proposals: local.proposals };
    }
    return remote;
  }
  return buildDemoBundle(activeId);
}

export async function calculateMargin(
  proposal: ProposalInput,
): Promise<{ margin: MarginBreakdown }> {
  const remote = await tryBackend<{ margin: MarginBreakdown }>("/api/margin/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proposal),
  });
  if (remote) return remote;
  return { margin: calcLocal(cloneProposal(proposal)) };
}

export { DEMO_PROPOSALS } from "@/lib/engine";
