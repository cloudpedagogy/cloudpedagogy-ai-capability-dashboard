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

// Institutional monochrome palette
const BAND_COLOURS = {
  emerging: "#D1D5DB",
  developing: "#6B7280",
  embedded: "var(--color-text-primary)",
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
    <div style={{ display: "grid", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard label="Total count (N)" value={formatNumber(props.total)} />
        <StatCard label="Periods" value={formatNumber(props.periods)} />
        <StatCard label="Signals identified" value={formatNumber(props.signals.length)} />
      </div>

      {/* Chart Section */}
      <div className="cp-card" style={{ margin: 0, padding: 24 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 24 }}>Capability Profile (Aggregate)</h2>

        <div style={{ height: 400, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={props.dists}
              margin={{ top: 8, right: 16, left: 0, bottom: 40 }}
              barCategoryGap={24}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />

              <XAxis
                dataKey="domain"
                interval={0}
                tick={{ fontSize: 13, fill: "var(--color-text-secondary)" }}
                tickFormatter={axisTickFormatter}
                angle={-15}
                textAnchor="end"
                height={60}
                stroke="var(--color-border-default)"
              />

              <YAxis 
                tick={{ fontSize: 13, fill: "var(--color-text-secondary)" }} 
                allowDecimals={false} 
                stroke="var(--color-border-default)"
              />

              <Tooltip 
                formatter={tooltipValueFormatter} 
                labelFormatter={tooltipLabelFormatter}
                contentStyle={{ borderRadius: 4, border: "1px solid var(--color-border-default)", boxShadow: "none" }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 24 }}
                iconType="rect"
                formatter={(value) => {
                  const key = String(value) as keyof typeof BAND_LABELS
                  return <span className="text-small semibold" style={{ color: "#444444" }}>{BAND_LABELS[key] ?? String(value)}</span>
                }}
              />

              {/* Progression monochrome bands */}
              <Bar dataKey="emerging" stackId="a" fill={BAND_COLOURS.emerging} radius={[0, 0, 0, 0]} />
              <Bar dataKey="developing" stackId="a" fill={BAND_COLOURS.developing} radius={[0, 0, 0, 0]} />
              <Bar dataKey="embedded" stackId="a" fill={BAND_COLOURS.embedded} radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-muted text-small" style={{ marginTop: 24, marginBottom: 0 }}>
          Interpretive categories derived from aggregate scoring rules. This visualization represents system-level distributions.
        </p>
      </div>

      {/* Mode Status (Reflective/Descriptive) */}
      <div className="cp-card" style={{ margin: 0, background: props.reflective ? "#F9FAFB" : "transparent" }}>
        <div className="semibold text-small" style={{ marginBottom: 4 }}>
          Interpretation Mode: {props.reflective ? "Reflective" : "Descriptive"}
        </div>
        <div className="text-secondary text-small">
          {props.reflective
            ? "Reflective mode surfaces discussion prompts to support judgement and renewal (not performance measures)."
            : "Descriptive mode shows aggregate patterns only. Switch to Reflective mode to reveal discussion prompts."}
        </div>
      </div>

      {/* Signals Workspace */}
      <div className="cp-card" style={{ margin: 0, padding: 24 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 20 }}>Signals Workspace</h2>

        {props.signals.length === 0 ? (
          <div className="text-secondary text-small">
            No strong signals detected with current heuristics for this context.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {props.signals.map((s, idx) => (
              <div key={idx} style={{ padding: 16, border: "1px solid var(--color-border-default)", borderRadius: 6 }}>
                <div className="semibold">{s.statement}</div>
                <div className="text-secondary text-small" style={{ marginTop: 8 }}>
                  {props.reflective ? (
                    <div style={{ fontStyle: "italic", borderLeft: "2px solid #EEE", paddingLeft: 12 }}>
                      {s.prompt}
                    </div>
                  ) : (
                    <span className="text-muted">Descriptive mode: Discussion prompts are hidden.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {props.reflective && (
          <div style={{ marginTop: 20, padding: 12, border: "1px dashed var(--color-border-default)", background: "#FFF" }} className="text-small">
            <span className="semibold">Reminder:</span> These are signals for institutional discussion, not findings. 
            Interpret in context and avoid converting outputs into performance measures.
          </div>
        )}
      </div>
    </div>
  )
}
