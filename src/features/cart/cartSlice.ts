import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, User } from "@/types/cart";
import { makeLineKey } from "@/types/cart";
import type { Variant } from "@/lib/variants";

export const PROMO_CODE = "SAVE10";
export const PROMO_RATE = 0.1;

export interface CartState {
  items: CartItem[];
  promoCode: string | null;
  user: User | null;
}

const initialState: CartState = {
  items: [],
  promoCode: null,
  user: null,
};

export interface AddItemPayload {
  productId: number;
  name: string;
  price: number;
  image: string;
  variant: Variant;
  quantity?: number;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      const user = action.payload;

      state.user = {...user};
    },
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { productId, variant, quantity = 1 } = action.payload;
      const lineKey = makeLineKey(productId, variant);
      const existing = state.items.find((item) => item.lineKey === lineKey);

      if (existing) {
        existing.quantity += quantity;
        return;
      }

      state.items.push({
        lineKey,
        productId,
        name: action.payload.name,
        price: action.payload.price,
        image: action.payload.image,
        variant,
        quantity,
      });
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.lineKey !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ lineKey: string; quantity: number }>) {
      const { lineKey, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.lineKey !== lineKey);
        return;
      }
      const item = state.items.find((i) => i.lineKey === lineKey);
      if (item) item.quantity = quantity;
    },
    applyPromo(state, action: PayloadAction<string>) {
      state.promoCode = action.payload.trim().toUpperCase();
    },
    clearPromo(state) {
      state.promoCode = null;
    },
    clearCart(state) {
      state.items = [];
      state.promoCode = null;
    },
  },
});

export const { addItem, removeItem, updateQuantity, applyPromo, clearPromo, clearCart, addUser } =
  cartSlice.actions;
export default cartSlice.reducer;
