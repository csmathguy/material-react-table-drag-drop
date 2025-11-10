import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
} from 'material-react-table';
import { useMemo } from 'react';
import type { BaseRow, NestedRow, DragCallbacks } from './types';
import { useDragAndDrop } from './useDragAndDrop';

export interface DraggableTableProps<T extends BaseRow> {
  /** Column definitions for the table */
  columns: MRT_ColumnDef<NestedRow<T>>[];
  
  /** Table data with optional nested rows */
  data: NestedRow<T>[];
  
  /** Callback when data changes due to drag-and-drop */
  onDataChange: (newData: NestedRow<T>[]) => void;
  
  /** Optional drag-and-drop lifecycle callbacks */
  dragCallbacks?: DragCallbacks<T>;
  
  /** Size of the drop zone gutters (default: 8px) */
  gutterSize?: number;
  
  /** Additional MaterialReactTable options */
  tableOptions?: Partial<MRT_TableOptions<NestedRow<T>>>;
}

/**
 * Generic draggable table component with row reordering and nesting
 * Wraps MaterialReactTable with drag-and-drop functionality
 */
export function DraggableTable<T extends BaseRow>({
  columns,
  data,
  onDataChange,
  dragCallbacks,
  gutterSize = 8,
  tableOptions = {},
}: DraggableTableProps<T>) {
  const { rowHandlers, getRowStyle, dragState } = useDragAndDrop({
    data,
    onDataChange,
    callbacks: dragCallbacks,
    gutterSize,
  });

  // Memoize table options with dragState as dependency to force re-render
  const tableConfig = useMemo(() => ({
    columns,
    data,
    getSubRows: (row: NestedRow<T>) => row.subRows,
    muiTableBodyRowProps: ({ row }: { row: any }) => {
      const rowId = row.original.id;
      const styles = getRowStyle(rowId);
      
      return {
        draggable: true,
        onDragStart: (e: any) => rowHandlers.onDragStart(e, rowId),
        onDragOver: (e: any) => rowHandlers.onDragOver(e, rowId),
        onDragLeave: rowHandlers.onDragLeave,
        onDrop: (e: any) => rowHandlers.onDrop(e, rowId),
        onDragEnd: rowHandlers.onDragEnd,
        sx: {
          ...styles,
          '& td': {
            isolation: 'isolate',
          },
        },
      };
    },
    enableExpanding: true,
    ...tableOptions,
  }), [columns, data, dragState, getRowStyle, rowHandlers, tableOptions]);

  const table = useMaterialReactTable(tableConfig);

  return <MaterialReactTable table={table} />;
}
