import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { makeLineKey, type CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/money";

const variant = { size: "M", color: "Black" } as const;
const item: CartItem = {
  lineKey: makeLineKey(1, variant),
  productId: 1,
  name: "Classic Tee",
  price: 20,
  image: "",
  variant,
  quantity: 2,
};

const seededCart = { cart: { items: [item], promoCode: null } };

describe("CartLineItem", () => {
  it("renders the name, variant and line total", () => {
    renderWithProviders(<CartLineItem item={item} />, { preloadedState: seededCart });

    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    expect(screen.getByText("Black")).toBeInTheDocument();
    expect(screen.getByText("Size M")).toBeInTheDocument();
    // price * quantity = 20 * 2 = 40
    expect(screen.getByText(formatCurrency(40))).toBeInTheDocument();
  });

  it("dispatches updateQuantity when the stepper changes", async () => {
    const { store, user } = renderWithProviders(<CartLineItem item={item} />, {
      preloadedState: seededCart,
    });

    await user.click(screen.getByLabelText("Increase quantity"));
    expect(store.getState().cart.items[0].quantity).toBe(3);
  });

  it("removes the line from the cart when the remove button is clicked", async () => {
    const { store, user } = renderWithProviders(<CartLineItem item={item} />, {
      preloadedState: seededCart,
    });

    await user.click(screen.getByLabelText("Remove Classic Tee"));
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it("disables the decrement button at quantity 1 (cannot go below the minimum)", () => {
    const single = { ...item, quantity: 1 };
    renderWithProviders(<CartLineItem item={single} />, {
      preloadedState: { cart: { items: [single], promoCode: null } },
    });

    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
  });
});
