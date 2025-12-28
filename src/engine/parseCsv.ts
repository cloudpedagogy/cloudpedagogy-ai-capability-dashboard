// src/engine/parseCsv.ts

/**
 * Very small CSV parser for this app.
 * Assumptions:
 * - First row is headers
 * - Commas separate fields (no quoted commas support)
 * - Trims whitespace
 *
 * This is sufficient for the dashboard template format.
 */

export type CsvRow = Record<string, string>

export function parseCsv(text: string): CsvRow[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim())

  const rows: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim())
    const row: CsvRow = {}

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cols[j] ?? ""
    }

    rows.push(row)
  }

  return rows
}
