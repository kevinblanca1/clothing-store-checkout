import type { Page } from "@playwright/test";
import { products } from "../fixtures/products";

// A 1×1 SVG, served in place of the (intentionally fake) product image URLs.
const PIXEL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';

/**
 * Stub the fakestoreapi.com endpoints so e2e runs are deterministic and offline.
 *
 * Patterns are anchored to the `fakestoreapi.com` host so they never intercept
 * the app's own document requests (e.g. navigating to `/products/99999`, which
 * would otherwise be served the JSON body instead of the SPA).
 *
 * Call this BEFORE `page.goto(...)`.
 */
export async function mockApi(page: Page) {
  // Serve a local 1×1 SVG for product images instead of hitting the real CDN.
  await page.route("**/img/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/svg+xml", body: PIXEL_SVG }),
  );

  // Single product by id: `fakestoreapi.com/products/123`. Return 404 for
  // unknown ids so the app's "Product not found" path (getProductById throws).
  await page.route(/fakestoreapi\.com\/products\/\d+$/, (route) => {
    const match = route.request().url().match(/\/products\/(\d+)$/);
    const id = match ? Number(match[1]) : NaN;
    const product = products.find((p) => p.id === id);

    if (!product) {
      return route.fulfill({ status: 404, contentType: "application/json", body: "null" });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(product),
    });
  });

  // Full catalog: `fakestoreapi.com/products`.
  await page.route(/fakestoreapi\.com\/products$/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(products),
    }),
  );
}
