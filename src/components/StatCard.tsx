export default function StatCard(props: { label: string; value: string }) {
  return (
    <div style={{ padding: 14, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
      <div style={{ opacity: 0.75, fontSize: 13 }}>{props.label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{props.value}</div>
    </div>
  )
}
