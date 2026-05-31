import type { ReactElement, ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import productsReducer from "@/features/products/productsSlice";
import cartReducer from "@/features/cart/cartSlice";
import type { RootState } from "@/app/store";

/** Build a store with the real reducers, optionally seeded with state. */
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: { products: productsReducer, cart: cartReducer },
    preloadedState: preloadedState as RootState | undefined,
  });
}

export type AppStore = ReturnType<typeof makeStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  /** Initial history entries for the MemoryRouter (default ["/"]). */
  initialEntries?: string[];
}

/**
 * Render a component wrapped in a fresh Redux store + MemoryRouter so that
 * connected components (cart, header, checkout) work in isolation. Returns the
 * store and a configured userEvent instance alongside the usual render result.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = makeStore(preloadedState),
    initialEntries = ["/"],
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
