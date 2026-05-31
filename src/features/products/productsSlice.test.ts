import { describe, expect, it } from "vitest";
import reducer, {
  fetchProductById,
  fetchProducts,
  setPage,
  setSearch,
  setSort,
  PRODUCTS_PER_PAGE,
  type ProductsState,
} from "@/features/products/productsSlice";
import {
  selectFilteredCount,
  selectPagedProducts,
  selectTotalPages,
} from "@/features/products/productsSelectors";
import type { RootState } from "@/app/store";
import type { Product } from "@/types/product";

const product = (overrides: Partial<Product> & { id: number }): Product => ({
  name: `Product ${overrides.id}`,
  price: 10,
  description: "",
  category: "misc",
  image: "",
  ...overrides,
});

const initial: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  current: null,
  currentStatus: "idle",
  currentError: null,
  search: "",
  sortKey: "relevance",
  sortDir: "asc",
  page: 1,
};

describe("productsSlice reducer", () => {
  it("sets the search term and resets to page 1", () => {
    const state = reducer({ ...initial, page: 4 }, setSearch("shirt"));
    expect(state.search).toBe("shirt");
    expect(state.page).toBe(1);
  });

  it("sets the sort and resets to page 1", () => {
    const state = reducer({ ...initial, page: 3 }, setSort({ sortKey: "price", sortDir: "desc" }));
    expect(state.sortKey).toBe("price");
    expect(state.sortDir).toBe("desc");
    expect(state.page).toBe(1);
  });

  it("sets the page without touching filters", () => {
    const state = reducer({ ...initial, search: "tee" }, setPage(2));
    expect(state.page).toBe(2);
    expect(state.search).toBe("tee");
  });

  it("stores items on fetchProducts.fulfilled", () => {
    const items = [product({ id: 1 }), product({ id: 2 })];
    const state = reducer(initial, fetchProducts.fulfilled(items, "", undefined));
    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(items);
  });

  it("records the error on fetchProducts.rejected", () => {
    const action = { type: fetchProducts.rejected.type, error: { message: "boom" } };
    const state = reducer({ ...initial, status: "loading" }, action);
    expect(state.status).toBe("failed");
    expect(state.error).toBe("boom");
  });

  it("stores the current product on fetchProductById.fulfilled", () => {
    const one = product({ id: 7 });
    const state = reducer(initial, fetchProductById.fulfilled(one, "", 7));
    expect(state.currentStatus).toBe("succeeded");
    expect(state.current).toEqual(one);
  });
});

describe("products selectors", () => {
  const stateWith = (overrides: Partial<ProductsState>) =>
    ({ products: { ...initial, ...overrides } }) as RootState;

  it("dedupes products sharing name, price, and category", () => {
    const items = [
      product({ id: 1, name: "Tee", price: 20, category: "tops" }),
      product({ id: 2, name: "Tee", price: 20, category: "tops" }), // duplicate
      product({ id: 3, name: "Tee", price: 25, category: "tops" }), // different price
    ];
    expect(selectFilteredCount(stateWith({ items }))).toBe(2);
  });

  it("paginates results, PRODUCTS_PER_PAGE per page", () => {
    const items = Array.from({ length: PRODUCTS_PER_PAGE + 3 }, (_, i) =>
      product({ id: i + 1, name: `Item ${i + 1}` }),
    );
    expect(selectPagedProducts(stateWith({ items, page: 1 }))).toHaveLength(PRODUCTS_PER_PAGE);
    expect(selectPagedProducts(stateWith({ items, page: 2 }))).toHaveLength(3);
    expect(selectTotalPages(stateWith({ items }))).toBe(2);
  });

  it("sorts by price ascending and descending", () => {
    const items = [
      product({ id: 1, name: "B", price: 30 }),
      product({ id: 2, name: "A", price: 10 }),
      product({ id: 3, name: "C", price: 20 }),
    ];
    const asc = selectPagedProducts(stateWith({ items, sortKey: "price", sortDir: "asc" }));
    expect(asc.map((p) => p.price)).toEqual([10, 20, 30]);

    const desc = selectPagedProducts(stateWith({ items, sortKey: "price", sortDir: "desc" }));
    expect(desc.map((p) => p.price)).toEqual([30, 20, 10]);
  });

  it("filters by fuzzy search across the catalog", () => {
    const items = [
      product({ id: 1, name: "Cotton T-Shirt", category: "tops" }),
      product({ id: 2, name: "Denim Jeans", category: "bottoms" }),
    ];
    const results = selectPagedProducts(stateWith({ items, search: "shirt" }));
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Cotton T-Shirt");
  });
});
