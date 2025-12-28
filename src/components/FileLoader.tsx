import { parseCSV } from "../engine/parseCsv"
import { validateDatasetJson, type AggregatedRow } from "../engine/schema"

export default function FileLoader(props: {
  onLoaded: (rows: AggregatedRow[]) => void
  onError: (msg: string) => void
}) {
  async function onUpload(file: File) {
    try {
      const text = await file.text()
      const ext = file.name.toLowerCase().split(".").pop()

      if (ext === "json") {
        const obj = JSON.parse(text)
        if (!validateDatasetJson(obj)) {
          throw new Error('Invalid JSON. Expected { schema_version:"1.0", rows:[...] } with valid rows.')
        }
        props.onLoaded(obj.rows)
        return
      }

      if (ext === "csv") {
        const rows = parseCSV(text)
        props.onLoaded(rows)
        return
      }

      throw new Error("Unsupported file type. Upload a .csv or .json file.")
    } catch (e: any) {
      props.onError(e?.message ?? "Failed to load dataset.")
    }
  }

  return (
    <label style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 14, opacity: 0.85 }}>Upload</span>
      <input
        type="file"
        accept=".csv,.json"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onUpload(f)
          e.currentTarget.value = ""
        }}
      />
    </label>
  )
}
