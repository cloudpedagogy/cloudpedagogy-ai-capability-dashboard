import { describe, it, expect } from "vitest"
import templateJsonRaw from "../../public/templates/ai-capability-dashboard-template.json?raw"
import templateCsvRaw from "../../public/templates/ai-capability-dashboard-template.csv?raw"
import exampleCsvRaw from "../../public/templates/ai-capability-dashboard-example.csv?raw"
import { CANONICAL_DOMAINS, parseAggregatedRows, type AggregatedRow } from "./schema"
import { parseCsv } from "./parseCsv"

describe("schema", () => {
  it("defines the six canonical domains correctly", () => {
    expect(CANONICAL_DOMAINS).toEqual([
      "Awareness",
      "Human–AI Co-Agency",
      "Applied Practice & Innovation",
      "Ethics, Equity & Impact",
      "Decision-Making & Governance",
      "Reflection, Learning & Renewal",
    ])
  })

  it("parses valid row objects", () => {
    const input = [
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Awareness",
        band: "emerging",
        count: 42,
        context_tag: "higher-ed",
      },
    ]

    const result = parseAggregatedRows(input)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual<AggregatedRow>({
      period_start: "2025-09-01",
      period_end: "2025-09-30",
      domain: "Awareness",
      band: "emerging",
      count: 42,
      context_tag: "higher-ed",
    })
  })

  it("throws if input is not an array", () => {
    expect(() => parseAggregatedRows(null as unknown as unknown[])).toThrow("Uploaded data must be an array of rows.")
    expect(() => parseAggregatedRows({} as unknown as unknown[])).toThrow("Uploaded data must be an array of rows.")
  })

  it("throws if array has no valid rows", () => {
    expect(() => parseAggregatedRows([])).toThrow("No valid rows found in uploaded file.")
  })

  it("throws if period_start or period_end is missing", () => {
    const input = [
      {
        period_start: "",
        period_end: "2025-09-30",
        domain: "Awareness",
        band: "emerging",
        count: 10,
      },
    ]
    expect(() => parseAggregatedRows(input)).toThrow("Each row must include period_start and period_end.")
  })

  it("throws if domain is unknown", () => {
    const input = [
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Invalid Domain",
        band: "emerging",
        count: 10,
      },
    ]
    expect(() => parseAggregatedRows(input)).toThrow('Unknown domain value: "Invalid Domain"')
  })

  it("throws if band is invalid", () => {
    const input = [
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Awareness",
        band: "expert",
        count: 10,
      },
    ]
    expect(() => parseAggregatedRows(input)).toThrow('Invalid band value: "expert"')
  })

  it("throws if count is negative or invalid", () => {
    const input1 = [
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Awareness",
        band: "emerging",
        count: -5,
      },
    ]
    expect(() => parseAggregatedRows(input1)).toThrow('Invalid count value: "-5"')

    const input2 = [
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Awareness",
        band: "emerging",
        count: "abc",
      },
    ]
    expect(() => parseAggregatedRows(input2)).toThrow('Invalid count value: "abc"')
  })

  describe("canonical upstream template compatibility", () => {
    it("successfully parses public/templates/ai-capability-dashboard-template.json", () => {
      const json = JSON.parse(templateJsonRaw)
      const rows = parseAggregatedRows(json)
      expect(rows).toHaveLength(1)
      expect(rows[0].domain).toBe("Awareness")
      expect(rows[0].band).toBe("emerging")
    })

    it("successfully parses public/templates/ai-capability-dashboard-template.csv", () => {
      const csvRows = parseCsv(templateCsvRaw)
      const rows = parseAggregatedRows(csvRows)
      expect(rows).toHaveLength(18) // 6 domains * 3 bands
    })

    it("successfully parses public/templates/ai-capability-dashboard-example.csv", () => {
      const csvRows = parseCsv(exampleCsvRaw)
      const rows = parseAggregatedRows(csvRows)
      expect(rows).toHaveLength(36) // 2 periods * 6 domains * 3 bands
    })
  })
})
