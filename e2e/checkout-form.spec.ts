import { test, expect, type Page } from "@playwright/test";
import { mockApi } from "./utils/mockApi";
import { addFirstProductToCart, openCart, fillValidCheckoutForm } from "./utils/flows";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

// Add the first product ($24.99) and navigate to checkout via in-app clicks so
// the in-memory cart survives (a full page load would wipe it).
async function gotoCheckoutWithItem(page: Page) {
  await addFirstProductToCart(page);
  await openCart(page);
  await page.getByRole("dialog").getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
}

// Scenario 5: field validation — negative paths then happy path.
test("checkout form enforces field validation", async ({ page }) => {
  await gotoCheckoutWithItem(page);

  // Negative: submitting empty surfaces every field error.
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByText("Please enter your full name")).toBeVisible();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText("Please enter your street address")).toBeVisible();
  await expect(page.getByText("Please enter your city")).toBeVisible();
  await expect(page.getByText("Enter a valid postal code")).toBeVisible();

  // Negative: malformed email / postal are still rejected.
  await page.getByPlaceholder("jane@example.com").fill("not-an-email");
  await page.getByPlaceholder("12345").fill("!!");
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText("Enter a valid postal code")).toBeVisible();

  // Happy: valid input clears the errors.
  await fillValidCheckoutForm(page);
  await expect(page.getByText("Please enter your full name")).toBeHidden();
  await expect(page.getByText("Enter a valid email address")).toBeHidden();
  await expect(page.getByText("Enter a valid postal code")).toBeHidden();
});

// Scenario 5 (promo): invalid input, valid happy path, discount math, removal.
test("promo code rejects invalid input and applies/removes the SAVE10 discount", async ({
  page,
}) => {
  await gotoCheckoutWithItem(page);

  // Baseline: no discount line for a fresh cart.
  await expect(page.getByText("Discount (10%)")).toBeHidden();

  // Negative: an unknown code is rejected and applies no discount.
  await page.getByPlaceholder("SAVE10").fill("BOGUS");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText('Invalid promo code. Try "SAVE10".')).toBeVisible();
  await expect(page.getByText("Discount (10%)")).toBeHidden();

  // Happy: SAVE10 applies 10% off → $24.99 − $2.50 = $22.49.
  await page.getByPlaceholder("SAVE10").fill("SAVE10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("SAVE10 applied")).toBeVisible();
  await expect(page.getByText("Discount (10%)")).toBeVisible();
  await expect(page.getByText("−$2.50")).toBeVisible();
  // Discounted total drives the submit button.
  await expect(page.getByRole("button", { name: /\$22\.49$/ })).toBeVisible();

  // Remove the promo → discount reverts, total back to the undiscounted $24.99.
  await page.getByRole("button", { name: "Remove promo code" }).click();
  await expect(page.getByText("Discount (10%)")).toBeHidden();
  await expect(page.getByRole("button", { name: /\$24\.99$/ })).toBeVisible();
});

// Scenario 5 (promo flow): the discounted total is what actually gets charged.
test("an order placed with SAVE10 charges the discounted total", async ({ page }) => {
  await gotoCheckoutWithItem(page);

  await page.getByPlaceholder("SAVE10").fill("SAVE10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("SAVE10 applied")).toBeVisible();

  await fillValidCheckoutForm(page);
  await page.getByRole("button", { name: /Place order/ }).click();

  await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
  await expect(page.getByText("We charged $22.49.")).toBeVisible();
});
