// src/components/StatCard.tsx
export default function StatCard(props: { label: string; value: string }) {
  return (
    <div className="cp-card">
      <div className="text-small text-muted semibold">{props.label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: 4, color: "var(--color-text-primary)" }}>{props.value}</div>
    </div>
  )
}
