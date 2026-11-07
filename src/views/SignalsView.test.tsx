import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SignalsView from "./SignalsView"
import type { Signal } from "../engine/signals"

const STORAGE_KEY = "cloudpedagogy_ai_capability_dashboard_signals_notes_v1"

function safeKeyFromSignal(s: Signal) {
  const base = `${s.statement}__${s.prompt ?? ""}`
  let h = 0
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0
  return `sig_${h.toString(16)}`
}

const mockSignals: Signal[] = [
  {
    type: "balance",
    statement: "Applied Practice & Innovation appears to be developing faster than Decision-Making & Governance.",
    prompt: "What governance scaffolds are needed?",
  },
  {
    type: "renewal",
    statement: "Reflection, Learning & Renewal shows a higher ‘emerging’ share than other domains.",
    prompt: "What routines would make renewal more systematic?",
  },
]

describe("SignalsView", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("renders signals list and displays the first signal by default", () => {
    render(<SignalsView signals={mockSignals} reflective={true} datasetLabel="Test Dataset" />)

    expect(screen.getByText(/Signals Workspace/i)).toBeInTheDocument()
    expect(screen.getByText(/1\. Applied Practice & Innovation appears to be developing faster/i)).toBeInTheDocument()
    expect(screen.getByText(/2\. Reflection, Learning & Renewal shows a higher/i)).toBeInTheDocument()

    // Default active item displays its statement and reflective prompt
    expect(screen.getByText("What governance scaffolds are needed?")).toBeInTheDocument()
  })

  it("hides prompt in descriptive mode", () => {
    render(<SignalsView signals={mockSignals} reflective={false} datasetLabel="Test Dataset" />)

    expect(screen.getByText("Reflective prompts are hidden in Descriptive mode.")).toBeInTheDocument()
    expect(screen.queryByText("What governance scaffolds are needed?")).not.toBeInTheDocument()
  })

  it("allows selecting a different signal", () => {
    render(<SignalsView signals={mockSignals} reflective={true} />)

    const secondSignalButton = screen.getByText(/2\. Reflection, Learning & Renewal shows a higher/i)
    fireEvent.click(secondSignalButton)

    expect(screen.getByText("What routines would make renewal more systematic?")).toBeInTheDocument()
  })

  it("changing filters preserves valid selection or chooses an appropriate fallback, and clearing restores list", () => {
    render(<SignalsView signals={mockSignals} reflective={true} />)

    // Select second signal
    const secondSignalButton = screen.getByText(/2\. Reflection, Learning & Renewal shows a higher/i)
    fireEvent.click(secondSignalButton)
    expect(screen.getByText("What routines would make renewal more systematic?")).toBeInTheDocument()

    // Filter by query that excludes signal 2 ("Applied")
    const searchInput = screen.getByPlaceholderText("Filter by keyword or prompt...")
    fireEvent.change(searchInput, { target: { value: "Applied" } })

    // Fallback: only signal 1 matches, so signal 1 becomes active
    expect(screen.queryByText(/2\. Reflection, Learning & Renewal/i)).not.toBeInTheDocument()
    expect(screen.getByText("What governance scaffolds are needed?")).toBeInTheDocument()

    // Clear search query
    fireEvent.change(searchInput, { target: { value: "" } })

    // Both signals are restored
    expect(screen.getByText(/1\. Applied Practice & Innovation/i)).toBeInTheDocument()
    expect(screen.getByText(/2\. Reflection, Learning & Renewal/i)).toBeInTheDocument()
  })

  it("associates notes with correct signals and preserves them across selection and reload", () => {
    const { unmount } = render(<SignalsView signals={mockSignals} reflective={true} />)

    // Add note to signal 1
    const textarea = screen.getByPlaceholderText("Type your reflections here...")
    fireEvent.change(textarea, { target: { value: "Note for signal 1" } })

    // Switch to signal 2
    const secondSignalButton = screen.getByText(/2\. Reflection, Learning & Renewal/i)
    fireEvent.click(secondSignalButton)

    // Verify textarea is empty for signal 2, then add note
    expect(textarea).toHaveValue("")
    fireEvent.change(textarea, { target: { value: "Note for signal 2" } })

    // Switch back to signal 1 and verify its note is intact
    const firstSignalButton = screen.getByText(/1\. Applied Practice & Innovation/i)
    fireEvent.click(firstSignalButton)
    expect(textarea).toHaveValue("Note for signal 1")

    // Unmount and remount (simulating page reload)
    unmount()
    render(<SignalsView signals={mockSignals} reflective={true} />)

    const reloadedTextarea = screen.getByPlaceholderText("Type your reflections here...")
    expect(reloadedTextarea).toHaveValue("Note for signal 1")

    const reloadedSecondButton = screen.getByText(/2\. Reflection, Learning & Renewal/i)
    fireEvent.click(reloadedSecondButton)
    expect(reloadedTextarea).toHaveValue("Note for signal 2")
  })

  it("filters by showOnlyWithNotes", () => {
    const key = safeKeyFromSignal(mockSignals[0])
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ [key]: "Has a note" })
    )

    render(<SignalsView signals={mockSignals} reflective={true} />)

    const checkbox = screen.getByLabelText(/Show only signals with notes/i)
    fireEvent.click(checkbox)

    expect(screen.getByText(/1\. Applied Practice & Innovation/i)).toBeInTheDocument()
    expect(screen.queryByText(/Reflection, Learning & Renewal/i)).not.toBeInTheDocument()
  })

  it("clears local storage when user confirms", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true)
    const key = safeKeyFromSignal(mockSignals[0])
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ [key]: "Note to delete" })
    )

    render(<SignalsView signals={mockSignals} reflective={true} />)

    const clearButton = screen.getByText("Clear Local Storage")
    fireEvent.click(clearButton)

    expect(confirmSpy).toHaveBeenCalled()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")).toEqual({})
  })
})
