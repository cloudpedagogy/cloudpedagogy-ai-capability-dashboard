import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import App from "./App"

describe("App", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("renders empty state initially with demo buttons", () => {
    render(<App />)

    expect(screen.getByRole("heading", { name: "AI Capability Dashboard" })).toBeInTheDocument()
    expect(screen.getByText("Institutional AI Capability Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Baseline Demo")).toBeInTheDocument()
    expect(screen.getByText("Intervention Scenario")).toBeInTheDocument()
  })

  it("loads baseline demo dataset and displays Overview by default", () => {
    render(<App />)

    fireEvent.click(screen.getByText("Baseline Demo"))

    // Change dataset button appears
    expect(screen.getByText("Change dataset")).toBeInTheDocument()

    // Interpretation badge is visible
    expect(screen.getByText(/Interpretation:/i)).toBeInTheDocument()
    expect(screen.getAllByText(/patterns only/i).length).toBeGreaterThan(0)

    // Key insight panels
    expect(screen.getByText("Institutional Insights")).toBeInTheDocument()
    expect(screen.getByText("Strongest Domain")).toBeInTheDocument()
    expect(screen.getByText("Weakest Domain")).toBeInTheDocument()

    // Stat cards
    expect(screen.getByText("Total count (N)")).toBeInTheDocument()
    expect(screen.getByText("792")).toBeInTheDocument()
  })

  it("switches views between Overview, Trends, Domain detail, and Signals", () => {
    render(<App />)
    fireEvent.click(screen.getByText("Baseline Demo"))

    const viewSelect = screen.getByDisplayValue("Overview")

    // Switch to Trends
    fireEvent.change(viewSelect, { target: { value: "trends" } })
    expect(screen.getByText("Longitudinal Trajectory")).toBeInTheDocument()

    // Switch to Domain Detail
    fireEvent.change(viewSelect, { target: { value: "domain" } })
    expect(screen.getByText("Domain Detail Breakdown")).toBeInTheDocument()

    // Switch to Signals
    fireEvent.change(viewSelect, { target: { value: "signals" } })
    expect(screen.getByText("Signals Workspace")).toBeInTheDocument()
  })

  it("switches interpretation mode between Descriptive and Reflective", () => {
    render(<App />)
    fireEvent.click(screen.getByText("Baseline Demo"))

    const modeSelect = screen.getByDisplayValue("Descriptive")
    fireEvent.change(modeSelect, { target: { value: "reflective" } })

    expect(screen.getByText(/prompts shown/i)).toBeInTheDocument()
    expect(screen.getByText(/Reflective mode surfaces discussion prompts/i)).toBeInTheDocument()
  })

  it("resets back to empty state when Change dataset is clicked", () => {
    render(<App />)
    fireEvent.click(screen.getByText("Baseline Demo"))

    expect(screen.getByText("Change dataset")).toBeInTheDocument()
    fireEvent.click(screen.getByText("Change dataset"))

    expect(screen.getByText("Institutional AI Capability Dashboard")).toBeInTheDocument()
    expect(screen.queryByText("Change dataset")).not.toBeInTheDocument()
  })

  it("allows filling optional Capability and Governance notes", () => {
    render(<App />)
    fireEvent.click(screen.getByText("Baseline Demo"))

    const details = screen.getByText("Capability & Governance Notes (Optional)")
    expect(details).toBeInTheDocument()

    const capNotes = screen.getByPlaceholderText(/How does this dashboard support capability development\?/i)
    fireEvent.change(capNotes, { target: { value: "Used for institutional strategy." } })
    expect(capNotes).toHaveValue("Used for institutional strategy.")

    const govNotes = screen.getByPlaceholderText(/Assumptions, risks, or contextual limitations/i)
    fireEvent.change(govNotes, { target: { value: "Cohort-level aggregate." } })
    expect(govNotes).toHaveValue("Cohort-level aggregate.")
  })
})
