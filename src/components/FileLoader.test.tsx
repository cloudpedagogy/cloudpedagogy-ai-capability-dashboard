import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import FileLoader from "./FileLoader"

describe("FileLoader", () => {
  it("renders upload button and default status text", () => {
    render(<FileLoader onLoaded={() => {}} onError={() => {}} />)
    expect(screen.getByText("Upload Dataset")).toBeInTheDocument()
    expect(screen.getByText("No file chosen")).toBeInTheDocument()
  })

  it("handles valid JSON file upload", async () => {
    const onLoaded = vi.fn()
    const onError = vi.fn()

    const { container } = render(<FileLoader onLoaded={onLoaded} onError={onError} />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    const validJson = JSON.stringify([
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Awareness",
        band: "emerging",
        count: 15,
      },
    ])

    const file = new File([validJson], "dataset.json", { type: "application/json" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onLoaded).toHaveBeenCalledWith([
        {
          period_start: "2025-09-01",
          period_end: "2025-09-30",
          domain: "Awareness",
          band: "emerging",
          count: 15,
          context_tag: undefined,
        },
      ])
    })
    expect(onError).not.toHaveBeenCalled()
  })

  it("handles valid CSV file upload", async () => {
    const onLoaded = vi.fn()
    const onError = vi.fn()

    const { container } = render(<FileLoader onLoaded={onLoaded} onError={onError} />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    const validCsv = `period_start,period_end,domain,band,count
2025-09-01,2025-09-30,Awareness,developing,25`

    const file = new File([validCsv], "dataset.csv", { type: "text/csv" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onLoaded).toHaveBeenCalledWith([
        {
          period_start: "2025-09-01",
          period_end: "2025-09-30",
          domain: "Awareness",
          band: "developing",
          count: 25,
          context_tag: undefined,
        },
      ])
    })
    expect(onError).not.toHaveBeenCalled()
  })

  it("handles unsupported file extension with error message", async () => {
    const onLoaded = vi.fn()
    const onError = vi.fn()

    const { container } = render(<FileLoader onLoaded={onLoaded} onError={onError} />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    const file = new File(["test"], "notes.txt", { type: "text/plain" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        "Unsupported file type. Please upload a .csv or .json file."
      )
    })
    expect(onLoaded).not.toHaveBeenCalled()
  })

  it("calls onError when file content is invalid", async () => {
    const onLoaded = vi.fn()
    const onError = vi.fn()

    const { container } = render(<FileLoader onLoaded={onLoaded} onError={onError} />)
    const input = container.querySelector('input[type="file"]') as HTMLInputElement

    const invalidJson = JSON.stringify([{ invalid: "data" }])
    const file = new File([invalidJson], "invalid.json", { type: "application/json" })
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
      expect(onError.mock.calls[0][0]).toContain("Could not read file.")
    })
    expect(onLoaded).not.toHaveBeenCalled()
  })
})

