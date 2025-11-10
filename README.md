# MaterialReactTable Drag-and-Drop Demo# DraggableTable - Enterprise React Component# MaterialReactTable Drag & Drop Demo



A production-ready React component demonstrating drag-and-drop row reordering and nesting with MaterialReactTable.



## ✨ FeaturesA production-ready, type-safe drag-and-drop table component built with React, TypeScript, and MaterialReactTable. Features row reordering and nesting with visual feedback.This project demonstrates drag-and-drop row reordering with MaterialReactTable using native HTML5 drag-and-drop APIs.



- **Row Reordering** - Drag rows to reposition them above or below other rows

- **Nested Rows** - Drag rows onto other rows to create parent-child relationships

- **Visual Feedback** - Clear drop zone indicators (above, over, below)## 🏗️ Architecture## Features

- **Type-Safe** - Full TypeScript support with generic types

- **SOLID Architecture** - Clean, modular code following best practices

- **Zero External Drag Libraries** - Uses native HTML5 Drag and Drop API

This project follows **SOLID principles** and enterprise best practices with a modular, testable architecture:- ✨ **Drag-and-drop row reordering** with visual feedback

## 🚀 Quick Start

- 🎯 **Drop intent indicators**: Shows where the row will be placed (above, over, or below target)

### Installation

### Component Structure- 🎨 **Material Design UI** with Material-UI components

```bash

npm install- ⚡ **Built with Vite** for fast development experience

```

```

### Development

src/components/DraggableTable/## Tech Stack

```bash

npm run dev├── index.ts                    # Public API exports

```

├── types.ts                    # TypeScript type definitions- **React 19** with TypeScript

Open [http://localhost:5173](http://localhost:5173) to view the demo.

├── utils.ts                    # Pure utility functions- **MaterialReactTable** - Advanced table component

### Build

├── useDragAndDrop.ts          # Custom hook for drag logic- **Material-UI** - Material Design components

```bash

npm run build└── DraggableTable.tsx         # Main wrapper component- **Emotion** - CSS-in-JS styling

```

```- **Vite** - Fast build tool

## 📖 Usage



### Basic Example

### Design Principles Applied## Getting Started

```tsx

import { DraggableTable, type NestedRow } from './components/DraggableTable';



interface Person {#### **Single Responsibility Principle (SRP)**### Install dependencies

  id: string;

  name: string;- **`types.ts`**: Type definitions only```bash

  role: string;

}- **`utils.ts`**: Pure functions for drop intent classification and reorderingnpm install



function MyComponent() {- **`useDragAndDrop.ts`**: Drag state management and event handling```

  const [data, setData] = useState<NestedRow<Person>[]>([

    { id: "1", name: "Alice", role: "Manager" },- **`DraggableTable.tsx`**: UI composition and MaterialReactTable integration

    { id: "2", name: "Bob", role: "Developer" },

  ]);### Run development server



  const columns = [#### **Open/Closed Principle (OCP)**```bash

    { accessorKey: "name", header: "Name" },

    { accessorKey: "role", header: "Role" },- Component accepts generic type parameters (`<T extends BaseRow>`)npm run dev

  ];

- Extensible via `tableOptions` prop for custom MaterialReactTable configuration```

  return (

    <DraggableTable- Callbacks allow behavior extension without modifying core logic

      columns={columns}

      data={data}Visit [http://localhost:5173](http://localhost:5173) to see the demo.

      onDataChange={setData}

    />#### **Liskov Substitution Principle (LSP)**

  );

}- Generic `BaseRow` interface ensures any row type can be used### Build for production

```

- `NestedRow<T>` extends `BaseRow` maintaining contract compatibility```bash

### With Callbacks

npm run build

```tsx

<DraggableTable#### **Interface Segregation Principle (ISP)**```

  columns={columns}

  data={data}- Optional `DragCallbacks<T>` interface - consumers only implement needed callbacks

  onDataChange={setData}

  dragCallbacks={{- Separate interfaces for different concerns (`DragState`, `DragCallbacks`, etc.)## Component Details

    onDragStart: (rowId, row) => console.log("Drag started:", row),

    onDragOver: (sourceId, targetId, intent) => console.log("Dragging over:", intent),

    onDrop: (sourceId, targetId, intent, newData) => console.log("Dropped:", newData),

    onDragEnd: () => console.log("Drag ended"),#### **Dependency Inversion Principle (DIP)**The `MRT_DragIntentDemo` component showcases:

  }}

/>- Component depends on abstractions (`BaseRow`, `DragCallbacks`) not concrete types

```

- Inversion of control through callback props1. **Drag handles** - Click and drag the handle icon to reorder rows

## 🏗️ Architecture

2. **Visual feedback** - Colored indicators show where the row will drop:

The component follows SOLID principles with a modular structure:

## 🎯 Features   - Blue line above row = drop above

```

src/components/DraggableTable/   - Blue line below row = drop below

├── index.ts              # Public API exports

├── types.ts              # TypeScript type definitions- ✅ **Row Reordering**: Drag rows above/below others at the same level   - Blue background = replace/insert at row position

