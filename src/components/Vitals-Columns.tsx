// vitals-columns.ts
import { createColumnHelper } from "@tanstack/react-table"
import type { Vitals } from "@/interfaces/interfaces"
import { getGCSSum } from "@/lib/utils"

const columnHelper = createColumnHelper<Vitals>()

export const vitalsColumns = [
  columnHelper.accessor("time", {
    header: () => "TIME",
    cell: info => (
        <span className="font-bold">
        [{info.getValue() ?? "-"}]
        </span>
    ),
  }),

  columnHelper.accessor("temp", {
    header: () => "TEMP",
    cell: info => info.getValue() ?? "—",
  }),

  columnHelper.accessor("BP", {
    header: () => "BP",
    cell: ({ getValue }) => {
      const bp = getValue()
      return bp?.systolic && bp?.diastolic
        ? `${bp.systolic}/${bp.diastolic}`
        : "—"
    },
  }),

  columnHelper.accessor("RR", {
    header: () => "RR",
    cell: info => info.getValue() ?? "—",
  }),

  columnHelper.accessor("Pulse", {
    header: () => "PULSE",
    cell: info => info.getValue() ?? "—",
  }),

  columnHelper.accessor("SpO2", {
    header: () => "SPO₂",
    cell: info => info.getValue() ?? "—",
  }),

  columnHelper.accessor("RBS", {
    header: () => "RBS",
    cell: info => info.getValue() ?? "—",
  }),

  columnHelper.accessor("GCS", {
    header: () => "GCS",
    cell: ({ getValue }) => {
      const gcs = getValue()
      if (!gcs?.eyeOpening || !gcs?.verbal || !gcs?.motor) return "—"
      return getGCSSum(gcs)
    },
  }),

  columnHelper.accessor("RTS", {
    header: () => "RTS",
    cell: info => info.getValue()?.toFixed(2) ?? "—",
  }),
]
