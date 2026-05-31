import { test, expect } from "@playwright/test";
import { mockApi } from "./utils/mockApi";
import { firstProduct } from "./fixtures/products";
import { openCart, fillValidCheckoutForm } from "./utils/flows";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

// Scenarios 6 & 8: the whole flow from browsing to a confirmed order, and the
// cart being reset afterwards.
test("a full purchase completes and resets the cart", async ({ page }) => {
  // Browse → product detail.
  await page.goto("/");
  await page.getByRole("link", { name: firstProduct.title }).first().click();
  await expect(page.getByRole("heading", { name: firstProduct.title })).toBeVisible();

  // Pick a variant + quantity, then add to cart.
  await page.getByRole("button", { name: "L", exact: true }).click();
  await page.getByLabel("Navy").click();
  await page.getByLabel("Increase quantity").click(); // quantity 2
  await page.getByRole("button", { name: "Add to cart" }).click();

  // Open cart → checkout.
  await openCart(page);
  await page.getByRole("dialog").getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  // Fill the form and place the order.
  await fillValidCheckoutForm(page);
  await page.getByRole("button", { name: /Place order/ }).click();

  // Confirmation screen (2 × $24.99 = $49.98).
  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  await expect(page.getByText("We charged $49.98.")).toBeVisible();

  // Cart was reset: back on the shop the badge shows 0 items.
  await page.getByRole("link", { name: "Continue shopping" }).click();
  await expect(page).toHaveURL(/localhost:5173\/$/);
  await expect(page.getByRole("button", { name: "Open cart, 0 items" })).toBeVisible();
});
