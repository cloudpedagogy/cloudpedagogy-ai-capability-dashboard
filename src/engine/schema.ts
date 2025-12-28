// src/engine/schema.ts

export type Band = "emerging" | "developing" | "embedded"

export type Domain =
  | "Awareness"
  | "Human–AI Co-Agency"
  | "Applied Practice & Innovation"
  | "Ethics, Equity & Impact"
  | "Decision-Making & Governance"
  | "Reflection, Learning & Renewal"

export const CANONICAL_DOMAINS: Domain[] = [
  "Awareness",
  "Human–AI Co-Agency",
  "Applied Practice & Innovation",
  "Ethics, Equity & Impact",
  "Decision-Making & Governance",
  "Reflection, Learning & Renewal",
]

export type AggregatedRow = {
  period_start: string
  period_end: string
  domain: Domain
  band: Band
  count: number
  context_tag?: string
}

/**
 * Parse and validate uploaded aggregate rows (CSV or JSON).
 * This enforces:
 * - known domains
 * - valid bands
 * - numeric counts
 * - no identifiers
 */
export function parseAggregatedRows(input: any[]): AggregatedRow[] {
  if (!Array.isArray(input)) {
    throw new Error("Uploaded data must be an array of rows.")
  }

  const rows: AggregatedRow[] = []

  for (const r of input) {
    if (!r) continue

    const row: AggregatedRow = {
      period_start: String(r.period_start ?? "").trim(),
      period_end: String(r.period_end ?? "").trim(),
      domain: r.domain as Domain,
      band: r.band as Band,
      count: Number(r.count),
      context_tag: r.context_tag ? String(r.context_tag).trim() : undefined,
    }

    if (!row.period_start || !row.period_end) {
      throw new Error("Each row must include period_start and period_end.")
    }

    if (!CANONICAL_DOMAINS.includes(row.domain)) {
      throw new Error(`Unknown domain value: "${r.domain}"`)
    }

    if (!["emerging", "developing", "embedded"].includes(row.band)) {
      throw new Error(`Invalid band value: "${r.band}"`)
    }

    if (!Number.isFinite(row.count) || row.count < 0) {
      throw new Error(`Invalid count value: "${r.count}"`)
    }

    rows.push(row)
  }

  if (rows.length === 0) {
    throw new Error("No valid rows found in uploaded file.")
  }

  return rows
}
