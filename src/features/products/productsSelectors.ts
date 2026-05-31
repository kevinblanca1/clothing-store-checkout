import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product } from "@/types/product";
import { dedupeProducts } from "@/lib/dedupe";
import { fuzzyFilterProducts } from "@/lib/fuzzy";
import { PRODUCTS_PER_PAGE } from "@/features/products/productsSlice";

const selectProductsState = (state: RootState) => state.products;

export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSearch = (state: RootState) => state.products.search;
export const selectSortKey = (state: RootState) => state.products.sortKey;
export const selectSortDir = (state: RootState) => state.products.sortDir;
export const selectPage = (state: RootState) => state.products.page;

export const selectCurrentProduct = (state: RootState) => state.products.current;
export const selectCurrentStatus = (state: RootState) => state.products.currentStatus;
export const selectCurrentError = (state: RootState) => state.products.currentError;

const selectDedupedProducts = createSelector([selectProductsState], (s) =>
  dedupeProducts(s.items),
);

/**
 * Deduped -> fuzzy filtered -> sorted.
 * "relevance" preserves Fuse's match-quality order (best first); the explicit
 * field sorts override it with a deterministic name/price/category ordering.
 */
const selectFilteredSortedProducts = createSelector(
  [selectDedupedProducts, selectSearch, selectSortKey, selectSortDir],
  (products, search, sortKey, sortDir): Product[] => {
    const filtered = fuzzyFilterProducts(products, search);
    if (sortKey === "relevance") return filtered;

    const dir = sortDir === "asc" ? 1 : -1;

    return [...filtered].sort((a, b) => {
      if (sortKey === "price") return (a.price - b.price) * dir;
      return a[sortKey].localeCompare(b[sortKey]) * dir;
    });
  },
);

export const selectFilteredCount = createSelector(
  [selectFilteredSortedProducts],
  (products) => products.length,
);

export const selectTotalPages = createSelector([selectFilteredCount], (count) =>
  Math.max(1, Math.ceil(count / PRODUCTS_PER_PAGE)),
);

/** Products for the current page (paging applied last, after filter + sort). */
export const selectPagedProducts = createSelector(
  [selectFilteredSortedProducts, selectPage],
  (products, page) => {
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  },
);
