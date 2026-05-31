import Fuse, { type IFuseOptions } from "fuse.js";
import type { Product } from "@/types/product";

/**
 * Fuse config: case-insensitive fuzzy search across name, price, and category.
 * `price` is numeric, so we stringify it via `getFn` to make it searchable.
 *
 * Location-aware scoring (ignoreLocation: false) with a generous `distance`
 * lets exact substrings match anywhere in a field (e.g. "shirt" -> "...T-Shirts"),
 * while still penalizing buried *fuzzy* matches. That keeps a query like "axer"
 * ranking the prefix match "Acer..." first instead of a mid-word coincidence
 * such as "...Windbreaker". `threshold` forgives ~1 typo without flooding.
 */
const fuseOptions: IFuseOptions<Product> = {
  keys: [
    { name: "name" },
    { name: "category" },
    { name: "price", getFn: (product) => String(product.price) },
  ],
  threshold: 0.28,
  distance: 400,
  ignoreLocation: false,
};

/**
 * Fuzzy filter products across name, price, and category (case-insensitive).
 * Returns all products for a blank query; otherwise returns Fuse matches,
 * ordered by relevance.
 */
export function fuzzyFilterProducts(products: Product[], query: string): Product[] {
  const trimmed = query.trim();
  if (trimmed === "") return products;

  const fuse = new Fuse(products, fuseOptions);
  return fuse.search(trimmed).map((result) => result.item);
}
