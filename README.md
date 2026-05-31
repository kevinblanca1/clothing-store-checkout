# Clothing Store Checkout

A client-side clothing-store storefront and checkout demo. Browse a product catalog,
fuzzy-search and sort it, pick size/color variants, manage a cart with a promo code, and
complete a validated checkout form. Product data comes from the public
[fakestoreapi.com](https://fakestoreapi.com) mock API.

**Stack:** React 19 · TypeScript · Vite 8 · Redux Toolkit · React Router 7 ·
shadcn/ui (Radix) + Tailwind CSS v4 · react-hook-form + Zod · Fuse.js ·
Vitest (unit) + Playwright (e2e).

Routes (`src/App.tsx`):

| Path             | Page               |
| ---------------- | ------------------ |
| `/`              | Product list       |
| `/products/:id`  | Product detail     |
| `/checkout`      | Checkout           |
| `*`              | Not found          |

## Prerequisites

- **Node.js 22.x** — developed on `v22.19.0`. Vite 8 requires Node ≥ 20, which is enforced:
  `package.json` declares `engines.node: ">=20"` and `.npmrc` sets `engine-strict=true`, so
  `pnpm install` fails on an unsupported version. With
  [nvm](https://github.com/nvm-sh/nvm), a `.nvmrc` pins Node 22 — just run `nvm use`
  (or `nvm install`) in the repo root.
- **pnpm** — the package manager for this repo (it ships a `pnpm-lock.yaml`).
  Enable it with `corepack enable` (bundled with Node), or install globally via
  `npm install -g pnpm`.
- **Playwright browsers** (only needed to run e2e tests):
  `pnpm exec playwright install`.

## Getting started

```bash
pnpm install      # install dependencies
pnpm dev          # start the Vite dev server (HMR) at http://localhost:5173
```

## Commands

| Command                | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `pnpm dev`             | Start the dev server with hot module replacement      |
| `pnpm build`           | Type-check (`tsc -b`) and build for production         |
| `pnpm preview`         | Serve the production build locally                     |
| `pnpm lint`            | Run ESLint over the project                            |
| `pnpm test`            | Run unit tests once (Vitest)                           |
| `pnpm test:watch`      | Run unit tests in watch mode                           |
| `pnpm test:ui`         | Run Vitest with its interactive UI                     |
| `pnpm test:coverage`   | Run unit tests with a V8 coverage report               |
| `pnpm test:e2e`        | Run Playwright end-to-end tests                        |
| `pnpm test:e2e:ui`     | Run Playwright tests with its interactive UI           |

## Folder structure

```
src/
├── app/                  # Redux store (store.ts) + typed hooks (hooks.ts)
├── features/             # Redux Toolkit slices + memoized selectors
│   ├── products/         #   productsSlice, productsSelectors
│   └── cart/             #   cartSlice, cartSelectors
├── api/                  # axios client + product fetching/mapping
├── pages/                # Route-level components (List, Detail, Checkout, NotFound)
├── components/
│   ├── ui/               # shadcn/ui primitives (button, input, sheet, ...)
│   ├── products/         # Grid, card, filters, pagination, quick-add
│   ├── cart/             # Cart drawer + line items
│   ├── common/           # Reusable bits (VariantSelector, QuantityStepper, ...)
│   └── layout/           # AppLayout, Header
├── lib/                  # Pure helpers: fuzzy, money, dedupe, variants, utils
├── types/                # Shared TS types (product, cart)
├── validation/           # Zod schema for the checkout form
├── test/                 # Vitest setup + render-with-providers helper
├── App.tsx               # Route definitions
├── main.tsx              # App bootstrap (Redux Provider, Router, themes)
└── index.css             # Tailwind v4 + theme tokens

e2e/                      # Playwright specs, API mocks, and fixtures
```

## Tech stack & packages

**Core**
- `react`, `react-dom` — UI library (React 19)
- `react-router-dom` — client-side routing (v7)

**State**
- `@reduxjs/toolkit`, `react-redux` — store, slices, async thunks, memoized selectors

**Forms & validation**
- `react-hook-form`, `@hookform/resolvers`, `zod` — checkout form state + schema validation

**UI**
- `radix-ui`, `shadcn` — accessible component primitives (shadcn style `radix-nova`)
- `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css` — styling
- `class-variance-authority`, `clsx`, `tailwind-merge` — class composition
- `lucide-react` — icons · `sonner` — toasts
- `@fontsource-variable/geist` — font

**Data**
- `axios` — HTTP client for fakestoreapi
- `fuse.js` — fuzzy product search

**Dev & test**
- `vite`, `@vitejs/plugin-react` — build/dev tooling
- `vitest`, `@vitest/ui`, `@vitest/coverage-v8`, `jsdom`,
  `@testing-library/{react,jest-dom,user-event}` — unit testing
- `@playwright/test` — end-to-end testing
- `typescript`, `eslint`, `typescript-eslint`, `eslint-plugin-react-*` — types & linting

**Conventions**
- `@` is aliased to `src/` (see `vite.config.ts`), so imports use `@/features/...`.
- shadcn/ui is configured in `components.json` (style `radix-nova`, base color `neutral`,
  icon library `lucide`).

## Design decisions

### State shape

State lives in two Redux Toolkit slices (`src/app/store.ts`):

**`cart`** (`src/features/cart/cartSlice.ts`)

```ts
{ items: CartItem[]; promoCode: string | null }
```

- Each item carries a stable `lineKey = `${productId}-${size}-${color}`` (`src/types/cart.ts`).
  This makes the *same* product in different variants distinct cart lines, while re-adding a
  matching variant merges quantities instead of creating a duplicate.
- Promo handling is a single supported code, `SAVE10`, for 10% off
  (`PROMO_CODE` / `PROMO_RATE`).

**`products`** (`src/features/products/productsSlice.ts`)

```ts
{
  items, status, error,              // catalog list + load state
  current, currentStatus, currentError, // single-product (detail page) load state
  search, sortKey, sortDir, page,    // UI / filter state
}
```

- Server data is fetched with `createAsyncThunk` (`fetchProducts`, `fetchProductById`);
  list and detail loads track separate status/error so one can't clobber the other.
- Filter/sort/page UI state lives in the slice — not in component `useState` — for three
  reasons: it's an **input to the memoized list selectors** (`selectFilteredSortedProducts`,
  `selectPagedProducts`, `selectTotalPages`), it's **shared across sibling components**
  (`ProductFilters`, `PaginationControls`, `ProductGrid`) that would otherwise need lifted
  state and prop drilling, and it encodes a **cross-field rule** — `setSearch`/`setSort` reset
  `page` to 1 — that's cleaner to enforce in one reducer. Purely local UI state (drawer/popover
  open, checkout form fields) stays in components / `react-hook-form` instead.

