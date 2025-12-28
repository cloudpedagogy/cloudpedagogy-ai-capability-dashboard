import { CANONICAL_DOMAINS, type Domain, type AggregatedRow } from "./schema"
import { computeDomainDistributions, bandWeightedIndex, type DomainDistribution } from "./aggregate"

export type PeriodKey = string // "YYYY-MM-DD__YYYY-MM-DD"

export type PeriodInfo = {
  key: PeriodKey
  start: string
  end: string
  label: string // e.g. "2025-10-01 → 2025-10-31"
}

export type PeriodDistribution = {
  period: PeriodInfo
  dists: DomainDistribution[]
}

export type TrendPoint = {
  period: string // label
  start: string
  end: string
  // domain indexes added dynamically
  [domain: string]: string | number
}

function periodKey(r: AggregatedRow): PeriodKey {
  return `${r.period_start}__${r.period_end}`
}

function periodLabel(start: string, end: string) {
  return `${start} → ${end}`
}

/**
 * Groups rows by (period_start, period_end) and computes per-domain distributions for each period.
 */
export function computePeriodDistributions(rows: AggregatedRow[]): PeriodDistribution[] {
  const map = new Map<PeriodKey, AggregatedRow[]>()

  for (const r of rows) {
    const key = periodKey(r)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(r)
  }

  const periods: PeriodDistribution[] = Array.from(map.entries())
    .map(([key, group]) => {
      const start = group[0]?.period_start ?? ""
      const end = group[0]?.period_end ?? ""
      const info: PeriodInfo = { key, start, end, label: periodLabel(start, end) }
      return { period: info, dists: computeDomainDistributions(group) }
    })
    .sort((a, b) => a.period.start.localeCompare(b.period.start))

  return periods
}

/**
 * Creates a Recharts-friendly dataset:
 * [
 *   { period:"2025-09-01 → 2025-09-30", Awareness:2.1, "Human–AI Co-Agency":1.8, ... },
 *   ...
 * ]
 */
export function computeTrendSeries(periodDists: PeriodDistribution[]): TrendPoint[] {
  return periodDists.map(pd => {
    const point: TrendPoint = {
      period: pd.period.label,
      start: pd.period.start,
      end: pd.period.end,
    }

    for (const d of CANONICAL_DOMAINS) {
      const dist = pd.dists.find(x => x.domain === d)
      point[d] = dist ? bandWeightedIndex(dist) : 0
    }

    return point
  })
}

/**
 * Helpful for legend/tooltip ordering and picking lines to show.
 */
export function getDomainKeys(): Domain[] {
  return [...CANONICAL_DOMAINS]
}
