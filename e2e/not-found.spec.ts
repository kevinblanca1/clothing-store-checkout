import { test, expect } from "@playwright/test";
import { mockApi } from "./utils/mockApi";
import { firstProduct } from "./fixtures/products";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

// Scenario 1: invalid URL → 404 page with a way back to the homepage.
test("an unknown URL renders the 404 page and links home", async ({ page }) => {
  await page.goto("/totally/invalid");

  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.getByRole("link", { name: "Back to homepage" }).click();

  await expect(page).toHaveURL(/localhost:5173\/$/);
  await expect(page.getByRole("link", { name: firstProduct.title }).first()).toBeVisible();
});

// Scenario 2: a product id that doesn't exist (API 404) → 404 page.
test("a missing product id renders the 404 page", async ({ page }) => {
  await page.goto("/products/99999");

  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.getByRole("link", { name: "Back to homepage" }).click();
  await expect(page).toHaveURL(/localhost:5173\/$/);
});
