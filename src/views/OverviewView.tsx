// src/views/OverviewView.tsx
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
import type { DomainDistribution } from "../engine/aggregate"
import type { Signal } from "../engine/signals"
import StatCard from "../components/StatCard"

type Props = {
  dists: DomainDistribution[]
  total: number
  periods: number
  signals: Signal[]
  reflective: boolean
}

// Calm, non-KPI palette; explicitly set to avoid “all black”
const BAND_COLOURS = {
  emerging: "#E0B44C",
  developing: "#6FA8DC",
  embedded: "#6AA84F",
} as const

const BAND_LABELS: Record<keyof typeof BAND_COLOURS, string> = {
  emerging: "Emerging",
  developing: "Developing",
  embedded: "Embedded",
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-GB").format(n)
}

function axisTickFormatter(value: any) {
  const s = String(value)
  if (s.length <= 18) return s
  return s.slice(0, 18) + "…"
}

function tooltipLabelFormatter(label: any) {
  return String(label)
}

function tooltipValueFormatter(value: any, name: any) {
  const key = String(name) as keyof typeof BAND_LABELS
  const label = BAND_LABELS[key] ?? String(name)
  return [formatNumber(Number(value)), label]
}

export default function OverviewView(props: Props) {
  return (
    <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        <StatCard label="Total count (N)" value={formatNumber(props.total)} />
        <StatCard label="Periods" value={formatNumber(props.periods)} />
        <StatCard label="Signals shown" value={formatNumber(props.signals.length)} />
      </div>

      {/* Chart */}
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ fontWeight: 700 }}>Capability profile (aggregate)</div>

        <div style={{ height: 380, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={props.dists}
              margin={{ top: 8, right: 16, left: 8, bottom: 40 }}
              barCategoryGap={18}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

              <XAxis
                dataKey="domain"
                interval={0}
                tick={{ fontSize: 12 }}
                tickFormatter={axisTickFormatter}
                angle={-12}
                textAnchor="end"
                height={60}
              />

              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />

              <Tooltip formatter={tooltipValueFormatter} labelFormatter={tooltipLabelFormatter} />

              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 8 }}
                formatter={(value) => {
                  const key = String(value) as keyof typeof BAND_LABELS
                  return BAND_LABELS[key] ?? String(value)
                }}
              />

              {/* Progression bottom→top; explicit fills fix legend colours */}
              <Bar dataKey="emerging" stackId="a" fill={BAND_COLOURS.emerging} />
              <Bar dataKey="developing" stackId="a" fill={BAND_COLOURS.developing} />
              <Bar dataKey="embedded" stackId="a" fill={BAND_COLOURS.embedded} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: 8, opacity: 0.8, fontSize: 13 }}>
          Bands are interpretive categories derived from aggregate scoring rules.
        </div>

        {/* ✅ Make Interpretation visibly change even if user doesn’t scroll to Signals */}
        <div style={{ marginTop: 10, padding: 12, border: "1px dashed rgba(0,0,0,0.25)", borderRadius: 12 }}>
          <div style={{ fontWeight: 650 }}>
            Interpretation mode: {props.reflective ? "Reflective" : "Descriptive"}
          </div>
          <div style={{ opacity: 0.85, marginTop: 6 }}>
            {props.reflective
              ? "Reflective mode surfaces discussion prompts to support judgement and renewal (not performance measures)."
              : "Descriptive mode shows patterns only. Switch to Reflective mode to reveal discussion prompts."}
          </div>
        </div>
      </div>

      {/* Signals */}
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ fontWeight: 700 }}>Signals to notice</div>

        {props.signals.length === 0 ? (
          <div style={{ marginTop: 8, opacity: 0.85 }}>
            No strong signals detected with current heuristics. (This is normal for small or balanced datasets.)
          </div>
        ) : (
          <ul style={{ marginTop: 10, paddingLeft: 18 }}>
            {props.signals.map((s, idx) => (
              <li key={idx} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 650 }}>{s.statement}</div>
                <div style={{ opacity: 0.85 }}>
                  {props.reflective ? s.prompt : "Switch to Reflective mode to see prompts."}
                </div>
              </li>
            ))}
          </ul>
        )}

        {props.reflective && (
          <div style={{ marginTop: 10, padding: 12, border: "1px dashed rgba(0,0,0,0.25)", borderRadius: 12 }}>
            <div style={{ fontWeight: 650 }}>Reminder</div>
            <div style={{ opacity: 0.85, marginTop: 6 }}>
              These are signals for discussion, not findings. Interpret in context and avoid converting outputs into performance measures.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
