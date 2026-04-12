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
  ReferenceLine,
} from "recharts"
import { type DomainDistribution, identifyGaps, computeDatasetAverageIndex } from "../engine/aggregate"
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
  emerging: "Low",
  developing: "Developing",
  embedded: "Strong",
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
  const avgIndex = computeDatasetAverageIndex(props.dists)
  const gaps = identifyGaps(props.dists)

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Insight Layer: Gaps & Benchmarks */}
      {gaps.length > 0 && (
        <div className="cp-card cp-print-keep" style={{ margin: 0, padding: 20, borderLeft: "4px solid #111111", background: "#f9fafb" }}>
          <div className="semibold" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "1.2rem" }}>⚠</span> Capability Maturity Gaps
          </div>
          <p className="text-secondary text-small" style={{ marginTop: 8, marginBottom: 0 }}>
            The following domains are currently performing more than 15% below the active dataset average index (avg = {avgIndex}):
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {gaps.map(g => (
                <span key={g} className="text-small semibold" style={{ padding: "4px 10px", background: "#EEE", borderRadius: 4 }}>{g}</span>
              ))}
            </div>
          </p>
        </div>
      )}

      {/* Key Insights Panel */}
      <div className="cp-card cp-print-keep" style={{ margin: 0, padding: 20, borderLeft: "4px solid var(--color-text-primary)", background: "#ffffff" }}>
        <h3 className="semibold" style={{ fontSize: "0.9rem", marginBottom: 12 }}>Institutional Insights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {(() => {
            const domainScores = props.dists.map(d => ({
              domain: d.domain,
              weighted: (d.embedded * 3 + d.developing * 2 + d.emerging * 1) / (d.embedded + d.developing + d.emerging || 1)
            })).sort((a, b) => b.weighted - a.weighted);
            
            const strongest = domainScores[0];
            const weakest = domainScores[domainScores.length - 1];

            return (
              <>
                <div style={{ padding: 12, border: "1px solid #f3f4f6", borderRadius: 4 }}>
                  <div className="text-muted text-small semibold uppercase tracking-wider">Strongest Domain</div>
                  <div className="semibold" style={{ marginTop: 4 }}>{strongest.domain}</div>
                </div>
                <div style={{ padding: 12, border: "1px solid #f3f4f6", borderRadius: 4 }}>
                  <div className="text-muted text-small semibold uppercase tracking-wider">Weakest Domain</div>
                  <div className="semibold" style={{ marginTop: 4 }}>{weakest.domain}</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

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

              {/* Dataset Benchmark Line (Average Count/Scale approximation for distribution view) */}
              {/* Note: ReferenceLines in stacked bars compare against stack totals. 
                  In this view, we want to show the 'average' height as a target. */}
              <ReferenceLine 
                y={props.total / props.dists.length} 
                stroke="#111" 
                strokeDasharray="3 3" 
                label={{ position: 'top', value: 'Avg distribution', fill: '#111', fontSize: 11, fontWeight: 600 }} 
              />
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
