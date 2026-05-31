import { test, expect } from "@playwright/test";
import { mockApi } from "./utils/mockApi";
import { firstProduct } from "./fixtures/products";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

// Scenario 3: navigate to a product and assert its fields & controls.
test("product detail page shows the product's fields and controls", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: firstProduct.title }).first().click();

  await expect(page).toHaveURL(new RegExp(`/products/${firstProduct.id}$`));

  // Core fields from the fixture.
  await expect(page.getByRole("heading", { name: firstProduct.title })).toBeVisible();
  await expect(page.getByText("$24.99")).toBeVisible();
  await expect(page.getByText(firstProduct.description)).toBeVisible();
  await expect(page.getByText(firstProduct.category)).toBeVisible();

  // Variant selectors, quantity stepper and add-to-cart action.
  await expect(page.getByRole("button", { name: "M", exact: true })).toBeVisible();
  await expect(page.getByLabel("Navy")).toBeVisible();
  await expect(page.getByLabel("Increase quantity")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to cart" })).toBeVisible();
});
