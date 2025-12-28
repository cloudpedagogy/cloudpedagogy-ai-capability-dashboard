import { CANONICAL_BANDS, CANONICAL_DOMAINS, type AggregatedRow } from "./schema"

// Simple CSV parser (strict template; avoids quoting complexity)
export function parseCSV(text: string): AggregatedRow[] {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0)

  if (lines.length < 2) throw new Error("CSV has no data rows.")

  const headers = lines[0].split(",").map(h => h.trim())
  const required = ["period_start", "period_end", "domain", "band", "count"]
  for (const r of required) {
    if (!headers.includes(r)) throw new Error(`Missing required column: ${r}`)
  }

  const rows: AggregatedRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",").map(c => c.trim())
    const obj: any = {}
    headers.forEach((h, idx) => {
      obj[h] = cells[idx] ?? ""
    })

    obj.count = Number(obj.count)
    if (obj.context_tag === "") delete obj.context_tag
    if (obj.source === "") delete obj.source
    if (obj.notes === "") delete obj.notes

    if (!CANONICAL_DOMAINS.includes(obj.domain)) {
      throw new Error(`Invalid domain "${obj.domain}" on line ${i + 1}`)
    }
    if (!CANONICAL_BANDS.includes(obj.band)) {
      throw new Error(`Invalid band "${obj.band}" on line ${i + 1}`)
    }
    if (!Number.isFinite(obj.count) || obj.count < 0) {
      throw new Error(`Invalid count "${String(obj.count)}" on line ${i + 1}`)
    }

    rows.push(obj as AggregatedRow)
  }

  return rows
}
