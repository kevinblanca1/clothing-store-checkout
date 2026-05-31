import { describe, expect, it } from "vitest";
import { dedupeProducts } from "@/lib/dedupe";
import type { Product } from "@/types/product";

const make = (id: number, over: Partial<Product> = {}): Product => ({
  id,
  name: "Tee",
  price: 10,
  description: "",
  category: "shirts",
  image: "",
  ...over,
});

describe("dedupeProducts", () => {
  it("removes products sharing name, price, and category, keeping the first", () => {
    const result = dedupeProducts([make(1), make(2), make(3, { price: 20 })]);
    expect(result.map((p) => p.id)).toEqual([1, 3]);
  });

  it("treats differing category or price as distinct", () => {
    const result = dedupeProducts([
      make(1),
      make(2, { category: "pants" }),
      make(3, { price: 11 }),
    ]);
    expect(result).toHaveLength(3);
  });
});
