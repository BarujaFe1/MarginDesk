import { describe, expect, it } from "vitest";
import { buildDemoBundle, buildTrackerProjects, DEMO_PROPOSALS } from "@/lib/demo";
import { calculateMargin, priceSliderBounds } from "@/lib/margin";
import { cloneProposal } from "@/lib/demo";

describe("calculateMargin", () => {
  it("matches the Studio Norte fixture math", () => {
    const proposal = DEMO_PROPOSALS[0];
    const margin = calculateMargin(proposal);

    const labor = 28 * 120 + 40 * 140 + 8 * 100;
    const costs = 180 + 120 + 90;
    const contingency = 6 * (labor / 76);
    const total = labor + costs + contingency;
    const expectedPct = ((14500 - total) / 14500) * 100;

    expect(margin.labor_cost).toBe(labor);
    expect(margin.direct_costs).toBe(costs);
    expect(margin.total_cost).toBeCloseTo(total, 1);
    expect(margin.margin_pct).toBeCloseTo(expectedPct, 1);
    expect(margin.risk_level).toBe("high");
    expect(margin.risk_score).toBe(44);
    expect(margin.min_price_for_target).toBeGreaterThan(margin.price);
  });

  it("clamps target margin to 95% to avoid divide-by-zero", () => {
    const proposal = cloneProposal(DEMO_PROPOSALS[0]);
    proposal.target_margin_pct = 100;
    const margin = calculateMargin(proposal);
    // 100% is clamped to 95% → min price ≈ total / 0.05
    expect(margin.min_price_for_target).toBeGreaterThan(margin.total_cost * 10);
    expect(Math.abs(margin.min_price_for_target - margin.total_cost / 0.05)).toBeLessThan(1);
  });

  it("handles zero price without NaN", () => {
    const proposal = cloneProposal(DEMO_PROPOSALS[1]);
    proposal.price = 0;
    const margin = calculateMargin(proposal);
    expect(margin.margin_pct).toBe(0);
    expect(Number.isFinite(margin.profit)).toBe(true);
  });
});

describe("priceSliderBounds", () => {
  it("keeps max >= min and clamps value", () => {
    const bounds = priceSliderBounds(10000, 8000, 500);
    expect(bounds.max).toBeGreaterThanOrEqual(bounds.min);
    expect(bounds.value).toBeGreaterThanOrEqual(bounds.min);
    expect(bounds.value).toBeLessThanOrEqual(bounds.max);
  });

  it("expands max when current price is already high", () => {
    const bounds = priceSliderBounds(5000, 6000, 20000);
    expect(bounds.max).toBeGreaterThanOrEqual(20000);
    expect(bounds.value).toBe(20000);
  });
});

describe("demo tracker consistency", () => {
  it("derives planned_* from the same margin engine", () => {
    const tracker = buildTrackerProjects();
    expect(tracker).toHaveLength(3);

    for (const proposal of DEMO_PROPOSALS) {
      const row = tracker.find((t) => t.proposal_id === proposal.proposal_id);
      const margin = calculateMargin(proposal);
      expect(row).toBeDefined();
      expect(row!.planned_cost).toBe(margin.total_cost);
      expect(row!.planned_margin_pct).toBe(margin.margin_pct);
      expect(row!.planned_hours).toBe(margin.planned_hours);
    }
  });

  it("builds a demo bundle with three proposals", () => {
    const bundle = buildDemoBundle();
    expect(bundle.proposals).toHaveLength(3);
    expect(bundle.summary.proposals).toBe(3);
    expect(bundle.margin.total_cost).toBeGreaterThan(0);
  });
});
