// src/components/FileLoader.tsx
import { useState } from "react"
import { parseCsv } from "../engine/parseCsv"
import type { AggregatedRow } from "../engine/schema"
import { parseAggregatedRows } from "../engine/schema"

type Props = {
  onLoaded: (rows: AggregatedRow[]) => void
  onError: (msg: string) => void
}

export default function FileLoader(props: Props) {
  const [filename, setFilename] = useState("No file chosen")

  async function handleFile(file: File) {
    try {
      setFilename(file.name)

      const name = file.name.toLowerCase()
      const text = await file.text()

      if (name.endsWith(".json")) {
        props.onLoaded(parseAggregatedRows(JSON.parse(text)))
        return
      }

      if (name.endsWith(".csv")) {
        props.onLoaded(parseAggregatedRows(parseCsv(text)))
        return
      }

      props.onError("Unsupported file type. Please upload a .csv or .json file.")
    } catch (e: any) {
      props.onError(`Could not read file.\n\n${e?.message ?? String(e)}`)
    }
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <label className="cp-button-primary" style={{ position: "relative" }}>
        <span>Upload Dataset</span>
        <input
          type="file"
          accept=".csv,.json,application/json,text/csv"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            zIndex: 10,
          }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
            e.currentTarget.value = ""
          }}
        />
      </label>
      <div className="text-small text-muted" style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {filename}
      </div>
    </div>
  )
}
