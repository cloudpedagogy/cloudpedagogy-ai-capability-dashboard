// src/views/DomainDetailView.tsx
import { useMemo, useState } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

import type { AggregatedRow, Domain, Band } from "../engine/schema"
import { CANONICAL_DOMAINS } from "../engine/schema"
import { computePeriodDistributions } from "../engine/trends"

type Props = {
  rows: AggregatedRow[]
  reflective: boolean
}

// Institutional monochrome palette
const BAND_COLOURS = {
  emerging: "#D1D5DB",
  developing: "#6B7280",
  embedded: "#111111",
} as const

const BAND_LABELS: Record<Band, string> = {
  emerging: "Emerging",
  developing: "Developing",
  embedded: "Embedded",
}

type DomainPeriodRow = {
  period: string
  start: string
  end: string
  emerging: number
  developing: number
  embedded: number
  total: number
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-GB").format(n)
}

export default function DomainDetailView(props: Props) {
  const [domain, setDomain] = useState<Domain>(CANONICAL_DOMAINS[0])

  const periodDists = useMemo(() => computePeriodDistributions(props.rows), [props.rows])

  const domainSeries: DomainPeriodRow[] = useMemo(() => {
    return periodDists.map(pd => {
      const dist = pd.dists.find(d => d.domain === domain)
      const emerging = dist?.emerging ?? 0
      const developing = dist?.developing ?? 0
      const embedded = dist?.embedded ?? 0
      const total = (dist?.total ?? 0)
      return {
        period: pd.period.label,
        start: pd.period.start,
        end: pd.period.end,
        emerging,
        developing,
        embedded,
        total,
      }
    })
  }, [periodDists, domain])

  const latest = domainSeries[domainSeries.length - 1] ?? null

  if (periodDists.length === 0) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: "1.1rem" }}>Domain Detail</h2>
        <div className="cp-card" style={{ margin: 0, padding: 24, borderStyle: "dashed" }}>
          <div className="text-secondary text-small">No aggregate data available for deeper analysis.</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Selector Section */}
      <div className="cp-card" style={{ margin: 0, padding: 24 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: "1.1rem", marginBottom: 4 }}>Domain Detail Breakdown</h2>
            <p className="text-muted text-small" style={{ margin: 0 }}>
              Analysis of capability distributions for a specific institutional domain.
            </p>
          </div>

          <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <span className="semibold text-small">Select Domain</span>
            <select 
              value={domain} 
              onChange={(e) => setDomain(e.target.value as Domain)}
              style={{ minWidth: 240 }}
            >
              {CANONICAL_DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
        {/* Latest Snapshot */}
        {latest && (
          <div className="cp-card" style={{ margin: 0, padding: 24 }}>
            <h3 className="text-small semibold" style={{ marginBottom: 4 }}>Latest Snapshot</h3>
            <div className="text-muted text-small" style={{ marginBottom: 20 }}>
              {latest.period} · N = {formatNumber(latest.total)} (Aggregated)
            </div>

            <div style={{ height: 160, marginTop: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[latest]}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 16, bottom: 0 }}
                >
                  <Tooltip
                    formatter={(value: any, name: any) => [formatNumber(Number(value)), BAND_LABELS[name as Band] ?? String(name)]}
                    contentStyle={{ borderRadius: 4, border: "1px solid var(--color-border-default)", boxShadow: "none" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="rect"
                    formatter={(value) => <span className="text-small semibold" style={{ color: "#444444" }}>{BAND_LABELS[value as Band] ?? String(value)}</span>}
                  />
                  <Bar dataKey="emerging" stackId="a" fill={BAND_COLOURS.emerging} />
                  <Bar dataKey="developing" stackId="a" fill={BAND_COLOURS.developing} />
                  <Bar dataKey="embedded" stackId="a" fill="var(--color-text-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {props.reflective && (
              <div style={{ marginTop: 24, padding: 16, background: "#F9FAFB", border: "1px solid var(--color-border-default)", borderRadius: 6 }}>
                <div className="semibold text-small" style={{ marginBottom: 12 }}>Reflective Prompts</div>
                <ul className="text-small text-secondary" style={{ paddingLeft: 20, margin: 0 }}>
                  <li style={{ marginBottom: 8 }}>What systemic factors might be shaping this distribution in {domain}?</li>
                  <li style={{ marginBottom: 8 }}>Where is capability currently limited and what support could shift it?</li>
                  <li>What would responsible scaling look like if embedded grows further?</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Trend Distribution */}
        <div className="cp-card" style={{ margin: 0, padding: 24 }}>
          <h3 className="text-small semibold" style={{ marginBottom: 4 }}>Distribution over Time</h3>
          <div className="text-muted text-small" style={{ marginBottom: 20 }}>
            Aggregated stacked counts per period for {domain}.
          </div>

          <div style={{ height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={domainSeries}
                margin={{ top: 10, right: 16, left: 0, bottom: 40 }}
                barCategoryGap={24}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />
                <XAxis 
                  dataKey="period" 
                  interval={0} 
                  angle={-15} 
                  textAnchor="end" 
                  height={60} 
                  tick={{ fontSize: 13, fill: "var(--color-text-secondary)" }} 
                  stroke="var(--color-border-default)"
                />
                <YAxis 
                   tick={{ fontSize: 13, fill: "var(--color-text-secondary)" }} 
                   allowDecimals={false} 
                   stroke="var(--color-border-default)"
                />
                <Tooltip
                  formatter={(value: any, name: any) => [formatNumber(Number(value)), BAND_LABELS[name as Band] ?? String(name)]}
                  labelFormatter={(label) => String(label)}
                  contentStyle={{ borderRadius: 4, border: "1px solid var(--color-border-default)", boxShadow: "none" }}
                />
                <Legend 
                  verticalAlign="bottom"
                  iconType="rect"
                  formatter={(value) => <span className="text-small semibold" style={{ color: "#444444" }}>{BAND_LABELS[value as Band] ?? String(value)}</span>} 
                />

                <Bar dataKey="emerging" stackId="a" fill={BAND_COLOURS.emerging} />
                <Bar dataKey="developing" stackId="a" fill={BAND_COLOURS.developing} />
                <Bar dataKey="embedded" stackId="a" fill="var(--color-text-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="text-muted text-small">
        <span className="semibold">Reminder:</span> Domain detail is aggregate and non-identifiable. This view is for institutional awareness, not monitoring.
      </div>
    </div>
  )
}
