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
    <div 
      style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 24, 
        alignItems: "center", 
        justifyContent: "space-between" 
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <span className="semibold text-small">View</span>
          <select
            value={props.viewMode}
            onChange={(e) => props.setViewMode(e.target.value as ViewMode)}
          >
            <option value="overview">Overview</option>
            <option value="trends">Trends</option>
            <option value="domain">Domain detail</option>
            <option value="signals">Signals</option>
          </select>
        </div>

        <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
          <span className="semibold text-small">Interpretation</span>
          <select
            value={props.interpretation}
            onChange={(e) => props.setInterpretation(e.target.value as Interpretation)}
          >
            <option value="descriptive">Descriptive</option>
            <option value="reflective">Reflective</option>
          </select>
        </div>

        {showContext && (
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <span className="semibold text-small">Context</span>
            <select value={props.context} onChange={(e) => props.setContext(e.target.value)}>
              <option value="">All Contexts</option>
              {props.contexts.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="text-small text-muted">{props.integrityText}</div>
    </div>
  )
}
