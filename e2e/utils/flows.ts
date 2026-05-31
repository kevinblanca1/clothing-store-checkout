import { type Page, expect } from "@playwright/test";
import { firstProduct } from "../fixtures/products";

/**
 * Browse to the first product's detail page and add it to the cart. Cart state
 * lives in memory (Redux), so we always navigate via in-app clicks rather than
 * `page.goto`, which would reload and wipe the cart.
 */
export async function addFirstProductToCart(page: Page) {
  await page.goto("/");
  await page.getByRole("link", { name: firstProduct.title }).first().click();
  await expect(page.getByRole("heading", { name: firstProduct.title })).toBeVisible();
  await page.getByRole("button", { name: "Add to cart" }).click();
}

/** Open the mini-cart drawer from the header. */
export async function openCart(page: Page) {
  await page.getByRole("button", { name: /Open cart/ }).click();
}

/** Fill every required checkout field with valid values. */
export async function fillValidCheckoutForm(page: Page) {
  await page.getByPlaceholder("Jane Doe").fill("Jane Doe");
  await page.getByPlaceholder("jane@example.com").fill("jane@example.com");
  await page.getByPlaceholder("123 Market St").fill("123 Market St");
  await page.getByPlaceholder("Springfield").fill("Springfield");
  await page.getByPlaceholder("12345").fill("12345");
}
