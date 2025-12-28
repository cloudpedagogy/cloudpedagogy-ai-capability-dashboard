import { CANONICAL_DOMAINS, type AggregatedRow, type Band, type Domain } from "./schema"

export type DatasetSummary = {
  total_count: number
  periods: { start: string; end: string }[]
  contexts: string[]
}

export function summariseDataset(rows: AggregatedRow[]): DatasetSummary {
  const total_count = rows.reduce((acc, r) => acc + r.count, 0)

  const periodMap = new Map<string, { start: string; end: string }>()
  const contextSet = new Set<string>()

  for (const r of rows) {
    const key = `${r.period_start}__${r.period_end}`
    if (!periodMap.has(key)) periodMap.set(key, { start: r.period_start, end: r.period_end })
    if (r.context_tag) contextSet.add(r.context_tag)
  }

  const periods = Array.from(periodMap.values()).sort((a, b) => a.start.localeCompare(b.start))
  const contexts = Array.from(contextSet.values()).sort()

  return { total_count, periods, contexts }
}

export type DomainDistribution = {
  domain: Domain
  emerging: number
  developing: number
  embedded: number
  total: number
}

export function computeDomainDistributions(rows: AggregatedRow[]): DomainDistribution[] {
  const init = (): DomainDistribution[] =>
    CANONICAL_DOMAINS.map(d => ({ domain: d, emerging: 0, developing: 0, embedded: 0, total: 0 }))

  const byDomain = new Map<Domain, DomainDistribution>()
  for (const d of init()) byDomain.set(d.domain, d)

  for (const r of rows) {
    const agg = byDomain.get(r.domain)!
    agg[r.band] += r.count
    agg.total += r.count
  }

  return CANONICAL_DOMAINS.map(d => byDomain.get(d)!)
}

export function bandShare(dist: DomainDistribution, band: Band): number {
  if (dist.total === 0) return 0
  return dist[band] / dist.total
}

// A simple “index” for trend/summary if needed later
export function bandWeightedIndex(dist: DomainDistribution): number {
  if (dist.total === 0) return 0
  const w = (dist.emerging * 1 + dist.developing * 2 + dist.embedded * 3) / dist.total
  return Number(w.toFixed(2))
}
