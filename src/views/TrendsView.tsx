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
import { computePeriodDistributions, computeTrendSeries, getDomainKeys } from "../engine/trends"

type Props = {
  rows: AggregatedRow[]
}

// Fixed, consistent domain colours (improves readability + consistency across the app)
const DOMAIN_COLOURS: Record<string, string> = {
  "Awareness": "#1f77b4",
  "Human–AI Co-Agency": "#9467bd",
  "Applied Practice & Innovation": "#2ca02c",
  "Ethics, Equity & Impact": "#ff7f0e",
  "Decision-Making & Governance": "#d62728",
  "Reflection, Learning & Renewal": "#17becf",
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(n)
}

export default function TrendsView(props: Props) {
  const periodDists = computePeriodDistributions(props.rows)
  const series = computeTrendSeries(periodDists)
  const domains = getDomainKeys() as Domain[]

  if (periodDists.length < 2) {
    return (
      <div style={{ marginTop: 14, padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ fontWeight: 700 }}>Trends</div>
        <div style={{ opacity: 0.85, marginTop: 8 }}>
          This dataset contains <b>{periodDists.length}</b> period. Trendlines become meaningful with <b>2+</b> periods.
        </div>
        <div style={{ opacity: 0.85, marginTop: 10 }}>
          To use Trends, upload aggregate data across multiple periods (e.g., monthly snapshots).
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ fontWeight: 700 }}>Trends over time (band-weighted index)</div>
        <div style={{ opacity: 0.85, marginTop: 6 }}>
          This index is a simple aggregate signal (Emerging=1, Developing=2, Embedded=3). It is descriptive, not evaluative.
        </div>
        <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
          Note: subtle shifts are normal in real organisations. Trends become clearer across longer timeframes or after major interventions.
        </div>

        <div style={{ height: 440, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 10, right: 18, left: 8, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis
                dataKey="period"
                interval={0}
                angle={-10}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[1, 3]} ticks={[1, 1.5, 2, 2.5, 3]} tick={{ fontSize: 12 }} />

              <Tooltip
                formatter={(value: any, name: any) => [formatNumber(Number(value)), String(name)]}
                labelFormatter={(label) => String(label)}
              />

              <Legend />

              {domains.map((d) => (
                <Line
                  key={d}
                  type="monotone"
                  dataKey={d}
                  dot={false}
                  strokeWidth={2}
                  stroke={DOMAIN_COLOURS[d] ?? "#444"}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: 8, opacity: 0.8, fontSize: 13 }}>
          Reminder: As a static, privacy-preserving tool, this view shows aggregate patterns only. No drilldown is available.
        </div>
      </div>
    </div>
  )
}
