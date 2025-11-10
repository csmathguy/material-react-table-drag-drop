/**
 * Type definitions for the DraggableTable component
 */

export type DropIntent = "above" | "over" | "below";

export interface DragState {
  activeRowId: string | null;
  targetRowId: string | null;
  intent: DropIntent | null;
}

export interface BaseRow {
  id: string;
  [key: string]: any;
}

export interface NestedRow<T extends BaseRow = BaseRow> extends BaseRow {
  subRows?: NestedRow<T>[];
}

export interface DragCallbacks<T extends BaseRow = BaseRow> {
  onDragStart?: (rowId: string, row: T) => void;
  onDragOver?: (sourceId: string, targetId: string, intent: DropIntent) => void;
  onDrop?: (sourceId: string, targetId: string, intent: DropIntent, newData: NestedRow<T>[]) => void;
  onDragEnd?: () => void;
}
