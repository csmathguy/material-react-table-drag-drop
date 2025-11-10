import { useState, useCallback, type DragEvent } from 'react';
import type { DragState, NestedRow, BaseRow, DragCallbacks } from './types';
import { classifyDropIntent, applyReorder } from './utils';

interface UseDragAndDropOptions<T extends BaseRow> {
  data: NestedRow<T>[];
  onDataChange: (newData: NestedRow<T>[]) => void;
  callbacks?: DragCallbacks<T>;
  gutterSize?: number;
}

interface UseDragAndDropReturn {
  dragState: DragState;
  rowHandlers: {
    onDragStart: (event: DragEvent<HTMLTableRowElement>, rowId: string) => void;
    onDragOver: (event: DragEvent<HTMLTableRowElement>, rowId: string) => void;
    onDragLeave: (event: DragEvent<HTMLTableRowElement>) => void;
    onDrop: (event: DragEvent<HTMLTableRowElement>, rowId: string) => void;
    onDragEnd: () => void;
  };
  getRowStyle: (rowId: string) => React.CSSProperties;
}

/**
 * Custom hook for drag-and-drop row reordering and nesting
 * Encapsulates all drag state management and event handling logic
 */
export function useDragAndDrop<T extends BaseRow>({
  data,
  onDataChange,
  callbacks,
  gutterSize = 8,
}: UseDragAndDropOptions<T>): UseDragAndDropReturn {
  const [dragState, setDragState] = useState<DragState>({
    activeRowId: null,
    targetRowId: null,
    intent: null,
  });

  // Create custom drag image to prevent browser styling
  const createDragImage = useCallback((element: HTMLElement): HTMLElement => {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.width = `${element.offsetWidth}px`;
    clone.style.opacity = '0.8';
    document.body.appendChild(clone);
    return clone;
  }, []);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLTableRowElement>, rowId: string) => {
      const target = event.currentTarget;
      const dragImage = createDragImage(target);

      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setDragImage(dragImage, 0, 0);

      setTimeout(() => document.body.removeChild(dragImage), 0);

      setDragState({
        activeRowId: rowId,
        targetRowId: null,
        intent: null,
      });

      // Find row data for callback
      const findRowData = (rows: NestedRow<T>[]): T | undefined => {
        for (const row of rows) {
          if (row.id === rowId) return row as T;
          if (row.subRows) {
            const found = findRowData(row.subRows as NestedRow<T>[]);
            if (found) return found;
          }
        }
      };

      const rowData = findRowData(data);
      if (rowData) {
        callbacks?.onDragStart?.(rowId, rowData);
      }
    },
    [createDragImage, callbacks, data]
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLTableRowElement>, rowId: string) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      const rect = event.currentTarget.getBoundingClientRect();
      const intent = classifyDropIntent(event.clientY, rect, gutterSize);

      setDragState(prev => {
        if (prev.targetRowId === rowId && prev.intent === intent) {
          return prev;
        }
        return {
          ...prev,
          targetRowId: rowId,
          intent,
        };
      });

      if (dragState.activeRowId) {
        callbacks?.onDragOver?.(dragState.activeRowId, rowId, intent);
      }
    },
    [gutterSize, callbacks, dragState.activeRowId]
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLTableRowElement>) => {
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && event.currentTarget.contains(relatedTarget)) {
      return;
    }

    setDragState(prev => ({
      ...prev,
      targetRowId: null,
      intent: null,
    }));
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLTableRowElement>, rowId: string) => {
      event.preventDefault();

      const { activeRowId, intent } = dragState;

      if (activeRowId && intent) {
        const newData = applyReorder(data, activeRowId, rowId, intent);
        onDataChange(newData);
        callbacks?.onDrop?.(activeRowId, rowId, intent, newData);
      }
    },
    [dragState, data, onDataChange, callbacks]
  );

  const handleDragEnd = useCallback(() => {
    setDragState({
      activeRowId: null,
      targetRowId: null,
      intent: null,
    });

    callbacks?.onDragEnd?.();
  }, [callbacks]);

  // Generate row styles based on drag state
  const getRowStyle = useCallback(
    (rowId: string): React.CSSProperties => {
      const isActive = dragState.activeRowId === rowId;
      const isTarget = dragState.targetRowId === rowId;
      const { intent } = dragState;

      if (isActive) {
        return {
          opacity: 0.5,
          cursor: 'grabbing',
        };
      }

      if (isTarget && intent) {
        const baseStyle: React.CSSProperties = {
          isolation: 'isolate',
          willChange: 'box-shadow',
        };

        switch (intent) {
          case 'above':
            return {
              ...baseStyle,
              boxShadow: 'inset 0 4px 0 0 #2196f3',
              backgroundColor: 'rgba(33, 150, 243, 0.05)',
            };
          case 'over':
            return {
              ...baseStyle,
              backgroundColor: 'rgba(33, 150, 243, 0.15)',
              outline: '2px solid #2196f3',
              outlineOffset: '-2px',
            };
          case 'below':
            return {
              ...baseStyle,
              boxShadow: 'inset 0 -4px 0 0 #2196f3',
              backgroundColor: 'rgba(33, 150, 243, 0.05)',
            };
        }
      }

      return {
        cursor: 'grab',
      };
    },
    [dragState]
  );

  return {
    dragState,
    rowHandlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onDragEnd: handleDragEnd,
    },
    getRowStyle,
  };
}
