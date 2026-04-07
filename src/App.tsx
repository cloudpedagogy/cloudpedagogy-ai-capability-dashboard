// src/App.tsx
import { useMemo, useState } from "react"

import EthicsBanner from "./components/EthicsBanner"
import FileLoader from "./components/FileLoader"
import Controls, { type Interpretation, type ViewMode } from "./components/Controls"
import EmptyState from "./views/EmptyState"
import OverviewView from "./views/OverviewView"
import TrendsView from "./views/TrendsView"
import DomainDetailView from "./views/DomainDetailView"
import SignalsView from "./views/SignalsView"

import { DEMO_ROWS } from "./data/demo"
import { DEMO_UNEVEN_ROWS } from "./data/demo_uneven"

import type { AggregatedRow } from "./engine/schema"
import { computeDomainDistributions, summariseDataset } from "./engine/aggregate"
import { deriveSignals } from "./engine/signals"

/**
 * Interpretation badge (always visible when a dataset is loaded)
 * - Monochrome, minimalist design for institutional context.
 */
function InterpretationBadge(props: { mode: Interpretation }) {
  const isReflective = props.mode === "reflective"

  const tooltip =
    "Interpretation modes:\n\n" +
    "Descriptive: Shows aggregate patterns only.\n" +
    "Reflective: Reveals discussion prompts to support sense-making.\n\n" +
    "This tool is not designed for monitoring, performance management, or surveillance."

  return (
    <div
      title={tooltip}
      className="text-small semibold"
      style={{
        marginTop: 10,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 4,
        background: "#F9FAFB",
        border: "1px solid var(--color-border-default)",
        userSelect: "none",
        color: "var(--color-text-secondary)",
      }}
    >
      <span style={{ opacity: 0.75 }}>Interpretation:</span>
      <span style={{ color: "var(--color-text-primary)" }}>{isReflective ? "Reflective" : "Descriptive"}</span>
      <span className="text-muted" style={{ fontWeight: 400 }}>
        {isReflective ? "· prompts shown" : "· patterns only"}
      </span>
      <span className="text-muted" style={{ fontWeight: 500 }} aria-hidden="true">
        ⓘ
      </span>
    </div>
  )
}

export default function App() {
  const [rows, setRows] = useState<AggregatedRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [viewMode, setViewMode] = useState<ViewMode>("overview")
  const [interpretation, setInterpretation] = useState<Interpretation>("descriptive")
  const [context, setContext] = useState<string>("") // "" = all

  // ─────────────────────────────────────────────
  // Filtering
  // ─────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    if (!rows) return []
    if (!context) return rows
    return rows.filter((r) => r.context_tag === context)
  }, [rows, context])

  // ─────────────────────────────────────────────
  // Aggregation
  // ─────────────────────────────────────────────
  const summary = useMemo(() => (rows ? summariseDataset(rows) : null), [rows])

  const filteredSummary = useMemo(
    () => (rows ? summariseDataset(filteredRows) : null),
    [rows, filteredRows]
  )

  const dists = useMemo(() => computeDomainDistributions(filteredRows), [filteredRows])

  const signals = useMemo(() => deriveSignals(dists), [dists])

  // ─────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────
  function load(newRows: AggregatedRow[]) {
    setRows(newRows)
    setError(null)
    setViewMode("overview")
    setInterpretation("descriptive")
    setContext("")
  }

  function onFileError(msg: string) {
    setRows(null)
    setError(msg)
    setViewMode("overview")
    setInterpretation("descriptive")
    setContext("")
  }

  function resetToStart() {
    setRows(null)
    setError(null)
    setViewMode("overview")
    setInterpretation("descriptive")
    setContext("")
  }

  const integrityText =
    filteredSummary
      ? `N = ${filteredSummary.total_count} · Periods = ${filteredSummary.periods.length} · Aggregated · No identifiers`
      : ""

  return (
    <div className="max-width-container">
      {/* ───────── Minimal Header ───────── */}
      <header style={{ marginBottom: 32 }}>
        <a 
          href="https://www.cloudpedagogy.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-small semibold text-muted"
          style={{ marginBottom: 4, display: "block" }}
        >
          CloudPedagogy
        </a>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <h1 style={{ margin: 0 }}>AI Capability Dashboard</h1>
            <p className="text-secondary" style={{ marginTop: 4, marginBottom: 0 }}>
              Aggregate, non-identifiable capability signals for institutional reflection.
            </p>
          </div>

          <div className="cp-hide-print" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {rows && (
              <button
                onClick={resetToStart}
                className="cp-button-secondary"
                title="Return to the start screen to load a different dataset"
              >
                Change dataset
              </button>
            )}

            <FileLoader onLoaded={(r) => load(r)} onError={onFileError} />
          </div>
        </div>
      </header>

      <EthicsBanner />

      {/* ───────── Errors ───────── */}
      {error && (
        <div className="cp-card" style={{ borderLeft: "4px solid #111111" }}>
          <div className="semibold">Could not load dataset</div>
          <div className="text-secondary" style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      )}

      {/* ───────── Empty State (two demo buttons) ───────── */}
      {!rows && !error && (
        <div className="cp-card" style={{ padding: 0 }}>
          <EmptyState
            onUseBaselineDemo={() => load(DEMO_ROWS)}
            onUseInterventionDemo={() => load(DEMO_UNEVEN_ROWS)}
          />
        </div>
      )}

      {/* ───────── Main Views ───────── */}
      {rows && filteredSummary && summary && (
        <>
          <div className="cp-card cp-print-keep">
            <Controls
              viewMode={viewMode}
              setViewMode={setViewMode}
              interpretation={interpretation}
              setInterpretation={setInterpretation}
              contexts={summary.contexts}
              context={context}
              setContext={setContext}
              integrityText={integrityText}
            />
          </div>

          {/* Interpretation badge (visible in all views + print) */}
          <div className="cp-print-keep" style={{ marginBottom: 24 }}>
            <InterpretationBadge mode={interpretation} />
          </div>

          {/* Overview */}
          {viewMode === "overview" && (
            <div className="cp-card">
              <OverviewView
                dists={dists}
                total={filteredSummary.total_count}
                periods={filteredSummary.periods.length}
                signals={signals}
                reflective={interpretation === "reflective"}
              />
            </div>
          )}

          {/* Trends */}
          {viewMode === "trends" && (
            <div className="cp-card">
              <TrendsView rows={filteredRows} />
            </div>
          )}

          {/* Domain detail */}
          {viewMode === "domain" && (
            <div className="cp-card">
              <DomainDetailView rows={filteredRows} reflective={interpretation === "reflective"} />
            </div>
          )}

          {/* Signals workspace */}
          {viewMode === "signals" && (
            <div className="cp-card">
              <SignalsView
                signals={signals}
                reflective={interpretation === "reflective"}
                datasetLabel={integrityText}
              />
            </div>
          )}
        </>
      )}

      {/* ───────── Minimal Footer ───────── */}
      <footer style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--color-border-default)" }}>
        <div className="text-small text-muted">
          CloudPedagogy · Governance-ready AI and curriculum systems
        </div>
      </footer>
    </div>
  )
}
