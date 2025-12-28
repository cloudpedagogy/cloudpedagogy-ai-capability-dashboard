// ✅ NEW FILE: src/views/SignalsView.tsx
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
  // stable key based on content (good enough for this use)
  const base = `${s.statement}__${s.prompt ?? ""}`
  // lightweight hash
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
      // ignore (storage may be blocked)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, showOnlyWithNotes, filtered.length])

  function setNote(key: string, value: string) {
    setNotes((prev) => ({ ...prev, [key]: value }))
  }

  function clearAllNotes() {
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
      // merge (import wins)
      setNotes((prev) => ({ ...prev, ...imported }))
    } catch {
      // ignore; you can surface an error message later if you want
    }
  }

  return (
    <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
      {/* Header */}
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700 }}>Signals workspace</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              Browse heuristic signals and capture reflection notes locally (stored only in your browser).
            </div>
            <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
              Mode: {props.reflective ? "Reflective (prompts shown)" : "Descriptive (prompts hidden)"}
              {props.datasetLabel ? ` · ${props.datasetLabel}` : ""}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={exportNotes} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)" }}>
              Export notes (JSON)
            </button>

            <label style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)", cursor: "pointer" }}>
              Import notes
              <input
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) importNotes(f)
                  e.currentTarget.value = ""
                }}
              />
            </label>

            <button
              onClick={clearAllNotes}
              style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(180,0,0,0.35)" }}
              title="Clears all locally saved notes"
            >
              Clear notes
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 650 }}>Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter statements / prompts…"
                style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.2)", minWidth: 260 }}
              />
            </label>

            <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={showOnlyWithNotes}
                onChange={(e) => setShowOnlyWithNotes(e.target.checked)}
              />
              <span style={{ opacity: 0.9 }}>Only show signals with notes</span>
            </label>
          </div>

          <div style={{ opacity: 0.85 }}>
            Showing <b>{filtered.length}</b> of <b>{signalItems.length}</b> signals · Notes saved:{" "}
            <b>{Object.values(notes).filter((v) => v.trim().length > 0).length}</b>
          </div>
        </div>
      </div>

      {/* Main workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 12 }}>
        {/* List */}
        <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
          <div style={{ fontWeight: 700 }}>Signals</div>

          {filtered.length === 0 ? (
            <div style={{ marginTop: 10, opacity: 0.85 }}>
              No signals match the current filter.
            </div>
          ) : (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {filtered.map((it, idx) => {
                const isActive = it.key === activeKey
                const hasNote = !!it.note.trim()
                return (
                  <button
                    key={it.key}
                    onClick={() => setActiveKey(it.key)}
                    style={{
                      textAlign: "left",
                      padding: 10,
                      borderRadius: 12,
                      border: isActive ? "2px solid rgba(0,0,0,0.35)" : "1px solid rgba(0,0,0,0.15)",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 650 }}>{idx + 1}. {it.signal.statement}</div>
                      {hasNote && <div style={{ opacity: 0.75, fontSize: 12 }}>📝</div>}
                    </div>
                    <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>
                      {props.reflective ? "Prompt available" : "Prompt hidden in Descriptive mode"}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail + notes */}
        <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16, minHeight: 320 }}>
          {!active ? (
            <div style={{ opacity: 0.85 }}>
              Select a signal to view details and add notes.
            </div>
          ) : (
            <>
              <div style={{ fontWeight: 700 }}>Signal</div>
              <div style={{ marginTop: 8, fontWeight: 650 }}>{active.signal.statement}</div>

              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 650 }}>Interpretation</div>
                <div style={{ opacity: 0.85, marginTop: 6 }}>
                  {props.reflective
                    ? active.signal.prompt
                    : "Switch to Reflective mode to reveal the discussion prompt for this signal."}
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 650 }}>Your notes (local only)</div>
                <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
                  Saved in your browser (localStorage). Not transmitted or stored by CloudPedagogy.
                </div>

                <textarea
                  value={notes[active.key] ?? ""}
                  onChange={(e) => setNote(active.key, e.target.value)}
                  placeholder="Capture context, hypotheses, actions, questions…"
                  style={{
                    marginTop: 8,
                    width: "100%",
                    minHeight: 180,
                    resize: "vertical",
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.2)",
                    fontFamily: "inherit",
                    fontSize: 14,
                  }}
                />
              </div>

              {props.reflective && (
                <div style={{ marginTop: 12, padding: 12, border: "1px dashed rgba(0,0,0,0.25)", borderRadius: 12 }}>
                  <div style={{ fontWeight: 650 }}>Reminder</div>
                  <div style={{ opacity: 0.85, marginTop: 6 }}>
                    Signals are heuristic prompts for discussion, not findings. Avoid converting outputs into monitoring or performance measures.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Ethics note */}
      <div style={{ padding: 16, border: "1px solid rgba(0,0,0,0.1)", borderRadius: 16 }}>
        <div style={{ fontWeight: 700 }}>Ethical use note</div>
        <div style={{ opacity: 0.85, marginTop: 8 }}>
          This workspace is designed for reflective sense-making. Notes are stored locally in your browser and can be exported by you.
          Do not use this tool to infer individual performance or to enable surveillance practices.
        </div>
      </div>
    </div>
  )
}