├── utils.ts              # Pure utility functions

├── useDragAndDrop.ts     # Custom hook for drag state- ✅ **Row Nesting**: Drag "over" a row to nest it as a child3. **Smooth reordering** - Rows reorder based on drop intent

└── DraggableTable.tsx    # Main component wrapper

```- ✅ **Visual Feedback**: Drop indicators show intent (above/over/below)



### Key Concepts- ✅ **Type Safety**: Full TypeScript generics support## Project Structure



- **`useDragAndDrop` Hook** - Manages drag state and event handlers- ✅ **Customizable**: Extensive configuration via props

- **`classifyDropIntent`** - Calculates drop zone (above/over/below) based on mouse position

- **`applyReorder`** - Performs immutable data transformations for reordering/nesting- ✅ **Performance Optimized**: Memoized calculations, state comparison```

- **Generic Types** - Supports any data type with `BaseRow` interface

- ✅ **Accessible**: Works with native HTML5 drag-and-dropsrc/

## 🎨 Customization

├── App.tsx                   # Main app component

### Drop Zone Sensitivity

## 📦 Installation├── MRT_DragIntentDemo.tsx    # Drag-and-drop table demo

Adjust the gutter size (default: 8px) to control drop zone sensitivity:

├── main.tsx                  # App entry point

```tsx

<DraggableTable```bash└── ...

  gutterSize={12}  // Larger gutters = easier to target above/below

  // ...npm install```

/>

``````



### Styling



The component uses MUI's `sx` prop for styling. Customize the drop zone visual feedback in `useDragAndDrop.ts`:## 🚀 Usage## React Compiler



```typescript

case 'above':

  return {### Basic ExampleThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

    boxShadow: 'inset 0 4px 0 0 #2196f3',  // Top shadow

    backgroundColor: 'rgba(33, 150, 243, 0.05)',

  };

``````tsx## Expanding the ESLint configuration



## 🛠️ Tech Stackimport { DraggableTable, type NestedRow } from './components/DraggableTable';



- **React 19** - Latest React with hooksIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- **TypeScript 5.9** - Full type safety

- **MaterialReactTable** - Advanced table componentinterface Person {

- **Material-UI** - Component library

- **Vite 7** - Fast build tool  id: string;```js

