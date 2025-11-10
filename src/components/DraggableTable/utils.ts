import type { DropIntent, NestedRow, BaseRow } from './types';

/**
 * Classifies drop position based on mouse Y coordinate within a row
 */
export function classifyDropIntent(
  clientY: number,
  rect: DOMRect,
  gutterSize: number = 8
): DropIntent {
  const relativeY = clientY - rect.top;
  const height = rect.height;
  const topZone = Math.max(gutterSize, height / 3);
  const bottomZoneStart = height - Math.max(gutterSize, height / 3);

  if (relativeY <= topZone) return "above";
  if (relativeY >= bottomZoneStart) return "below";
  return "over";
}

/**
 * Recursively finds a row by ID in a nested structure
 */
function findRow<T extends BaseRow>(
  rows: NestedRow<T>[],
  id: string,
  parentArray: NestedRow<T>[] = rows
): { row: NestedRow<T>; parent: NestedRow<T>[]; index: number } | null {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.id === id) {
      return { row, parent: parentArray, index: i };
    }
    if (row.subRows?.length) {
      const found = findRow(row.subRows as NestedRow<T>[], id, row.subRows as NestedRow<T>[]);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Deep clones row data to avoid mutations
 */
function deepClone<T extends BaseRow>(rows: NestedRow<T>[]): NestedRow<T>[] {
  return rows.map(row => ({
    ...row,
    subRows: row.subRows ? deepClone(row.subRows as NestedRow<T>[]) : undefined,
  }));
}

/**
 * Applies row reordering or nesting based on drag intent
 * - "above"/"below": Reorders at the same level
 * - "over": Nests the dragged row as a child of the target
 */
export function applyReorder<T extends BaseRow>(
  rows: NestedRow<T>[],
  sourceId: string,
  targetId: string,
  intent: DropIntent
): NestedRow<T>[] {
  if (sourceId === targetId && intent === "over") {
    return rows;
  }

  const clonedRows = deepClone(rows);
  const sourceInfo = findRow(clonedRows, sourceId);
  const targetInfo = findRow(clonedRows, targetId);

  if (!sourceInfo || !targetInfo) {
    return rows;
  }

  // Remove source from current location
  const [movedRow] = sourceInfo.parent.splice(sourceInfo.index, 1);

  // Handle nesting
  if (intent === "over") {
    // Prevent deeply nested structures
    delete movedRow.subRows;

    const updatedTargetInfo = findRow(clonedRows, targetId);
    if (!updatedTargetInfo) {
      return rows;
    }

    if (!updatedTargetInfo.row.subRows) {
      updatedTargetInfo.row.subRows = [];
    }
    updatedTargetInfo.row.subRows.push(movedRow);

    return clonedRows;
  }

  // Handle reordering at same level
  const updatedTargetInfo = findRow(clonedRows, targetId);
  if (!updatedTargetInfo) {
    return rows;
  }

  const insertIndex = intent === "above" 
    ? updatedTargetInfo.index 
    : updatedTargetInfo.index + 1;

  updatedTargetInfo.parent.splice(insertIndex, 0, movedRow);

  return clonedRows;
}
