import { describe, it, expect } from "vitest"
import { deriveSignals } from "./signals"
import { computeDomainDistributions } from "./aggregate"
import { DEMO_ROWS } from "../data/demo"
import { DEMO_UNEVEN_ROWS } from "../data/demo_uneven"
import type { DomainDistribution } from "./aggregate"

describe("signals", () => {
  it("generates expected signals for baseline demo dataset", () => {
    const dists = computeDomainDistributions(DEMO_ROWS)
    const signals = deriveSignals(dists)

    // Verify signals structure and types
    expect(signals.length).toBeGreaterThan(0)
    expect(signals.length).toBeLessThanOrEqual(6)

    for (const s of signals) {
      expect(["balance", "renewal", "ethics-load", "variance"]).toContain(s.type)
      expect(s.statement).toBeTruthy()
      expect(s.prompt).toBeTruthy()
    }
  })

  it("detects balance signal when Innovation outpaces Governance by >= 0.5", () => {
    const dists: DomainDistribution[] = [
      { domain: "Awareness", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Human–AI Co-Agency", emerging: 10, developing: 20, embedded: 10, total: 40 },
      // Innovation: (0 + 0 + 300) / 100 = 3.0
      { domain: "Applied Practice & Innovation", emerging: 0, developing: 0, embedded: 100, total: 100 },
      { domain: "Ethics, Equity & Impact", emerging: 10, developing: 20, embedded: 10, total: 40 },
      // Governance: (100 + 0 + 0) / 100 = 1.0 -> gap = 2.0 >= 0.5
      { domain: "Decision-Making & Governance", emerging: 100, developing: 0, embedded: 0, total: 100 },
      { domain: "Reflection, Learning & Renewal", emerging: 10, developing: 20, embedded: 10, total: 40 },
    ]

    const signals = deriveSignals(dists)
    const balance = signals.find((s) => s.type === "balance")
    expect(balance).toBeDefined()
    expect(balance?.statement).toContain("Applied Practice & Innovation appears to be developing faster than Decision-Making & Governance")
  })

  it("detects ethics-load signal when Innovation outpaces Ethics by >= 0.5", () => {
    const dists: DomainDistribution[] = [
      { domain: "Awareness", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Human–AI Co-Agency", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Applied Practice & Innovation", emerging: 0, developing: 0, embedded: 100, total: 100 },
      // Ethics: 1.0 -> gap = 2.0 >= 0.5
      { domain: "Ethics, Equity & Impact", emerging: 100, developing: 0, embedded: 0, total: 100 },
      { domain: "Decision-Making & Governance", emerging: 0, developing: 0, embedded: 100, total: 100 },
      { domain: "Reflection, Learning & Renewal", emerging: 10, developing: 20, embedded: 10, total: 40 },
    ]

    const signals = deriveSignals(dists)
    const ethicsLoad = signals.find((s) => s.type === "ethics-load")
    expect(ethicsLoad).toBeDefined()
    expect(ethicsLoad?.statement).toContain("Innovation may be outpacing Ethics, Equity & Impact capacity")
  })

  it("detects renewal signal when embedded < 0.2 and emerging > 0.35", () => {
    const dists: DomainDistribution[] = [
      { domain: "Awareness", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Human–AI Co-Agency", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Applied Practice & Innovation", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Ethics, Equity & Impact", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Decision-Making & Governance", emerging: 10, developing: 20, embedded: 10, total: 40 },
      // Renewal: emerging = 50%, embedded = 10%
      { domain: "Reflection, Learning & Renewal", emerging: 50, developing: 40, embedded: 10, total: 100 },
    ]

    const signals = deriveSignals(dists)
    const renewal = signals.find((s) => s.type === "renewal")
    expect(renewal).toBeDefined()
    expect(renewal?.statement).toContain("Reflection, Learning & Renewal shows a higher ‘emerging’ share")
  })

  it("detects variance signal when embedded difference across domains >= 0.25", () => {
    const dists: DomainDistribution[] = [
      { domain: "Awareness", emerging: 0, developing: 0, embedded: 100, total: 100 }, // embedded = 1.0
      { domain: "Human–AI Co-Agency", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Applied Practice & Innovation", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Ethics, Equity & Impact", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Decision-Making & Governance", emerging: 10, developing: 20, embedded: 10, total: 40 },
      { domain: "Reflection, Learning & Renewal", emerging: 100, developing: 0, embedded: 0, total: 100 }, // embedded = 0.0
    ]

    const signals = deriveSignals(dists)
    const variance = signals.find((s) => s.type === "variance")
    expect(variance).toBeDefined()
    expect(variance?.statement).toContain("Embedded capability varies noticeably across domains")
  })

  it("processes uneven scenario demo without error", () => {
    const dists = computeDomainDistributions(DEMO_UNEVEN_ROWS)
    const signals = deriveSignals(dists)
    expect(signals.length).toBeGreaterThan(0)
  })
})

