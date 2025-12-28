import type { AggregatedRow } from "../engine/schema"

export const DEMO_UNEVEN_ROWS: AggregatedRow[] = [
  // ─────────────────────────────
  // Period 1 — Baseline
  // ─────────────────────────────
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Awareness", band: "emerging", count: 120, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Awareness", band: "developing", count: 210, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Awareness", band: "embedded", count: 90, context_tag: "education" },

  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Human–AI Co-Agency", band: "emerging", count: 160, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Human–AI Co-Agency", band: "developing", count: 190, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Human–AI Co-Agency", band: "embedded", count: 70, context_tag: "education" },

  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Applied Practice & Innovation", band: "emerging", count: 180, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Applied Practice & Innovation", band: "developing", count: 170, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Applied Practice & Innovation", band: "embedded", count: 70, context_tag: "education" },

  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Ethics, Equity & Impact", band: "emerging", count: 200, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Ethics, Equity & Impact", band: "developing", count: 160, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Ethics, Equity & Impact", band: "embedded", count: 60, context_tag: "education" },

  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Decision-Making & Governance", band: "emerging", count: 230, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Decision-Making & Governance", band: "developing", count: 150, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Decision-Making & Governance", band: "embedded", count: 40, context_tag: "education" },

  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Reflection, Learning & Renewal", band: "emerging", count: 210, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Reflection, Learning & Renewal", band: "developing", count: 150, context_tag: "education" },
  { period_start: "2025-09-01", period_end: "2025-09-30", domain: "Reflection, Learning & Renewal", band: "embedded", count: 60, context_tag: "education" },

  // ─────────────────────────────
  // Period 2 — Post-intervention
  // ─────────────────────────────
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Awareness", band: "emerging", count: 90, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Awareness", band: "developing", count: 220, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Awareness", band: "embedded", count: 110, context_tag: "education" },

  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Human–AI Co-Agency", band: "emerging", count: 130, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Human–AI Co-Agency", band: "developing", count: 210, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Human–AI Co-Agency", band: "embedded", count: 80, context_tag: "education" },

  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Applied Practice & Innovation", band: "emerging", count: 90, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Applied Practice & Innovation", band: "developing", count: 210, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Applied Practice & Innovation", band: "embedded", count: 120, context_tag: "education" },

  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Ethics, Equity & Impact", band: "emerging", count: 170, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Ethics, Equity & Impact", band: "developing", count: 180, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Ethics, Equity & Impact", band: "embedded", count: 70, context_tag: "education" },

  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Decision-Making & Governance", band: "emerging", count: 220, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Decision-Making & Governance", band: "developing", count: 160, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Decision-Making & Governance", band: "embedded", count: 40, context_tag: "education" },

  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Reflection, Learning & Renewal", band: "emerging", count: 140, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Reflection, Learning & Renewal", band: "developing", count: 190, context_tag: "education" },
  { period_start: "2025-10-01", period_end: "2025-10-31", domain: "Reflection, Learning & Renewal", band: "embedded", count: 90, context_tag: "education" },
]
