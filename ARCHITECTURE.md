# DraggableTable Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     MRT_DragIntentDemo                      │
│                    (Consumer/Demo)                          │
│  • Defines data shape (Person interface)                   │
│  • Manages state (useState)                                │
│  • Provides columns configuration                          │
│  • Passes callbacks for logging                            │
└─────────────────────────┬───────────────────────────────────┘
                          │ imports & uses
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   DraggableTable<T>                         │
│                 (Presentation Layer)                        │
│  • Generic wrapper component                               │
│  • Composes MaterialReactTable                             │
│  • Delegates drag logic to hook                            │
│  • Applies styles from hook                                │
└─────────────────────────┬───────────────────────────────────┘
                          │ uses
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                useDragAndDrop<T>                            │
│                 (Business Logic)                            │
│  • Manages drag state (activeRowId, targetRowId, intent)   │
│  • Handles all drag events (start, over, leave, drop, end) │
│  • Creates custom drag images                              │
│  • Generates dynamic row styles                            │
│  • Invokes callbacks at appropriate times                  │
└─────────────────────────┬───────────────────────────────────┘
                          │ calls
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        utils.ts                             │
│                  (Pure Functions)                           │
│  • classifyDropIntent() - determines above/over/below      │
│  • applyReorder() - performs reordering/nesting logic      │
│  • findRow() - recursive row search                        │
│  • deepClone() - immutable data operations                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        types.ts                             │
│                   (Type Definitions)                        │
│  • BaseRow - minimal row interface                         │
│  • NestedRow<T> - extends BaseRow with subRows            │
│  • DropIntent - "above" | "over" | "below"                │
│  • DragState - current drag operation state                │
│  • DragCallbacks<T> - optional lifecycle hooks            │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Drag Operation Lifecycle

```
User Interaction
       │
       ├─ onDragStart ──────────────────────────────────────┐
       │                                                     │
       │  1. Create custom drag image                       │
       │  2. Set drag state                                 │
       │  3. Call optional callback                         │
       │                                                     │
       ├─ onDragOver (continuous) ────────────────────────┐ │
       │                                                   │ │
       │  1. Calculate drop intent (classifyDropIntent)   │ │
       │  2. Update target & intent if changed            │ │
       │  3. Call optional callback                        │ │
       │  4. Return styles based on state                  │ │
       │                                                   │ │
       ├─ onDragLeave ────────────────────────────────────┤ │
       │                                                   │ │
       │  1. Check if leaving to child element            │ │
       │  2. Clear target state if truly leaving          │ │
       │                                                   │ │
       ├─ onDrop ─────────────────────────────────────────┤ │
       │                                                   │ │
       │  1. Call applyReorder() with drag state          │ │
       │  2. Update parent component data                  │ │
       │  3. Call optional callback with new data          │ │
       │                                                   │ │
       └─ onDragEnd ──────────────────────────────────────┤ │
                                                           │ │
          1. Clear all drag state                         │ │
          2. Call optional callback                        │ │
                                                           │ │
                                                           ▼ ▼
                                                      Cleanup
```

## SOLID Principles Application

### 1. Single Responsibility Principle (SRP)

```
types.ts          → Define contracts only
utils.ts          → Pure data transformations only
useDragAndDrop.ts → Drag state management only
DraggableTable.tsx → UI composition only
```

### 2. Open/Closed Principle (OCP)

```typescript
// Open for extension via generics
interface Person { id: string; name: string; }
interface Product { id: string; sku: string; }

<DraggableTable<Person> ... />
<DraggableTable<Product> ... />

// Open for extension via callbacks
dragCallbacks={{
  onDrop: (src, tgt, intent, data) => {
    // Custom business logic here
    trackAnalytics(src, tgt, intent);
    saveToDatabase(data);
  }
}}

// Open for extension via tableOptions
tableOptions={{
  enableFiltering: true,
  enablePagination: true,
  // Any MRT option
}}
```

### 3. Liskov Substitution Principle (LSP)

```typescript
// Any type extending BaseRow can substitute
interface BaseRow { id: string; }

interface Person extends BaseRow { name: string; }
interface Product extends BaseRow { sku: string; }

// Both work identically
const people: NestedRow<Person>[] = [...];
const products: NestedRow<Product>[] = [...];
```

### 4. Interface Segregation Principle (ISP)

```typescript
// Consumers only implement what they need
interface DragCallbacks<T> {
  onDragStart?: ...  // Optional
  onDragOver?: ...   // Optional
  onDrop?: ...       // Optional
  onDragEnd?: ...    // Optional
}

// Use only what you need
dragCallbacks={{
  onDrop: (src, tgt, intent, data) => saveData(data)
}}
```

### 5. Dependency Inversion Principle (DIP)

```typescript
// Component depends on abstractions, not concrete types
function useDragAndDrop<T extends BaseRow>({
  data: NestedRow<T>[],        // Abstract interface
  onDataChange: (NestedRow<T>[]) => void,  // Abstract callback
  callbacks?: DragCallbacks<T> // Abstract interface
}) { ... }

// Consumers provide concrete implementations
const [data, setData] = useState<NestedRow<Person>>([...]);
onDataChange={setData}  // Concrete implementation
```

## Performance Optimizations

1. **State Comparison in `handleDragOver`**
   - Prevents unnecessary re-renders
   - Only updates when target or intent changes

2. **Memoized Style Generation**
   - `useCallback` for `getRowStyle`
   - Styles only recalculate when drag state changes

3. **CSS Optimizations**
   - `isolation: 'isolate'` for stacking context
   - `willChange: 'box-shadow'` for GPU acceleration
   - box-shadow instead of pseudo-elements (no DOM mutation)

4. **Event Handling**
   - Child element detection in `dragLeave` prevents flickering
   - Custom drag image prevents browser hiding dragged element

## Testing Strategy

```
Unit Tests
├── utils.test.ts
│   ├── classifyDropIntent() with various mouse positions
│   ├── applyReorder() for above/over/below scenarios
│   └── Edge cases (empty arrays, nested structures)
│
├── useDragAndDrop.test.ts
│   ├── State updates on drag events
│   ├── Callback invocations
│   └── Style generation
│
Integration Tests
├── DraggableTable.test.tsx
│   ├── Renders with data
│   ├── Handles drag operations
│   └── Updates data correctly
│
E2E Tests
└── DragAndDrop.e2e.ts
    ├── User can drag rows
    ├── Visual feedback appears
    └── Data persists after drop
```

## Extensibility Examples

### Custom Drop Logic

```typescript
const customReorder = (src: string, tgt: string, intent: DropIntent, data: any[]) => {
  // Custom business rules
  if (intent === "over" && !canNest(src, tgt)) {
    showError("Cannot nest this item");
    return;
  }
  
  // Apply custom transformations
  const transformed = applyBusinessRules(data);
  setData(transformed);
};

<DraggableTable
  dragCallbacks={{ onDrop: customReorder }}
  ...
/>
```

### Custom Visual Feedback

```typescript
<DraggableTable
  tableOptions={{
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        // Custom styling
        '&:hover': {
          backgroundColor: 'custom.color'
        }
      }
    })
  }}
  ...
/>
```
