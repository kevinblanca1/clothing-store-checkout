import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { roundMoney } from "@/lib/money";
import { PROMO_CODE, PROMO_RATE } from "@/features/cart/cartSlice";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectPromoCode = (state: RootState) => state.cart.promoCode;

export const selectItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectSubtotal = createSelector([selectCartItems], (items) =>
  roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
);

export const selectIsPromoApplied = createSelector(
  [selectPromoCode],
  (code) => code === PROMO_CODE,
);

export const selectDiscount = createSelector(
  [selectSubtotal, selectIsPromoApplied],
  (subtotal, applied) => (applied ? roundMoney(subtotal * PROMO_RATE) : 0),
);

export const selectTotal = createSelector(
  [selectSubtotal, selectDiscount],
  (subtotal, discount) => roundMoney(subtotal - discount),
);
