export default function EmptyState(props: {
  onUseBaselineDemo: () => void
  onUseInterventionDemo: () => void
}) {
  return (
    <div
      style={{
        marginTop: 18,
        padding: 18,
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 16,
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 16 }}>
        Load an aggregate dataset to begin
      </div>

      <div style={{ marginTop: 8, opacity: 0.85 }}>
        No identifiers. No unit-level drilldown.
      </div>

      <div style={{ marginTop: 6, opacity: 0.85 }}>
        Upload aggregated CSV/JSON, or use a demo dataset.
      </div>

      <div style={{ marginTop: 6, opacity: 0.85 }}>
        Interpretation requires context and professional judgement.
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={props.onUseBaselineDemo}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        >
          Use baseline demo
        </button>

        <button
          onClick={props.onUseInterventionDemo}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        >
          Use intervention scenario
        </button>
      </div>

      <div style={{ marginTop: 12, fontSize: 13 }}>
        <div style={{ fontWeight: 650 }}>
          Why two demos?
        </div>

        <div style={{ marginTop: 6, opacity: 0.85 }}>
          These scenarios illustrate how different patterns of change can appear in the dashboard.
          Neither represents “good” or “bad” performance — they exist to support interpretation and discussion.
        </div>

        <div style={{ marginTop: 6, opacity: 0.8 }}>
          Baseline demo shows steady, incremental change. The intervention scenario shows uneven development
          (e.g. practice improves faster than governance).
        </div>
      </div>
    </div>
  )
}
