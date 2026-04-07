// src/components/EthicsBanner.tsx
export default function EthicsBanner() {
  return (
    <div className="cp-card" style={{ borderLeft: "4px solid var(--color-text-primary)", marginBottom: 24 }}>
      <div className="semibold">Institutional Awareness Tool · Non-Monitoring</div>
      <div className="text-secondary text-small" style={{ marginTop: 4 }}>
        This dashboard presents aggregated patterns only. It is not designed for performance management, surveillance, or individual ranking.
      </div>
    </div>
  )
}
