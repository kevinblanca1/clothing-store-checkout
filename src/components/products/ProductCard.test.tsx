import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { ProductCard } from "@/components/products/ProductCard";
import { DEFAULT_VARIANT } from "@/lib/variants";
import { makeLineKey } from "@/types/cart";
import { formatCurrency } from "@/lib/money";
import type { Product } from "@/types/product";

const product: Product = {
  id: 7,
  name: "Classic Tee",
  price: 24.5,
  description: "A soft everyday tee.",
  category: "men's clothing",
  image: "https://example.com/tee.jpg",
};

describe("ProductCard", () => {
  it("renders the category, name, price and product links", () => {
    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText("men's clothing")).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(24.5))).toBeInTheDocument();

    // Both the image and the name link to the product detail page.
    const links = screen.getAllByRole("link", { name: "Classic Tee" });
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/products/7");
    }
  });

  it("adds the product with the default variant via quick-add", async () => {
    const { store, user } = renderWithProviders(<ProductCard product={product} />);

    // Open the quick-add popover, then confirm with its "Add to cart" button.
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    const popover = await screen.findByRole("dialog");
    await user.click(within(popover).getByRole("button", { name: /add to cart/i }));

    const { items } = store.getState().cart;
    expect(items).toHaveLength(1);
    expect(items[0].lineKey).toBe(makeLineKey(product.id, DEFAULT_VARIANT));
    expect(items[0].quantity).toBe(1);
  });
});
