import { describe, it, expect } from "vitest"
import {
  computePeriodDistributions,
  computeTrendSeries,
  getDomainKeys,
  calculateTrendDeltas,
} from "./trends"
import { DEMO_ROWS } from "../data/demo"
import { CANONICAL_DOMAINS, type AggregatedRow } from "./schema"

describe("trends", () => {
  it("groups rows by period and orders them chronologically", () => {
    const periodDists = computePeriodDistributions(DEMO_ROWS)
    expect(periodDists).toHaveLength(2)
    expect(periodDists[0].period.start).toBe("2025-09-01")
    expect(periodDists[0].period.end).toBe("2025-09-30")
    expect(periodDists[0].period.label).toBe("2025-09-01 → 2025-09-30")
    expect(periodDists[1].period.start).toBe("2025-10-01")
    expect(periodDists[1].period.end).toBe("2025-10-31")
  })

  it("computes trend series with all canonical domains", () => {
    const periodDists = computePeriodDistributions(DEMO_ROWS)
    const series = computeTrendSeries(periodDists)

    expect(series).toHaveLength(2)
    expect(series[0].period).toBe("2025-09-01 → 2025-09-30")
    expect(series[0].start).toBe("2025-09-01")
    expect(series[0].end).toBe("2025-09-30")

    for (const d of CANONICAL_DOMAINS) {
      expect(typeof series[0][d]).toBe("number")
      expect(Number(series[0][d])).toBeGreaterThanOrEqual(1)
      expect(Number(series[0][d])).toBeLessThanOrEqual(3)
    }
  })

  it("getDomainKeys returns all canonical domains", () => {
    expect(getDomainKeys()).toEqual(CANONICAL_DOMAINS)
  })

  it("calculateTrendDeltas calculates changes between last two periods", () => {
    const periodDists = computePeriodDistributions(DEMO_ROWS)
    const series = computeTrendSeries(periodDists)
    const deltas = calculateTrendDeltas(series)

    expect(deltas).toHaveLength(CANONICAL_DOMAINS.length)
    for (const delta of deltas) {
      expect(CANONICAL_DOMAINS).toContain(delta.domain)
      expect(typeof delta.current).toBe("number")
      expect(typeof delta.previous).toBe("number")
      expect(delta.delta).toBe(Number((delta.current - delta.previous).toFixed(2)))
    }
  })

  it("calculateTrendDeltas returns empty array if fewer than 2 periods", () => {
    const singleRow: AggregatedRow[] = [
      { period_start: "2025-01-01", period_end: "2025-01-31", domain: "Awareness", band: "emerging", count: 10 },
    ]
    const periodDists = computePeriodDistributions(singleRow)
    const series = computeTrendSeries(periodDists)
    expect(calculateTrendDeltas(series)).toEqual([])
  })
})

