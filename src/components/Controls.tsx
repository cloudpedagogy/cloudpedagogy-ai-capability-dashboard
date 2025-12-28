// src/components/Controls.tsx
export type ViewMode = "overview" | "trends" | "domain" | "signals"
export type Interpretation = "descriptive" | "reflective"

type Props = {
  viewMode: ViewMode
  setViewMode: (v: ViewMode) => void
  interpretation: Interpretation
  setInterpretation: (v: Interpretation) => void
  contexts: string[]
  context: string
  setContext: (v: string) => void
  integrityText: string
}

export default function Controls(props: Props) {
  const showContext = props.contexts.length > 1 // ✅ avoid “All vs education” no-op confusion

  return (
    <div style={{ marginTop: 18, padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontWeight: 650 }}>View</span>
            <select
              value={props.viewMode}
              onChange={(e) => props.setViewMode(e.target.value as ViewMode)}
            >
              <option value="overview">Overview</option>
              <option value="trends">Trends</option>
              <option value="domain">Domain detail</option>
              <option value="signals">Signals</option>
            </select>
          </label>

          <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontWeight: 650 }}>Interpretation</span>
            <select
              value={props.interpretation}
              onChange={(e) => props.setInterpretation(e.target.value as Interpretation)}
            >
              <option value="descriptive">Descriptive</option>
              <option value="reflective">Reflective</option>
            </select>
          </label>

          {showContext && (
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 650 }}>Context</span>
              <select value={props.context} onChange={(e) => props.setContext(e.target.value)}>
                <option value="">All</option>
                {props.contexts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <div style={{ opacity: 0.85 }}>{props.integrityText}</div>
      </div>
    </div>
  )
}
