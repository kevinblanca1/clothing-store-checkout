import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { makeLineKey, type CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/money";

const variant = { size: "M", color: "Black" } as const;
const item: CartItem = {
  lineKey: makeLineKey(1, variant),
  productId: 1,
  name: "Classic Tee",
  price: 50,
  image: "",
  variant,
  quantity: 2,
};

const seededCart = { cart: { items: [item], promoCode: null } };

async function fillValidForm(user: ReturnType<typeof renderWithProviders>["user"]) {
  await user.type(screen.getByPlaceholderText("Jane Doe"), "Jane Doe");
  await user.type(screen.getByPlaceholderText("jane@example.com"), "jane@example.com");
  await user.type(screen.getByPlaceholderText("123 Market St"), "123 Market St");
  await user.type(screen.getByPlaceholderText("Springfield"), "Springfield");
  await user.type(screen.getByPlaceholderText("12345"), "12345");
}

describe("CheckoutPage", () => {
  it("shows the empty-cart state when there are no items", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: { cart: { items: [], promoCode: null } },
    });

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse products" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    const { user } = renderWithProviders(<CheckoutPage />, { preloadedState: seededCart });

    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(await screen.findByText("Please enter your full name")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Please enter your street address")).toBeInTheDocument();
    expect(screen.getByText("Please enter your city")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid postal code")).toBeInTheDocument();
  });

  it("rejects an invalid promo code", async () => {
    const { user } = renderWithProviders(<CheckoutPage />, { preloadedState: seededCart });

    await user.type(screen.getByPlaceholderText("SAVE10"), "BOGUS");
    await user.click(screen.getByRole("button", { name: /apply/i }));

    expect(await screen.findByText('Invalid promo code. Try "SAVE10".')).toBeInTheDocument();
  });

  it("applies SAVE10 and reflects the 10% discount in the total", async () => {
    const { user } = renderWithProviders(<CheckoutPage />, { preloadedState: seededCart });

    await user.type(screen.getByPlaceholderText("SAVE10"), "SAVE10");
    await user.click(screen.getByRole("button", { name: /apply/i }));

    // subtotal = 50 * 2 = 100, discount = 10, total = 90
    expect(await screen.findByText("SAVE10 applied")).toBeInTheDocument();
    expect(screen.getByText(`−${formatCurrency(10)}`)).toBeInTheDocument();
    // Total appears in the summary row and on the submit button.
    expect(screen.getAllByText(formatCurrency(90)).length).toBeGreaterThan(0);
  });

  it("places an order, shows confirmation and clears the cart", async () => {
    const { store, user } = renderWithProviders(<CheckoutPage />, {
      preloadedState: seededCart,
    });

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(await screen.findByText("Order confirmed")).toBeInTheDocument();
    expect(store.getState().cart.items).toHaveLength(0);
  });
});
