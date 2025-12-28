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
 * - Includes tooltip explaining the two modes (via native title attribute)
 * - Will also appear in print/export because it's part of the DOM (and we add print-friendly styles below)
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
      style={{
        marginTop: 10,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 650,
        background: isReflective ? "rgba(0,120,0,0.08)" : "rgba(0,0,0,0.04)",
        border: `1px solid ${isReflective ? "rgba(0,120,0,0.35)" : "rgba(0,0,0,0.25)"}`,
        userSelect: "none",
      }}
    >
      <span style={{ opacity: 0.85 }}>Interpretation:</span>
      <span>{isReflective ? "Reflective" : "Descriptive"}</span>
      <span style={{ opacity: 0.7, fontWeight: 500 }}>
        {isReflective ? "· prompts shown" : "· patterns only"}
      </span>
      <span style={{ opacity: 0.55, fontWeight: 600 }} aria-hidden="true">
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
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      {/* Print-friendly styles: keeps badge visible and adds subtle border to sections */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          /* Ensure controls + badge remain visible in print */
          .cp-print-keep { display: block !important; }
          /* Avoid awkward page breaks inside cards */
          .cp-card { break-inside: avoid; page-break-inside: avoid; }
          /* Hide upload controls and dataset change button in print */
          .cp-hide-print { display: none !important; }
        }
      `}</style>

      {/* ───────── Header ───────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>AI Capability Dashboard (Aggregate View)</div>
          <div style={{ opacity: 0.8 }}>
            Aggregate, non-identifiable capability signals to support system-level reflection over time.
          </div>
        </div>

        <div className="cp-hide-print" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {rows && (
            <button
              onClick={resetToStart}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.2)",
                cursor: "pointer",
                background: "transparent",
              }}
              title="Return to the start screen to load a different dataset"
            >
              Change dataset
            </button>
          )}

          <FileLoader onLoaded={(r) => load(r)} onError={onFileError} />
        </div>
      </div>

      <EthicsBanner />

      {/* ───────── Errors ───────── */}
      {error && (
        <div className="cp-card" style={{ marginTop: 16, padding: 12, border: "1px solid rgba(180,0,0,0.4)", borderRadius: 12 }}>
          <div style={{ fontWeight: 650 }}>Could not load dataset</div>
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      )}

      {/* ───────── Empty State (two demo buttons) ───────── */}
      {!rows && !error && (
        <div className="cp-card">
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
          <div className="cp-print-keep">
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

      {/* ───────── Footer ───────── */}
      <div style={{ marginTop: 28, opacity: 0.75, fontSize: 13 }}>
        CloudPedagogy · AI Capability Dashboard · Static, privacy-preserving aggregation (no identifiers).
      </div>
    </div>
  )
}
