export default function EthicsBanner() {
  return (
    <div style={{ marginTop: 16, padding: 12, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 14 }}>
      <div style={{ fontWeight: 650 }}>This tool supports awareness, not monitoring.</div>
      <div style={{ opacity: 0.85, marginTop: 6 }}>
        This dashboard shows aggregated patterns only. It is not designed for performance management, surveillance, or ranking.
      </div>
    </div>
  )
}
