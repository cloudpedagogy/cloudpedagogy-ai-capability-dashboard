import { type DomainDistribution, bandShare, bandWeightedIndex } from "./aggregate"

export type Signal = {
  type: "balance" | "renewal" | "ethics-load" | "variance"
  statement: string
  prompt: string
}

function find(dist: DomainDistribution[], domain: string) {
  return dist.find(d => d.domain === domain)
}

export function deriveSignals(dist: DomainDistribution[]): Signal[] {
  const signals: Signal[] = []

  const innovation = find(dist, "Applied Practice & Innovation")
  const governance = find(dist, "Decision-Making & Governance")
  const ethics = find(dist, "Ethics, Equity & Impact")
  const renewal = find(dist, "Reflection, Learning & Renewal")

  if (innovation && governance) {
    const gap = bandWeightedIndex(innovation) - bandWeightedIndex(governance)
    if (gap >= 0.5) {
      signals.push({
        type: "balance",
        statement: "Applied Practice & Innovation appears to be developing faster than Decision-Making & Governance.",
        prompt: "What governance scaffolds are needed to keep pace with innovation without restricting responsible experimentation?",
      })
    }
  }

  if (innovation && ethics) {
    const gap = bandWeightedIndex(innovation) - bandWeightedIndex(ethics)
    if (gap >= 0.5) {
      signals.push({
        type: "ethics-load",
        statement: "Innovation may be outpacing Ethics, Equity & Impact capacity.",
        prompt: "Where might ethical review, equity checks, or stakeholder consultation need strengthening to match current adoption?",
      })
    }
  }

  if (renewal) {
    const embedded = bandShare(renewal, "embedded")
    const emerging = bandShare(renewal, "emerging")
    if (embedded < 0.2 && emerging > 0.35) {
      signals.push({
        type: "renewal",
        statement: "Reflection, Learning & Renewal shows a higher ‘emerging’ share than other domains.",
        prompt: "What routines (retrospectives, learning loops, documentation practices) would make renewal more systematic over the next cycle?",
      })
    }
  }

  // Simple variance signal: big spread between embedded shares across domains
  const embeddedShares = dist.map(d => ({ domain: d.domain, embedded: bandShare(d, "embedded") }))
  const maxE = Math.max(...embeddedShares.map(x => x.embedded))
  const minE = Math.min(...embeddedShares.map(x => x.embedded))
  if (maxE - minE >= 0.25) {
    signals.push({
      type: "variance",
      statement: "Embedded capability varies noticeably across domains (uneven maturity).",
      prompt: "Which domain is lagging, and what conditions (resources, leadership, policy, support) might explain the uneven pattern?",
    })
  }

  return signals.slice(0, 6)
}
