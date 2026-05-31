import { test, expect } from "@playwright/test";
import { mockApi } from "./utils/mockApi";
import { firstProduct } from "./fixtures/products";
import { addFirstProductToCart, openCart } from "./utils/flows";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

// Scenario 7: empty cart state.
test("the cart starts empty", async ({ page }) => {
  await page.goto("/");
  await openCart(page);

  await expect(page.getByText("Your cart is empty.")).toBeVisible();
});

// Scenario 4: add a product, change quantity, remove it — totals stay correct.
test("adding, adjusting quantity and removing updates totals and badge", async ({ page }) => {
  await addFirstProductToCart(page); // quantity 1

  // Header badge reflects one item.
  await expect(page.getByRole("button", { name: "Open cart, 1 items" })).toBeVisible();

  await openCart(page);
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByText(firstProduct.title)).toBeVisible();

  // Increase to 2 → line total and subtotal both become $49.98 (24.99 × 2).
  await drawer.getByLabel("Increase quantity").click();
  await expect(page.getByText("$49.98")).toHaveCount(2);

  // The header (and its badge) is aria-hidden while the drawer is open, so
  // close the drawer before asserting the updated item count.
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open cart, 2 items" })).toBeVisible();

  // Reopen, remove the line → empty state returns.
  await openCart(page);
  await drawer.getByLabel(`Remove ${firstProduct.title}`).click();
  await expect(drawer.getByText("Your cart is empty.")).toBeVisible();
});
