import { ChangeEvent } from "react"
import { parseCsv } from "../engine/parseCsv"
import type { AggregatedRow } from "../engine/schema"

export default function FileLoader(props: {
  onLoaded: (rows: AggregatedRow[]) => void
  onError: (message: string) => void
}) {
  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const text = String(reader.result)

        if (file.name.toLowerCase().endsWith(".json")) {
          const data = JSON.parse(text)
          props.onLoaded(data as AggregatedRow[])
        } else {
          const rows = parseCsv(text)
          props.onLoaded(rows)
        }
      } catch (err) {
        props.onError(
          err instanceof Error
            ? err.message
            : "Could not parse the uploaded file."
        )
      }
    }

    reader.onerror = () => {
      props.onError("Could not read the uploaded file.")
    }

    reader.readAsText(file)

    // reset input so the same file can be re-uploaded if needed
    e.target.value = ""
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <label
        style={{
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.2)",
          cursor: "pointer",
          background: "transparent",
        }}
      >
        Upload
        <input
          type="file"
          accept=".csv,.json"
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </label>

      {/* Tiny hint */}
      <div
        style={{
          marginTop: 6,
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        Need a template? Download below
      </div>
    </div>
  )
}
