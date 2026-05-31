import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { makeLineKey, type CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/money";

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  const variant = overrides.variant ?? ({ size: "M", color: "Black" } as const);
  const productId = overrides.productId ?? 1;
  return {
    lineKey: makeLineKey(productId, variant),
    productId,
    name: "Classic Tee",
    price: 20,
    image: "",
    variant,
    quantity: 1,
    ...overrides,
  };
}

describe("CartDrawer", () => {
  it("shows the empty state when there are no items", () => {
    renderWithProviders(<CartDrawer open onOpenChange={() => {}} />, {
      preloadedState: { cart: { items: [], promoCode: null } },
    });

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByText("Your Cart (0)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue shopping" })).toBeInTheDocument();
  });

  it("renders all line items, the item count and the subtotal", () => {
    const items = [
      makeItem({ name: "Classic Tee", productId: 1, price: 20, quantity: 2 }),
      makeItem({
        name: "Wool Hoodie",
        productId: 2,
        price: 50,
        quantity: 1,
        variant: { size: "L", color: "Navy" },
      }),
    ];

    renderWithProviders(<CartDrawer open onOpenChange={() => {}} />, {
      preloadedState: { cart: { items, promoCode: null } },
    });

    expect(screen.getByText("Classic Tee")).toBeInTheDocument();
    expect(screen.getByText("Wool Hoodie")).toBeInTheDocument();
    // item count = 2 + 1 = 3
    expect(screen.getByText("Your Cart (3)")).toBeInTheDocument();
    // subtotal = 20*2 + 50*1 = 90
    expect(screen.getByText(formatCurrency(90))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Checkout" })).toBeInTheDocument();
  });
});
