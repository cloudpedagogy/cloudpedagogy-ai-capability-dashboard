// src/views/SignalsView.tsx
import { useEffect, useMemo, useState } from "react"
import type { Signal } from "../engine/signals"

type Props = {
  signals: Signal[]
  reflective: boolean
  datasetLabel?: string // optional (e.g. integrity text) shown for context
}

type NoteMap = Record<string, string>

const STORAGE_KEY = "cloudpedagogy_ai_capability_dashboard_signals_notes_v1"

function formatDateTime(d = new Date()) {
  // simple ISO-ish local timestamp
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(
    d.getMinutes()
  )}`
}

function safeKeyFromSignal(s: Signal) {
  // stable key based on content
  const base = `${s.statement}__${s.prompt ?? ""}`
  let h = 0
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0
  return `sig_${h.toString(16)}`
}

function downloadJson(filename: string, obj: unknown) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

async function readFileAsText(file: File) {
  return await file.text()
}

export default function SignalsView(props: Props) {
  const [notes, setNotes] = useState<NoteMap>({})
  const [query, setQuery] = useState("")
  const [showOnlyWithNotes, setShowOnlyWithNotes] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)

  // Load saved notes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as NoteMap
      if (parsed && typeof parsed === "object") setNotes(parsed)
    } catch {
      // ignore
    }
  }, [])

  // Persist notes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {
      // ignore
    }
  }, [notes])

  const signalItems = useMemo(() => {
    return props.signals.map((s) => {
      const key = safeKeyFromSignal(s)
      return { key, signal: s, note: notes[key] ?? "" }
    })
  }, [props.signals, notes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return signalItems.filter((it) => {
      if (showOnlyWithNotes && !it.note.trim()) return false
      if (!q) return true
      const hay = `${it.signal.statement} ${it.signal.prompt ?? ""}`.toLowerCase()
      return hay.includes(q)
    })
  }, [signalItems, query, showOnlyWithNotes])

  const active = useMemo(() => {
    if (!activeKey) return null
    return signalItems.find((s) => s.key === activeKey) ?? null
  }, [activeKey, signalItems])

  // Keep active selection sensible if filters change
  useEffect(() => {
    if (!activeKey) {
      if (filtered.length > 0) setActiveKey(filtered[0].key)
      return
    }
    const stillExists = filtered.some((x) => x.key === activeKey)
    if (!stillExists && filtered.length > 0) setActiveKey(filtered[0].key)
    if (!stillExists && filtered.length === 0) setActiveKey(null)
  }, [query, showOnlyWithNotes, filtered.length])

  function setNote(key: string, value: string) {
    setNotes((prev) => ({ ...prev, [key]: value }))
  }

  function clearAllNotes() {
    if (!window.confirm("Are you sure you want to clear all locally saved notes?")) return
    setNotes({})
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  function exportNotes() {
    const payload = {
      exported_at: new Date().toISOString(),
      tool: "CloudPedagogy AI Capability Dashboard (Signals Workspace)",
      dataset_label: props.datasetLabel ?? "",
      notes: notes,
    }
    downloadJson(`cloudpedagogy_signals_notes_${formatDateTime()}.json`, payload)
  }

  async function importNotes(file: File) {
    try {
      const text = await readFileAsText(file)
      const parsed = JSON.parse(text) as any
      const imported = (parsed?.notes ?? parsed) as NoteMap
      if (!imported || typeof imported !== "object") return
      setNotes((prev) => ({ ...prev, ...imported }))
    } catch {
      // ignore
    }
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Header Panel */}
      <div className="cp-card" style={{ margin: 0, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: 4 }}>Signals Workspace</h2>
            <p className="text-secondary text-small" style={{ margin: 0 }}>
              Browse identified signals and capture reflection notes locally. Notes are stored in your browser and are not transmitted.
            </p>
            <div className="text-muted text-small" style={{ marginTop: 12 }}>
              Mode: {props.reflective ? "Reflective" : "Descriptive"}
              {props.datasetLabel ? ` · ${props.datasetLabel}` : ""}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="cp-button-secondary text-small" onClick={exportNotes}>
              Export Notes
            </button>
            <label className="cp-button-secondary text-small" style={{ position: "relative", cursor: "pointer" }}>
              <span>Import Notes</span>
              <input
                type="file"
                accept="application/json"
                style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) importNotes(f)
                  e.currentTarget.value = ""
                }}
              />
            </label>
            <button className="cp-button-secondary text-small" onClick={clearAllNotes} style={{ color: "var(--color-text-secondary)" }}>
              Clear Local Storage
            </button>
          </div>
        </div>
      </div>

      {/* Constraints & Filters */}
      <div className="cp-card" style={{ margin: 0, padding: 16, background: "#F9FAFB", border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <span className="semibold text-small">Search Signals</span>
              <input
                className="text-small"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by keyword or prompt..."
                style={{ minWidth: 300, padding: "8px 12px" }}
              />
            </div>

            <label style={{ display: "inline-flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showOnlyWithNotes}
                onChange={(e) => setShowOnlyWithNotes(e.target.checked)}
              />
              <span className="text-small semibold">Show only signals with notes</span>
            </label>
          </div>

          <div className="text-small text-muted">
            <b>{filtered.length}</b> of <b>{signalItems.length}</b> signals identified
          </div>
        </div>
      </div>

      {/* Workspace Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24, minHeight: 600 }}>
        {/* List Section */}
        <div className="cp-card" style={{ margin: 0, display: "flex", flexDirection: "column" }}>
          <h3 className="text-small semibold" style={{ marginBottom: 16 }}>Identified Signals</h3>
          
          {filtered.length === 0 ? (
            <div className="text-muted text-small">No signals match the current filters.</div>
          ) : (
            <div style={{ flex: 1, overflowY: "auto", display: "grid", gap: 8, alignContent: "flex-start" }}>
              {filtered.map((it, idx) => {
                const isActive = it.key === activeKey
                const hasNote = !!it.note.trim()
                return (
                  <button
                    key={it.key}
                    onClick={() => setActiveKey(it.key)}
                    style={{
                      textAlign: "left",
                      padding: "16px",
                      borderRadius: 6,
                      border: "1px solid var(--color-border-default)",
                      background: isActive ? "#F9FAFB" : "transparent",
                      cursor: "pointer",
                      borderColor: isActive ? "var(--color-text-primary)" : "var(--color-border-default)",
                      transition: "all 0.1s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div className="semibold text-small" style={{ color: isActive ? "var(--color-text-primary)" : "#444444" }}>
                        {idx + 1}. {it.signal.statement}
                      </div>
                      {hasNote && <span title="Has notes" style={{ fontSize: 12 }}>●</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Workspace Detail Section */}
        <div className="cp-card" style={{ margin: 0, display: "flex", flexDirection: "column" }}>
          {!active ? (
            <div className="text-muted text-small" style={{ margin: "auto", textAlign: "center" }}>
              Select a signal from the list to begin reflection.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h3 className="text-small semibold" style={{ marginBottom: 8 }}>Signal Statement</h3>
                <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{active.signal.statement}</div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <h3 className="text-small semibold" style={{ marginBottom: 12 }}>Reflective Interpretation</h3>
                <div style={{ padding: 16, background: "#F9FAFB", borderLeft: "4px solid var(--color-text-primary)", borderRadius: 4 }}>
                  {props.reflective ? (
                    <div className="text-secondary" style={{ fontStyle: "italic", lineHeight: 1.6 }}>{active.signal.prompt}</div>
                  ) : (
                    <div className="text-muted text-small">Reflective prompts are hidden in Descriptive mode.</div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 className="text-small semibold" style={{ marginBottom: 8 }}>Reflection Notes</h3>
                <p className="text-muted text-small" style={{ marginBottom: 12 }}>
                  Capture institutional context, hypotheses, or proposed actions. These notes are stored locally.
                </p>
                <textarea
                  className="text-small"
                  value={notes[active.key] ?? ""}
                  onChange={(e) => setNote(active.key, e.target.value)}
                  placeholder="Type your reflections here..."
                  style={{
                    flex: 1,
                    width: "100%",
                    minHeight: 300,
                    padding: 16,
                    borderRadius: 6,
                    border: "1px solid var(--color-border-default)",
                    resize: "none",
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Privacy & Governance Note */}
      <div className="cp-card" style={{ margin: 0, background: "#F9FAFB", border: "none" }}>
        <h3 className="text-small semibold" style={{ marginBottom: 8 }}>Governance & Privacy Note</h3>
        <p className="text-muted text-small" style={{ margin: 0 }}>
          This workspace is designed for aggregate sense-making and professional judgement. 
          Notes remain strictly local to your browser session. 
          CloudPedagogy avoids individual-level tracking and performance management features by design.
        </p>
      </div>
    </div>
  )
}
