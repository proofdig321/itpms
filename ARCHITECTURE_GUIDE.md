# ARCHITECTURE_GUIDE.md

## Module Structure Pattern

Every feature module follows this structure:

```
src/
├── app/(main)/dashboard/{module}/
│   ├── page.tsx                          # Server component, composes content
│   ├── error.tsx                         # Error boundary (client component)
│   └── _components/
│       ├── {module}-table.tsx            # Client component, renders data
│       ├── {module}-table-skeleton.tsx   # Loading placeholder
│       └── columns.tsx                   # TanStack Table column definitions
├── data/
│   └── {module}.ts                       # Mock data + TypeScript interface
└── lib/services/
    └── {module}.ts                       # Service abstraction layer
```

---

## Data Flow

```
data/{module}.ts  →  lib/services/{module}.ts  →  page.tsx  →  _components/
```

- **data/**: Raw mock data and type definitions. Never imported by UI directly.
- **lib/services/**: Async functions with try/catch. Only point of contact for data. Swap internals for `fetch()` when Laravel is ready.
- **page.tsx**: Server component. Calls service, passes data to client components.
- **_components/**: Client components. Receive data via props. No data fetching.

---

## Service Layer Contract

```typescript
// All functions are async (mirrors real API behaviour)
// All functions have try/catch with safe fallbacks
// UI only imports from lib/services/, never from data/

export async function getItems(): Promise<Item[]> {
  try {
    return mockItems;
  } catch {
    return [];
  }
}

export async function getItemById(id: string): Promise<Item | undefined> {
  try {
    return mockItems.find((item) => item.id === id);
  } catch {
    return undefined;
  }
}
```

---

## UI State Handling

Every module must handle three states:

| State   | Implementation                          |
|---------|-----------------------------------------|
| Loading | `<Suspense fallback={<Skeleton />}>`    |
| Error   | `error.tsx` with retry button           |
| Empty   | Inline empty state with icon + message  |

### Page pattern:

```tsx
import { Suspense } from "react";

async function Content() {
  const data = await getItems();
  return <ItemTable data={data} />;
}

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>...</h1>
        <p>...</p>
      </div>
      <Suspense fallback={<Skeleton />}>
        <Content />
      </Suspense>
    </div>
  );
}
```

### Error boundary pattern:

```tsx
"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong</p>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
```

### Empty state pattern:

```tsx
if (data.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border py-16 text-center">
      <Icon className="mb-3 h-10 w-10 text-muted-foreground" />
      <h3>No items found</h3>
      <p>Get started by creating your first item.</p>
    </div>
  );
}
```

---

## Status Indicators

All modules displaying status must use this colour mapping:

| Status      | Colour | Usage              |
|-------------|--------|--------------------|
| on-track    | GREEN  | Active, healthy    |
| at-risk     | AMBER  | Needs attention    |
| delayed     | RED    | Behind schedule    |
| completed   | GRAY   | Finished           |
| not-started | GRAY   | Not yet initiated  |

Badge styles use explicit `border + bg + text` for light/dark theme consistency.

---

## Server vs Client Rule

- `page.tsx` is a **Server Component** by default (no `"use client"` directive)
- Data fetching must happen in Server Components via the service layer
- Client components must NOT fetch data directly — they receive data via props only

### Correct pattern:

```
page.tsx (server)
  → calls service (async)
  → passes data to client table component (via props)
```

### Server Components:
- pages
- async data-fetching wrappers

### Client Components (`"use client"`):
- tables
- forms
- interactive UI logic
- error boundaries

### Suspense Rule:

Suspense only triggers correctly when wrapping an **async Server Component**:

```tsx
// ✅ Correct — Content is a server component (no "use client")
async function Content() {
  const data = await getItems();
  return <ClientTable data={data} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content />
    </Suspense>
  );
}
```

```tsx
// ❌ Wrong — fetching inside a client component
"use client";
export function Table() {
  const data = await getItems(); // Will not work
}
```

---

## Responsive Handling

- Table containers use `overflow-x-auto`
- Table cells use `whitespace-nowrap` to prevent awkward wrapping
- Layout relies on the dashboard shell's responsive sidebar behaviour

---

## Naming Conventions

- Route folders: kebab-case (`/dashboard/projects`)
- Component files: kebab-case (`projects-table.tsx`)
- Interfaces: PascalCase (`Project`)
- Service functions: camelCase (`getProjects`)
- Mock data files match module name (`projects.ts`)

---

## Modules Using This Pattern

- [x] Projects (reference implementation)
- [ ] Planning
- [ ] Monitoring

---

## Rules

- UI never imports from `data/` directly
- Services are the only abstraction for backend swap
- No speculative abstractions — build only what's needed
- Keep components focused and modular
- Preserve this pattern across all modules
