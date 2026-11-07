import { describe, it, expect } from "vitest"
import { parseCsv } from "./parseCsv"

describe("parseCsv", () => {
  it("returns empty array for empty or whitespace-only input", () => {
    expect(parseCsv("")).toEqual([])
    expect(parseCsv("   \n\n  \t  ")).toEqual([])
  })

  it("returns empty array when only header line is present", () => {
    expect(parseCsv("period_start,period_end,domain,band,count")).toEqual([])
  })

  it("parses valid CSV rows and trims values", () => {
    const csv = `period_start,period_end,domain,band,count,context_tag
2025-09-01, 2025-09-30, Awareness , emerging , 10 , education
2025-09-01, 2025-09-30, Human–AI Co-Agency , developing , 20 , education`

    const parsed = parseCsv(csv)
    expect(parsed).toEqual([
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Awareness",
        band: "emerging",
        count: "10",
        context_tag: "education",
      },
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Human–AI Co-Agency",
        band: "developing",
        count: "20",
        context_tag: "education",
      },
    ])
  })

  it("handles CRLF line endings cleanly", () => {
    const csv = "period_start,period_end,domain,band,count\r\n2025-09-01,2025-09-30,Awareness,emerging,10\r\n2025-10-01,2025-10-31,Awareness,developing,20\r\n"
    const parsed = parseCsv(csv)
    expect(parsed).toHaveLength(2)
    expect(parsed[0].period_start).toBe("2025-09-01")
    expect(parsed[1].period_start).toBe("2025-10-01")
  })

  it("handles RFC-4180 quoted fields with commas and escaped quotes", () => {
    const csv = `period_start,period_end,domain,band,count,context_tag
2025-09-01,2025-09-30,"Ethics, Equity & Impact",emerging,200,"Note with ""escaped"" quotes"`

    const parsed = parseCsv(csv)
    expect(parsed).toEqual([
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Ethics, Equity & Impact",
        band: "emerging",
        count: "200",
        context_tag: 'Note with "escaped" quotes',
      },
    ])
  })

  it("handles empty fields at start, middle, and end", () => {
    const csv = `col1,col2,col3,col4
,middle,,end
val1,,,`

    const parsed = parseCsv(csv)
    expect(parsed).toEqual([
      { col1: "", col2: "middle", col3: "", col4: "end" },
      { col1: "val1", col2: "", col3: "", col4: "" },
    ])
  })

  it("handles unquoted Ethics, Equity & Impact from official templates", () => {
    const csv = `period_start,period_end,domain,band,count,context_tag
2025-09-01,2025-09-30,Ethics, Equity & Impact,emerging,200,education`

    const parsed = parseCsv(csv)
    expect(parsed).toEqual([
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Ethics, Equity & Impact",
        band: "emerging",
        count: "200",
        context_tag: "education",
      },
    ])
  })

  it("handles unquoted Reflection, Learning & Renewal from official templates", () => {
    const csv = `period_start,period_end,domain,band,count,context_tag
2025-09-01,2025-09-30,Reflection, Learning & Renewal,embedded,50,education`

    const parsed = parseCsv(csv)
    expect(parsed).toEqual([
      {
        period_start: "2025-09-01",
        period_end: "2025-09-30",
        domain: "Reflection, Learning & Renewal",
        band: "embedded",
        count: "50",
        context_tag: "education",
      },
    ])
  })

  it("handles unquoted domain with comma regardless of domain column position", () => {
    const csv = `domain,band,count,period_start,period_end
Ethics, Equity & Impact,emerging,200,2025-09-01,2025-09-30`

    const parsed = parseCsv(csv)
    expect(parsed).toEqual([
      {
        domain: "Ethics, Equity & Impact",
        band: "emerging",
        count: "200",
        period_start: "2025-09-01",
        period_end: "2025-09-30",
      },
    ])
  })

  it("does not merge ordinary columns if joined value is not a canonical domain", () => {
    const csv = `domain,band,count,context_tag
Awareness,emerging,10,extra,val`

    const parsed = parseCsv(csv)
    // 5 values for 4 headers; candidate domain "Awareness, emerging" is not a canonical domain
    // so no merge occurs
    expect(parsed[0].domain).toBe("Awareness")
    expect(parsed[0].band).toBe("emerging")
    expect(parsed[0].count).toBe("10")
    expect(parsed[0].context_tag).toBe("extra")
  })

  it("handles missing trailing columns with empty strings", () => {
    const csv = `a,b,c\n1,2`
    const parsed = parseCsv(csv)
    expect(parsed).toEqual([{ a: "1", b: "2", c: "" }])
  })
})
