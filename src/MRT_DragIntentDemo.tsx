import { useState, useMemo } from "react";
import { type MRT_ColumnDef } from "material-react-table";
import { IconButton, Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DraggableTable, type NestedRow } from "./components/DraggableTable";

interface Person {
  id: string;
  name: string;
  role: string;
}

const initialData: NestedRow<Person>[] = [
  { id: "1", name: "Alice", role: "Manager" },
  { id: "2", name: "Bob", role: "Developer" },
  { id: "3", name: "Charlie", role: "Designer" },
  { id: "4", name: "Diana", role: "Developer" },
  { id: "5", name: "Eve", role: "QA Engineer" },
];

/**
 * Demo component showcasing the DraggableTable wrapper
 * Demonstrates row reordering and nesting with minimal code
 */
export default function MRT_DragIntentDemo() {
  const [data, setData] = useState<NestedRow<Person>[]>(initialData);

  const columns = useMemo<MRT_ColumnDef<NestedRow<Person>>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 150,
      },
      {
        id: "drag-handle",
        header: "",
        size: 60,
        Cell: () => (
          <Tooltip title="Drag to reorder or nest">
            <IconButton size="small" sx={{ cursor: "grab" }}>
              <DragIndicatorIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  return (
    <DraggableTable
      columns={columns}
      data={data}
      onDataChange={setData}
      tableOptions={{
        enableColumnActions: false,
        enableSorting: false,
        enableBottomToolbar: false,
        positionActionsColumn: "last",
        enableExpanding: true,
      }}
    />
  );
}
