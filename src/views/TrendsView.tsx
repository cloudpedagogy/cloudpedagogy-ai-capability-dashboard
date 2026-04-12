// src/views/TrendsView.tsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"
import type { AggregatedRow, Domain } from "../engine/schema"
import { computePeriodDistributions, computeTrendSeries, getDomainKeys, calculateTrendDeltas } from "../engine/trends"

type Props = {
  rows: AggregatedRow[]
}

// Sophisticated monochrome palette with stroke styles for distinction
const DOMAIN_STYLES: Record<string, { stroke: string; dash?: string }> = {
  "Awareness": { stroke: "var(--color-text-primary)" },
  "Human–AI Co-Agency": { stroke: "#444444" },
  "Applied Practice & Innovation": { stroke: "var(--color-text-secondary)" },
  "Ethics, Equity & Impact": { stroke: "var(--color-text-primary)", dash: "5 5" },
  "Decision-Making & Governance": { stroke: "#444444", dash: "5 5" },
  "Reflection, Learning & Renewal": { stroke: "var(--color-text-secondary)", dash: "5 5" },
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(n)
}

export default function TrendsView(props: Props) {
  const periodDists = computePeriodDistributions(props.rows)
  const series = computeTrendSeries(periodDists)
  const domains = getDomainKeys() as Domain[]
  const deltas = calculateTrendDeltas(series)

  if (periodDists.length < 2) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <h2 style={{ fontSize: "1.1rem" }}>Longitudinal Trends</h2>
        <div className="cp-card" style={{ margin: 0, padding: 24, borderStyle: "dashed" }}>
          <div className="semibold text-small">Insufficient Data for Trends</div>
          <p className="text-muted text-small" style={{ marginTop: 8, marginBottom: 0 }}>
            This dataset contains <b>{periodDists.length}</b> period. Longitudinal analysis becomes meaningful with <b>2 or more</b> distinct periods (e.g., monthly snapshots).
          </p>
        </div>
      </div>
    )
  }

  // Trajectory logic (descriptive only)
  const totalDelta = deltas.reduce((acc, d) => acc + d.delta, 0)
  const improvedCount = deltas.filter(d => d.delta > 0).length
  const regressedCount = deltas.filter(d => d.delta < 0).length

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Trend Insights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="cp-card cp-print-keep" style={{ margin: 0, padding: 20, background: "#f9fafb" }}>
          <div className="semibold text-small">Longitudinal Trajectory</div>
          <p className="text-secondary text-small" style={{ marginTop: 8, marginBottom: 0 }}>
            Across the last two periods, <b>{improvedCount}</b> domains showed score progression and <b>{regressedCount}</b> showed regression.
            The cumulative weighted index shift is <b>{totalDelta > 0 ? "+" : ""}{totalDelta.toFixed(2)}</b>.
          </p>
        </div>
        <div className="cp-card cp-print-keep" style={{ margin: 0, padding: 20 }}>
          <div className="text-small">
            {deltas.map(d => (
              <div key={d.domain} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span className="text-secondary" style={{ fontSize: 12 }}>{d.domain}</span>
                <span className="semibold" style={{ fontSize: 13, color: d.delta > 0 ? "#059669" : d.delta < 0 ? "#dc2626" : "#666" }}>
                  {d.delta > 0 ? "▲" : d.delta < 0 ? "▼" : "—"} {d.delta > 0 ? "+" : ""}{d.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cp-card" style={{ margin: 0, padding: 24 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 8 }}>Trends over Time (Weighted Index)</h2>
        <p className="text-secondary text-small" style={{ marginBottom: 24 }}>
          This index represents an aggregate signal across domains (Emerging=1, Developing=2, Embedded=3). 
          It supports system-level reflection over periods, not individual performance evaluation.
        </p>

        <div style={{ height: 440, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 10, right: 18, left: 0, bottom: 40 }}>
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
                domain={[1, 3]} 
                ticks={[1, 1.5, 2, 2.5, 3]} 
                tick={{ fontSize: 13, fill: "var(--color-text-secondary)" }} 
                stroke="var(--color-border-default)"
              />

              <Tooltip
                formatter={(value: any, name: any) => [formatNumber(Number(value)), String(name)]}
                labelFormatter={(label) => String(label)}
                contentStyle={{ borderRadius: 4, border: "1px solid var(--color-border-default)", boxShadow: "none" }}
              />

              <Legend 
                verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{ paddingTop: 32 }}
                iconType="plainline"
                formatter={(value) => <span className="text-small" style={{ color: "#444444" }}>{value}</span>}
              />

              {domains.map((d) => (
                <Line
                  key={d}
                  type="monotone"
                  dataKey={d}
                  dot={{ r: 3, fill: DOMAIN_STYLES[d]?.stroke ?? "#444", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  strokeWidth={2}
                  stroke={DOMAIN_STYLES[d]?.stroke ?? "#444"}
                  strokeDasharray={DOMAIN_STYLES[d]?.dash}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-muted text-small" style={{ marginTop: 32 }}>
          <span className="semibold">Note:</span> Shifts are normal in evolving institutions. Patterns become clearer across longer timeframes.
          As a privacy-preserving tool, no individual-level drilldown is available.
        </div>
      </div>
    </div>
  )
}
