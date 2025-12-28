export type Domain =
  | "Awareness"
  | "Human–AI Co-Agency"
  | "Applied Practice & Innovation"
  | "Ethics, Equity & Impact"
  | "Decision-Making & Governance"
  | "Reflection, Learning & Renewal"

export type Band = "emerging" | "developing" | "embedded"

export type AggregatedRow = {
  period_start: string // YYYY-MM-DD
  period_end: string   // YYYY-MM-DD
  domain: Domain
  band: Band
  count: number
  context_tag?: string
  source?: string
  notes?: string
}

export type DatasetJSON = {
  schema_version: "1.0"
  generated_at?: string
  units?: "counts"
  rows: AggregatedRow[]
}

export const CANONICAL_DOMAINS: Domain[] = [
  "Awareness",
  "Human–AI Co-Agency",
  "Applied Practice & Innovation",
  "Ethics, Equity & Impact",
  "Decision-Making & Governance",
  "Reflection, Learning & Renewal",
]

export const CANONICAL_BANDS: Band[] = ["emerging", "developing", "embedded"]

export function validateRow(row: any): row is AggregatedRow {
  if (!row || typeof row !== "object") return false
  if (typeof row.period_start !== "string") return false
  if (typeof row.period_end !== "string") return false
  if (!CANONICAL_DOMAINS.includes(row.domain)) return false
  if (!CANONICAL_BANDS.includes(row.band)) return false
  if (typeof row.count !== "number" || !Number.isFinite(row.count) || row.count < 0) return false
  if (row.context_tag != null && typeof row.context_tag !== "string") return false
  if (row.source != null && typeof row.source !== "string") return false
  if (row.notes != null && typeof row.notes !== "string") return false
  return true
}

export function validateDatasetJson(obj: any): obj is DatasetJSON {
  if (!obj || typeof obj !== "object") return false
  if (obj.schema_version !== "1.0") return false
  if (!Array.isArray(obj.rows)) return false
  return obj.rows.every(validateRow)
}
