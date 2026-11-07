// src/engine/parseCsv.ts
import { CANONICAL_DOMAINS, type Domain } from "./schema"

/**
 * CSV parser for this app.
 * Supports:
 * - Standard RFC-4180 quoted values
 * - Escaped double quotes
 * - CRLF and LF line endings
 * - Empty fields
 * - Canonical domain names containing commas
 * - Graceful handling of unquoted canonical domains from official templates
 * - Whitespace trimming
 */

export type CsvRow = Record<string, string>

function splitCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  fields.push(current.trim())
  return fields
}

export function parseCsv(text: string): CsvRow[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length < 2) return []

  const headers = splitCsvLine(lines[0])
  const domainIdx = headers.indexOf("domain")

  const rows: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    let cols = splitCsvLine(lines[i])

    // Handle template unquoted multi-word canonical domains with commas
    if (domainIdx !== -1 && cols.length === headers.length + 1) {
      const candidateDomain = `${cols[domainIdx]}, ${cols[domainIdx + 1]}`
      if (CANONICAL_DOMAINS.includes(candidateDomain as Domain)) {
        cols = [
          ...cols.slice(0, domainIdx),
          candidateDomain,
          ...cols.slice(domainIdx + 2),
        ]
      }
    }

    const row: CsvRow = {}

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = cols[j] ?? ""
    }

    rows.push(row)
  }

  return rows
}
