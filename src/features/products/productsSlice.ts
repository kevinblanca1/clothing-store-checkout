import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getProductById, getProducts } from "@/api/products";
import type { Product, SortDir, SortKey } from "@/types/product";

export const PRODUCTS_PER_PAGE = 8;

type Status = "idle" | "loading" | "succeeded" | "failed";

export interface ProductsState {
  items: Product[];
  status: Status;
  error: string | null;

  current: Product | null;
  currentStatus: Status;
  currentError: string | null;

  // UI / filter state
  search: string;
  sortKey: SortKey;
  sortDir: SortDir;
  page: number;
}

const initialState: ProductsState = {
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

export const fetchProducts = createAsyncThunk("products/fetchAll", () => getProducts());

export const fetchProductById = createAsyncThunk("products/fetchById", (id: number) =>
  getProductById(id),
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<{ sortKey: SortKey; sortDir: SortDir }>) {
      state.sortKey = action.payload.sortKey;
      state.sortDir = action.payload.sortDir;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load products";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
        state.current = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.error.message ?? "Failed to load product";
      });
  },
});

export const { setSearch, setSort, setPage } = productsSlice.actions;
export default productsSlice.reducer;
