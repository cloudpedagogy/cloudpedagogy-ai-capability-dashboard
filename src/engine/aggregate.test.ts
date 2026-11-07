import { describe, it, expect } from "vitest"
import {
  summariseDataset,
  computeDomainDistributions,
  bandShare,
  bandWeightedIndex,
  computeDatasetAverageIndex,
  identifyGaps,
  type DomainDistribution,
} from "./aggregate"
import { DEMO_ROWS } from "../data/demo"
import type { AggregatedRow } from "./schema"

describe("aggregate", () => {
  describe("summariseDataset", () => {
    it("computes total count, periods, and sorted context tags", () => {
      const summary = summariseDataset(DEMO_ROWS)
      expect(summary.total_count).toBe(792)
      expect(summary.periods).toHaveLength(2)
      expect(summary.periods[0]).toEqual({ start: "2025-09-01", end: "2025-09-30" })
      expect(summary.periods[1]).toEqual({ start: "2025-10-01", end: "2025-10-31" })
      expect(summary.contexts).toEqual(["education"])
    })

    it("handles multiple contexts correctly", () => {
      const rows: AggregatedRow[] = [
        { period_start: "2025-01-01", period_end: "2025-01-31", domain: "Awareness", band: "emerging", count: 10, context_tag: "tagB" },
        { period_start: "2025-01-01", period_end: "2025-01-31", domain: "Awareness", band: "embedded", count: 5, context_tag: "tagA" },
      ]
      const summary = summariseDataset(rows)
      expect(summary.total_count).toBe(15)
      expect(summary.contexts).toEqual(["tagA", "tagB"])
    })
  })

  describe("computeDomainDistributions", () => {
    it("computes distribution for all 6 canonical domains", () => {
      const dists = computeDomainDistributions(DEMO_ROWS)
      expect(dists).toHaveLength(6)

      const awareness = dists.find((d) => d.domain === "Awareness")!
      expect(awareness).toBeDefined()
      // Period 1: 14 + 34 + 18 = 66, Period 2: 10 + 32 + 24 = 66 -> total 132
      expect(awareness.emerging).toBe(14 + 10)
      expect(awareness.developing).toBe(34 + 32)
      expect(awareness.embedded).toBe(18 + 24)
      expect(awareness.total).toBe(132)
    })

    it("initialises domains with 0 if no rows match", () => {
      const rows: AggregatedRow[] = [
        { period_start: "2025-01-01", period_end: "2025-01-31", domain: "Awareness", band: "emerging", count: 10 },
      ]
      const dists = computeDomainDistributions(rows)
      expect(dists).toHaveLength(6)
      const coAgency = dists.find((d) => d.domain === "Human–AI Co-Agency")!
      expect(coAgency.total).toBe(0)
      expect(coAgency.emerging).toBe(0)
    })
  })

  describe("bandShare", () => {
    it("returns 0 if total is 0", () => {
      const dist: DomainDistribution = {
        domain: "Awareness",
        emerging: 0,
        developing: 0,
        embedded: 0,
        total: 0,
      }
      expect(bandShare(dist, "emerging")).toBe(0)
      expect(bandShare(dist, "embedded")).toBe(0)
    })

    it("computes proportion correctly", () => {
      const dist: DomainDistribution = {
        domain: "Awareness",
        emerging: 25,
        developing: 50,
        embedded: 25,
        total: 100,
      }
      expect(bandShare(dist, "emerging")).toBe(0.25)
      expect(bandShare(dist, "developing")).toBe(0.5)
      expect(bandShare(dist, "embedded")).toBe(0.25)
    })
  })

  describe("bandWeightedIndex", () => {
    it("returns 0 if total is 0", () => {
      const dist: DomainDistribution = {
        domain: "Awareness",
        emerging: 0,
        developing: 0,
        embedded: 0,
        total: 0,
      }
      expect(bandWeightedIndex(dist)).toBe(0)
    })

    it("computes weighted index (1*emerging + 2*developing + 3*embedded)/total rounded to 2 decimals", () => {
      // emerging=10 (10), developing=20 (40), embedded=10 (30) -> (10+40+30)/40 = 80/40 = 2.0
      const dist: DomainDistribution = {
        domain: "Awareness",
        emerging: 10,
        developing: 20,
        embedded: 10,
        total: 40,
      }
      expect(bandWeightedIndex(dist)).toBe(2.0)
    })
  })

  describe("computeDatasetAverageIndex & identifyGaps", () => {
    it("computes average index and identifies domains >15% below average", () => {
      const dists: DomainDistribution[] = [
        { domain: "Awareness", emerging: 10, developing: 20, embedded: 70, total: 100 }, // (10+40+210)/100 = 2.6
        { domain: "Human–AI Co-Agency", emerging: 10, developing: 20, embedded: 70, total: 100 }, // 2.6
        { domain: "Applied Practice & Innovation", emerging: 10, developing: 20, embedded: 70, total: 100 }, // 2.6
        { domain: "Ethics, Equity & Impact", emerging: 10, developing: 20, embedded: 70, total: 100 }, // 2.6
        { domain: "Decision-Making & Governance", emerging: 80, developing: 20, embedded: 0, total: 100 }, // (80+40+0)/100 = 1.2
        { domain: "Reflection, Learning & Renewal", emerging: 10, developing: 20, embedded: 70, total: 100 }, // 2.6
      ]

      const avg = computeDatasetAverageIndex(dists)
      // avg = (2.6 * 5 + 1.2) / 6 = 14.2 / 6 = 2.3667 -> 2.37
      expect(avg).toBe(2.37)

      // threshold 15%: avg * (1 - 0.15) = 2.37 * 0.85 = 2.0145
      // Decision-Making & Governance is 1.2 < 2.0145 -> gap!
      const gaps = identifyGaps(dists)
      expect(gaps).toEqual(["Decision-Making & Governance"])
    })

    it("returns empty array when dists have 0 total", () => {
      const dists: DomainDistribution[] = [
        { domain: "Awareness", emerging: 0, developing: 0, embedded: 0, total: 0 },
      ]
      expect(computeDatasetAverageIndex(dists)).toBe(0)
      expect(identifyGaps(dists)).toEqual([])
    })
  })
})
