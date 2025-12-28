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
        Upload aggregated CSV or JSON, or use a demo dataset.
      </div>

      <div style={{ marginTop: 6, opacity: 0.85 }}>
        Interpretation requires context and professional judgement.
      </div>

      {/* ───────── Demo buttons ───────── */}
      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={props.onUseBaselineDemo}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.2)",
            cursor: "pointer",
            background: "transparent",
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
            background: "transparent",
          }}
        >
          Use intervention scenario
        </button>
      </div>

      {/* ───────── Demo explanation ───────── */}
      <div style={{ marginTop: 12, fontSize: 13 }}>
        <div style={{ fontWeight: 650 }}>
          Why two demos?
        </div>

        <div style={{ marginTop: 6, opacity: 0.85 }}>
          These scenarios illustrate how different patterns of change can appear in the dashboard.
          Neither represents “good” or “bad” performance — they exist to support interpretation and discussion.
        </div>

        <div style={{ marginTop: 6, opacity: 0.8 }}>
          The baseline demo shows steady, incremental change. The intervention scenario shows uneven development
          (for example, applied practice improving faster than governance).
        </div>
      </div>

      {/* ───────── Templates ───────── */}
      <div style={{ marginTop: 14, fontSize: 13, opacity: 0.9 }}>
        <div style={{ fontWeight: 650 }}>
          Templates for uploading your own data
        </div>

        <div
          style={{
            marginTop: 6,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <a
            href="/templates/ai-capability-dashboard-template.csv"
            download
          >
            Download CSV template
          </a>

          <a
            href="/templates/ai-capability-dashboard-example.csv"
            download
          >
            Download example CSV
          </a>

          <a
            href="/templates/ai-capability-dashboard-template.json"
            download
          >
            Download JSON template
          </a>
        </div>

        <div style={{ marginTop: 6, opacity: 0.8 }}>
          Templates use aggregate counts only. Do not include individual-level or identifiable data.
        </div>
      </div>
    </div>
  )
}