- **Native HTML5 Drag and Drop** - No external drag libraries

  name: string;export default defineConfig([

## 📝 API Reference

  role: string;  globalIgnores(['dist']),

### `DraggableTable` Props

}  {

| Prop | Type | Required | Description |

|------|------|----------|-------------|    files: ['**/*.{ts,tsx}'],

| `columns` | `MRT_ColumnDef<NestedRow<T>>[]` | ✅ | Column definitions |

| `data` | `NestedRow<T>[]` | ✅ | Table data with optional nested rows |function MyComponent() {    extends: [

| `onDataChange` | `(data: NestedRow<T>[]) => void` | ✅ | Callback when data changes |

| `dragCallbacks` | `DragCallbacks<T>` | ❌ | Optional lifecycle callbacks |  const [data, setData] = useState<NestedRow<Person>[]>([      // Other configs...

| `gutterSize` | `number` | ❌ | Drop zone gutter size (default: 8) |

| `tableOptions` | `Partial<MRT_TableOptions>` | ❌ | Additional MRT options |    { id: "1", name: "Alice", role: "Manager" },



### `NestedRow<T>` Interface    { id: "2", name: "Bob", role: "Developer" },      // Remove tseslint.configs.recommended and replace with this



```typescript  ]);      tseslint.configs.recommendedTypeChecked,

interface NestedRow<T extends BaseRow> extends T {

  subRows?: NestedRow<T>[];      // Alternatively, use this for stricter rules

}

```  const columns = useMemo(() => [      tseslint.configs.strictTypeChecked,



Your data type must extend `BaseRow`:    { accessorKey: "name", header: "Name" },      // Optionally, add this for stylistic rules



```typescript    { accessorKey: "role", header: "Role" },      tseslint.configs.stylisticTypeChecked,

interface BaseRow {

  id: string;  ], []);

}

```      // Other configs...



## 🤝 Contributing  return (    ],



Contributions are welcome! Feel free to:    <DraggableTable    languageOptions: {



- Report bugs      columns={columns}      parserOptions: {

- Suggest features

- Submit pull requests      data={data}        project: ['./tsconfig.node.json', './tsconfig.app.json'],



## 📄 License      onDataChange={setData}        tsconfigRootDir: import.meta.dirname,



MIT    />      },



## 🙏 Acknowledgments  );      // other options...



Built with [MaterialReactTable](https://www.material-react-table.com/) - an awesome React table library.}    },


```  },

])

### Advanced Example with Callbacks```



```tsxYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

<DraggableTable

  columns={columns}```js

  data={data}// eslint.config.js

  onDataChange={setData}import reactX from 'eslint-plugin-react-x'

  dragCallbacks={{import reactDom from 'eslint-plugin-react-dom'

    onDragStart: (rowId, row) => console.log("Started dragging:", row),

    onDragOver: (sourceId, targetId, intent) => {export default defineConfig([

      console.log(`Hovering ${sourceId} over ${targetId} (${intent})`);  globalIgnores(['dist']),

    },  {

    onDrop: (sourceId, targetId, intent, newData) => {    files: ['**/*.{ts,tsx}'],

      console.log("Drop complete, new structure:", newData);    extends: [

    },      // Other configs...

    onDragEnd: () => console.log("Drag operation ended"),      // Enable lint rules for React

  }}      reactX.configs['recommended-typescript'],

  gutterSize={12}      // Enable lint rules for React DOM

  tableOptions={{      reactDom.configs.recommended,

    enableSorting: false,    ],

    enableColumnActions: false,    languageOptions: {

  }}      parserOptions: {

/>        project: ['./tsconfig.node.json', './tsconfig.app.json'],

```        tsconfigRootDir: import.meta.dirname,

      },

## 🔧 API Reference      // other options...

    },

### `DraggableTable<T>` Props  },

])

| Prop | Type | Required | Description |```

|------|------|----------|-------------|
| `columns` | `MRT_ColumnDef<NestedRow<T>>[]` | ✅ | Column definitions |
| `data` | `NestedRow<T>[]` | ✅ | Table data with optional nested rows |
| `onDataChange` | `(newData: NestedRow<T>[]) => void` | ✅ | Callback when data changes |
| `dragCallbacks` | `DragCallbacks<T>` | ❌ | Optional lifecycle callbacks |
| `gutterSize` | `number` | ❌ | Drop zone size in pixels (default: 8) |
| `tableOptions` | `Partial<MRT_TableOptions<T>>` | ❌ | Additional MaterialReactTable options |

### Type Definitions

```typescript
interface BaseRow {
  id: string;
  [key: string]: any;
}

interface NestedRow<T extends BaseRow = BaseRow> extends BaseRow {
  subRows?: NestedRow<T>[];
}

type DropIntent = "above" | "over" | "below";

interface DragCallbacks<T extends BaseRow = BaseRow> {
  onDragStart?: (rowId: string, row: T) => void;
  onDragOver?: (sourceId: string, targetId: string, intent: DropIntent) => void;
  onDrop?: (sourceId: string, targetId: string, intent: DropIntent, newData: NestedRow<T>[]) => void;
  onDragEnd?: () => void;
}
```

## 🧪 Testing

The modular architecture makes unit testing straightforward:

```typescript
// Test utilities in isolation
import { classifyDropIntent, applyReorder } from './components/DraggableTable';

describe('classifyDropIntent', () => {
  it('returns "above" for top zone', () => {
    const rect = { top: 0, height: 30 } as DOMRect;
    expect(classifyDropIntent(5, rect)).toBe("above");
  });
});

// Test hook logic without UI
import { renderHook } from '@testing-library/react-hooks';
import { useDragAndDrop } from './components/DraggableTable';

describe('useDragAndDrop', () => {
  it('manages drag state correctly', () => {
    // Test implementation
  });
});
```

## 🏛️ Architecture Decisions

### Why box-shadow over pseudo-elements?

We use `box-shadow` with `inset` for drop indicators instead of `::before`/`::after` pseudo-elements because:
- Pseudo-elements create new DOM nodes that trigger `dragLeave` events
- box-shadow provides visual feedback without DOM mutation
- Better performance and no layout shifts

### Why native HTML5 drag-and-drop?

- No external library dependencies
- Native browser performance
- Accessible by default
- Smaller bundle size

### Why separate the hook from the component?

- **Testability**: Hook logic can be tested without rendering UI
- **Reusability**: Logic can be used in different table implementations
- **Clarity**: Clear separation of concerns

## 📚 File Descriptions

### `types.ts`
Type definitions following Interface Segregation Principle. All types are minimal and focused.

### `utils.ts`
Pure utility functions with no side effects. Fully testable in isolation.

### `useDragAndDrop.ts`
Custom hook encapsulating all drag-and-drop state management. Returns handlers and styles for the component to consume.

### `DraggableTable.tsx`
Presentation component that composes the hook with MaterialReactTable. Minimal logic, maximal composition.

### `index.ts`
Public API surface. Consumers only import from here, internal structure can change freely.

## 🎨 Styling

The component uses Material-UI's styling system with performance optimizations:

- `isolation: 'isolate'` creates stacking context to prevent z-index issues
- `willChange: 'box-shadow'` hints browser for GPU acceleration
- Memoized style functions prevent unnecessary recalculations

## 🔄 Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

This component follows strict architectural guidelines:

1. **No logic in the UI component** - keep `DraggableTable.tsx` focused on composition
2. **Pure functions only in utils** - no side effects allowed
3. **Type safety everywhere** - use generics, avoid `any`
4. **Test before committing** - maintain test coverage

## 📝 License

MIT

## 🙏 Credits

Built with:
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [MaterialReactTable](https://www.material-react-table.com/) - Table component
- [Material-UI](https://mui.com/) - Component library
- [Vite](https://vitejs.dev/) - Build tool
