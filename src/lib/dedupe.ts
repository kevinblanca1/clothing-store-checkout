import type { Product } from "@/types/product";

/**
 * Removes duplicate products that share the same name, price, and category.
 * The first occurrence wins.
 */
export function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  const result: Product[] = [];

  for (const product of products) {
    const key = `${product.name.toLowerCase()}|${product.price}|${product.category.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(product);
  }

  return result;
}
