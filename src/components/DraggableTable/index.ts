/**
 * DraggableTable - Enterprise-ready drag-and-drop table component
 * 
 * Features:
 * - Row reordering with visual feedback
 * - Nested row support
 * - Type-safe with TypeScript generics
 * - Follows SOLID principles
 * - Modular, testable architecture
 */

export { DraggableTable } from './DraggableTable';
export { useDragAndDrop } from './useDragAndDrop';
export { classifyDropIntent, applyReorder } from './utils';
export type {
  DropIntent,
  DragState,
  BaseRow,
  NestedRow,
  DragCallbacks,
} from './types';
export type { DraggableTableProps } from './DraggableTable';
