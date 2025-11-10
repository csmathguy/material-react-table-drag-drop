# DraggableTable Quick Reference

## Import

```typescript
import { 
  DraggableTable, 
  type NestedRow,
  type DragCallbacks,
  type DropIntent 
} from './components/DraggableTable';
```

## Minimal Setup

```typescript
interface MyData {
  id: string;
  // ... your fields
}

const [data, setData] = useState<NestedRow<MyData>[]>([...]);

const columns: MRT_ColumnDef<NestedRow<MyData>>[] = [
  { accessorKey: "fieldName", header: "Header" },
];

<DraggableTable
  columns={columns}
  data={data}
  onDataChange={setData}
/>
```

## Drop Intent Zones

```
┌─────────────────────────────┐
│         ABOVE ZONE          │ ← Top 1/3 or 8px (whichever larger)
├─────────────────────────────┤
│                             │
│         OVER ZONE           │ ← Middle 1/3 (nests as child)
│                             │
├─────────────────────────────┤
│         BELOW ZONE          │ ← Bottom 1/3 or 8px (whichever larger)
└─────────────────────────────┘
```

## Callback Signatures

```typescript
dragCallbacks={{
  // Called when drag starts
  onDragStart: (rowId: string, row: T) => void
  
  // Called continuously while dragging over a row
  onDragOver: (sourceId: string, targetId: string, intent: DropIntent) => void
  
  // Called when row is dropped
  onDrop: (sourceId: string, targetId: string, intent: DropIntent, newData: NestedRow<T>[]) => void
  
  // Called when drag operation ends
  onDragEnd: () => void
}}
```

## Common Patterns

### Read-Only Dragging (Visual Only)

```typescript
<DraggableTable
  onDataChange={(newData) => {
    // Don't actually update
    console.log("Would update to:", newData);
  }}
/>
```

### Conditional Nesting

```typescript
dragCallbacks={{
  onDrop: (src, tgt, intent, newData) => {
    if (intent === "over" && !canNest(src, tgt)) {
      alert("Cannot nest this item");
      return; // Don't update
    }
    setData(newData);
  }
}}
```

### Async Persistence

```typescript
dragCallbacks={{
  onDrop: async (src, tgt, intent, newData) => {
    try {
      await api.saveOrder(newData);
      setData(newData);
      showSuccess("Order saved");
    } catch (err) {
      showError("Failed to save");
    }
  }
}}
```

### Prevent Nesting Entirely

```typescript
dragCallbacks={{
  onDrop: (src, tgt, intent, newData) => {
    if (intent === "over") {
      return; // Ignore "over" drops
    }
    setData(newData);
  }
}}
```

### Track Analytics

```typescript
dragCallbacks={{
  onDragStart: (id, row) => trackEvent("drag_start", { id }),
  onDrop: (src, tgt, intent) => trackEvent("drop", { src, tgt, intent })
}}
```

## Styling Examples

### Custom Drop Colors

```typescript
// Modify useDragAndDrop.ts getRowStyle function
boxShadow: 'inset 0 3px 0 0 #00FF00', // Green instead of blue
```

### Custom Cursor

```typescript
<DraggableTable
  tableOptions={{
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        cursor: 'move', // Instead of 'grab'
      }
    })
  }}
/>
```

## TypeScript Tips

### Extend BaseRow

```typescript
interface Person {
  id: string;  // Required by BaseRow
  name: string;
  email: string;
}

// NestedRow<Person> automatically adds optional subRows
const data: NestedRow<Person>[] = [
  { 
    id: "1", 
    name: "Alice", 
    email: "alice@example.com",
    subRows: [
      { id: "2", name: "Bob", email: "bob@example.com" }
    ]
  }
];
```

### Type-Safe Callbacks

```typescript
interface Person { id: string; name: string; }

const callbacks: DragCallbacks<Person> = {
  onDragStart: (rowId, row) => {
    // row is typed as Person
    console.log(row.name); // ✅ TypeScript knows this exists
  }
};
```

## Common Issues & Solutions

### Issue: Rows shift horizontally during drag
**Solution**: Already fixed! We use box-shadow instead of pseudo-elements.

### Issue: dragLeave fires when hovering over drop zones
**Solution**: Already handled! Child element detection prevents this.

### Issue: Dragged row disappears
**Solution**: Already fixed! Custom drag image prevents browser hiding.

### Issue: Nested rows don't expand
**Solution**: Ensure `enableExpanding` in `tableOptions`:

```typescript
tableOptions={{
  enableExpanding: true,
}}
```

### Issue: Can't drag newly added rows
**Solution**: Ensure each row has a unique `id`:

```typescript
const newRow: NestedRow<Person> = {
  id: crypto.randomUUID(), // ✅ Unique ID
  name: "New Person",
  role: "Developer"
};
```

## Performance Tips

1. **Memoize columns**: Use `useMemo` for column definitions
2. **Avoid inline callbacks**: Define callbacks outside render
3. **Batch updates**: Debounce rapid drag operations if needed
4. **Limit nesting depth**: Deep nesting impacts performance

```typescript
// ✅ Good
const columns = useMemo(() => [...], []);

// ❌ Bad
const columns = [...]; // Recreated every render
```

## Debugging

### Enable Console Logging

```typescript
dragCallbacks={{
  onDragStart: (id, row) => console.log("Start:", id, row),
  onDragOver: (src, tgt, intent) => console.log("Over:", src, "→", tgt, intent),
  onDragLeave: () => console.log("Leave"),
  onDrop: (src, tgt, intent, data) => console.log("Drop:", data),
  onDragEnd: () => console.log("End"),
}}
```

### Inspect Drag State

```typescript
// In useDragAndDrop.ts, add:
useEffect(() => {
  console.log("Drag State:", dragState);
}, [dragState]);
```

### Visualize Data Structure

```typescript
const visualize = (rows: NestedRow<any>[], indent = 0): void => {
  rows.forEach(row => {
    console.log("  ".repeat(indent) + row.id);
    if (row.subRows) visualize(row.subRows, indent + 1);
  });
};

visualize(data);
```

## Migration from Old Component

```typescript
// Before (monolithic component)
import MRT_DragIntentDemo from './MRT_DragIntentDemo';

// After (modular component)
import { DraggableTable } from './components/DraggableTable';

// Old API (embedded in large component)
<MRT_DragIntentDemo />

// New API (clean props interface)
<DraggableTable
  columns={columns}
  data={data}
  onDataChange={setData}
/>
```
