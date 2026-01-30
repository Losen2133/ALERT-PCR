// management-columns.ts
import { createColumnHelper } from "@tanstack/react-table"
import type { Management } from "@/interfaces/interfaces"

const columnHelper = createColumnHelper<Management>()

export const managementColumns = [
  columnHelper.accessor("time", {
    header: () => "TIME",
    cell: info => (
      <span className="font-bold">
        [{info.getValue() || "-"}]
      </span>
    ),
  }),

  columnHelper.accessor("care", {
    header: () => "CARE",
    cell: info => info.getValue() || "—",
  }),
]
