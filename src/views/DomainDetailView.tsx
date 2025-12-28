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

const BAND_COLOURS = {
  emerging: "#E0B44C",
  developing: "#6FA8DC",
  embedded: "#6AA84F",
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
      <div style={{ marginTop: 14, padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ fontWeight: 700 }}>Domain detail</div>
        <div style={{ opacity: 0.85, marginTop: 8 }}>
          No data available for Domain detail.
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
      {/* Header + selector */}
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700 }}>Domain detail</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              Distribution by period for the selected domain (aggregate only).
            </div>
          </div>

          <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontWeight: 650 }}>Domain</span>
            <select value={domain} onChange={(e) => setDomain(e.target.value as Domain)}>
              {CANONICAL_DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Latest snapshot */}
      {latest && (
        <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
          <div style={{ fontWeight: 700 }}>Latest snapshot</div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            {latest.period} · N = {formatNumber(latest.total)}
          </div>

          <div style={{ height: 120, marginTop: 10 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[latest]}
                layout="vertical"
                margin={{ top: 10, right: 16, left: 16, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="period" hide />
                <Tooltip
                  formatter={(value: any, name: any) => [formatNumber(Number(value)), BAND_LABELS[name as Band] ?? String(name)]}
                />
                <Legend
                  formatter={(value) => BAND_LABELS[value as Band] ?? String(value)}
                />
                <Bar dataKey="emerging" stackId="a" fill={BAND_COLOURS.emerging} />
                <Bar dataKey="developing" stackId="a" fill={BAND_COLOURS.developing} />
                <Bar dataKey="embedded" stackId="a" fill={BAND_COLOURS.embedded} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {props.reflective && (
            <div style={{ marginTop: 10, padding: 12, border: "1px dashed rgba(0,0,0,0.25)", borderRadius: 12 }}>
              <div style={{ fontWeight: 650 }}>Reflective prompts</div>
              <ul style={{ marginTop: 8, marginBottom: 0, opacity: 0.85, paddingLeft: 18 }}>
                <li>What factors might be shaping this distribution in {domain}?</li>
                <li>Where is capability “stuck” (emerging) and what support could shift it?</li>
                <li>What would responsible scaling look like if embedded grows further?</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Trend distribution by period */}
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ fontWeight: 700 }}>Distribution over time</div>
        <div style={{ opacity: 0.85, marginTop: 6 }}>
          Stacked counts per period for {domain}. (Use multiple periods to see meaningful change.)
        </div>

        <div style={{ height: 420, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={domainSeries}
              margin={{ top: 10, right: 16, left: 8, bottom: 40 }}
              barCategoryGap={18}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis dataKey="period" interval={0} angle={-10} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: any, name: any) => [formatNumber(Number(value)), BAND_LABELS[name as Band] ?? String(name)]}
                labelFormatter={(label) => String(label)}
              />
              <Legend formatter={(value) => BAND_LABELS[value as Band] ?? String(value)} />

              <Bar dataKey="emerging" stackId="a" fill={BAND_COLOURS.emerging} />
              <Bar dataKey="developing" stackId="a" fill={BAND_COLOURS.developing} />
              <Bar dataKey="embedded" stackId="a" fill={BAND_COLOURS.embedded} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: 8, opacity: 0.8, fontSize: 13 }}>
          Reminder: this tool supports awareness, not monitoring. Domain detail is aggregate and non-identifiable.
        </div>
      </div>
    </div>
  )
}
