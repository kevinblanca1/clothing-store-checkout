import { describe, expect, it } from "vitest";
import reducer, {
  addItem,
  applyPromo,
  clearCart,
  removeItem,
  updateQuantity,
  type CartState,
} from "@/features/cart/cartSlice";
import {
  selectDiscount,
  selectSubtotal,
  selectTotal,
} from "@/features/cart/cartSelectors";
import type { RootState } from "@/app/store";
import type { Variant } from "@/lib/variants";

const variantA: Variant = { size: "M", color: "Black" };
const variantB: Variant = { size: "L", color: "Navy" };

const base = {
  productId: 1,
  name: "Tee",
  price: 20,
  image: "",
};

const empty: CartState = { items: [], promoCode: null };

describe("cartSlice reducer", () => {
  it("merges quantity for the same product + variant", () => {
    let state = reducer(empty, addItem({ ...base, variant: variantA }));
    state = reducer(state, addItem({ ...base, variant: variantA, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("keeps different variants as separate lines", () => {
    let state = reducer(empty, addItem({ ...base, variant: variantA }));
    state = reducer(state, addItem({ ...base, variant: variantB }));
    expect(state.items).toHaveLength(2);
  });

  it("removes an item when quantity drops to zero", () => {
    let state = reducer(empty, addItem({ ...base, variant: variantA }));
    const { lineKey } = state.items[0];
    state = reducer(state, updateQuantity({ lineKey, quantity: 0 }));
    expect(state.items).toHaveLength(0);
  });

  it("removes an item by lineKey", () => {
    let state = reducer(empty, addItem({ ...base, variant: variantA }));
    state = reducer(state, removeItem(state.items[0].lineKey));
    expect(state.items).toHaveLength(0);
  });

  it("clears the cart and promo", () => {
    let state = reducer(empty, addItem({ ...base, variant: variantA }));
    state = reducer(state, applyPromo("SAVE10"));
    state = reducer(state, clearCart());
    expect(state).toEqual(empty);
  });
});

describe("cart selectors", () => {
  const stateWith = (cart: CartState) => ({ cart }) as RootState;

  it("computes subtotal across lines", () => {
    let cart = reducer(empty, addItem({ ...base, variant: variantA, quantity: 2 }));
    cart = reducer(cart, addItem({ ...base, variant: variantB }));
    expect(selectSubtotal(stateWith(cart))).toBe(60);
  });

  it("applies a 10% discount only for SAVE10 (case-insensitive)", () => {
    let cart = reducer(empty, addItem({ ...base, variant: variantA, quantity: 5 })); // 100
    expect(selectDiscount(stateWith(cart))).toBe(0);

    cart = reducer(cart, applyPromo("save10"));
    expect(selectDiscount(stateWith(cart))).toBe(10);
    expect(selectTotal(stateWith(cart))).toBe(90);
  });

  it("ignores an unknown promo code", () => {
    let cart = reducer(empty, addItem({ ...base, variant: variantA, quantity: 5 }));
    cart = reducer(cart, applyPromo("BOGUS"));
    expect(selectDiscount(stateWith(cart))).toBe(0);
  });
});