**Derived data lives in memoized selectors, not in state** (`createSelector`):

- Cart totals — `selectItemCount`, `selectSubtotal`, `selectDiscount`, `selectTotal`
  (`cartSelectors.ts`).
- The catalog list is computed as a pipeline: **dedupe → fuzzy filter → sort → paginate**
  (`productsSelectors.ts`). Raw `items` stay as the single source of truth; everything the
  UI shows is recomputed (and memoized) from it.

### Component structure

- **Pages** (`src/pages`) are thin route components that compose feature components and read
  from the store.
- **`components/ui`** holds generated shadcn/ui primitives; the other `components/*` folders
  hold domain components (products, cart, layout) and shared building blocks (`common`).
- **`api` + `lib`** keep side effects (HTTP) and pure logic (money, fuzzy, dedupe, variants)
  out of components, which keeps them easy to unit-test.

### Trade-offs

- **API mapping** — fakestoreapi returns `title`; we map it to `name` at the API boundary
  (`src/api/products.ts`) so the rest of the app speaks one vocabulary.
- **Synthetic variants** — fakestoreapi has no size/color data, so a fixed set of variants is
  applied to every product (`src/lib/variants.ts`). Selection happens before add-to-cart.
- **Money rounding** — totals are rounded to cents via `roundMoney` to avoid floating-point
  drift (`src/lib/money.ts`).
- **Dedupe heuristic** — duplicates are detected by `name + price + category`, first occurrence
  wins (`src/lib/dedupe.ts`).
- **Fuzzy search tuning** — Fuse.js `threshold`/`distance`/`ignoreLocation` are tuned to favor
  prefix and substring matches while forgiving ~1 typo; the rationale is documented inline in
  `src/lib/fuzzy.ts`.
- **Catalog state in the store, not the URL** — search/sort/page are kept in Redux rather than
  the URL query string. This is simpler and keeps the list logic in one place, but the
  trade-off is that the current view isn't shareable/bookmarkable and resets on refresh. Moving
  it to the URL (e.g. `?q=shirt&page=2`) would be the upgrade path if shareable catalog links
  are ever needed.

## Known limitations

- **Mock backend.** Data comes from `fakestoreapi.com` (read-only, ~20 products). There is
  **no real checkout or payment** — order submission is simulated on the client.
- **No persistence.** Cart, promo code, and filter state are in-memory Redux only; a page
  refresh resets them.
- **No auth.** There are no user accounts, sessions, or order history.
- **Synthetic variants.** Size/color options are generated client-side with no real inventory
  or stock checks.
- **Single promo code.** Only `SAVE10` (10% off) is supported.
- **Client-side catalog operations.** Filtering, sorting, and pagination run over the full
  fetched list. That's fine for the small mock catalog, but it isn't designed for large
  catalogs or server-side paging.
