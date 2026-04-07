// src/views/EmptyState.tsx
export default function EmptyState(props: {
  onUseBaselineDemo: () => void
  onUseInterventionDemo: () => void
}) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: "1.1rem", marginBottom: 8 }}>
        Institutional AI Capability Dashboard
      </h2>

      <div className="text-secondary" style={{ marginBottom: 24, fontSize: "var(--font-size-body)" }}>
        This tool provides aggregate, non-identifiable capability signals to support system-level reflection. 
        Load a dataset to begin your analysis.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginBottom: 32 }}>
        <div className="cp-card" style={{ margin: 0 }}>
          <h3 className="text-small semibold" style={{ marginBottom: 12 }}>Dataset Upload</h3>
          <p className="text-small text-muted">
            Upload your own aggregated CSV or JSON files. Ensure no identifiable data is included.
          </p>
          <div className="text-small text-muted" style={{ marginTop: 12 }}>
            Use the "Upload Dataset" button in the header above.
          </div>
        </div>

        <div className="cp-card" style={{ margin: 0 }}>
          <h3 className="text-small semibold" style={{ marginBottom: 12 }}>Demo Scenarios</h3>
          <p className="text-small text-muted">
            Explore the dashboard using pre-loaded institutional scenarios.
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="cp-button-secondary text-small" onClick={props.onUseBaselineDemo}>
              Baseline Demo
            </button>
            <button className="cp-button-secondary text-small" onClick={props.onUseInterventionDemo}>
              Intervention Scenario
            </button>
          </div>
        </div>
      </div>

      <div className="cp-card" style={{ background: "#F9FAFB", border: "none" }}>
        <h3 className="text-small semibold" style={{ marginBottom: 8 }}>Data Templates</h3>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }} className="text-small">
          <a href="/templates/ai-capability-dashboard-template.csv" download className="semibold">
            CSV Template
          </a>
          <a href="/templates/ai-capability-dashboard-example.csv" download className="semibold">
            Example CSV
          </a>
          <a href="/templates/ai-capability-dashboard-template.json" download className="semibold">
            JSON Template
          </a>
        </div>
        <div className="text-muted text-small" style={{ marginTop: 12 }}>
          Templates use aggregate counts only. Interpretation requires professional judgement and local context.
        </div>
      </div>
    </div>
  )
}
