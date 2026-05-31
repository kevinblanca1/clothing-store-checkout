import { describe, expect, it } from "vitest";
import { fuzzyFilterProducts } from "@/lib/fuzzy";
import type { Product } from "@/types/product";

const products: Product[] = [
  { id: 1, name: "Cotton T-Shirt", price: 19.99, description: "", category: "men's clothing", image: "" },
  { id: 2, name: "Gold Necklace", price: 250, description: "", category: "jewelery", image: "" },
  { id: 3, name: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin", price: 599, description: "", category: "electronics", image: "" },
];

describe("fuzzyFilterProducts", () => {
  it("matches across name", () => {
    expect(fuzzyFilterProducts(products, "shirt").map((p) => p.id)).toEqual([1]);
  });

  it("matches across category", () => {
    expect(fuzzyFilterProducts(products, "jewel").map((p) => p.id)).toEqual([2]);
  });

  it("matches across price", () => {
    expect(fuzzyFilterProducts(products, "250").map((p) => p.id)).toEqual([2]);
  });

  it("is case-insensitive (best match ranks first)", () => {
    const ids = fuzzyFilterProducts(products, "ACER").map((p) => p.id);
    expect(ids[0]).toBe(3);
  });

  it("tolerates typos", () => {
    expect(fuzzyFilterProducts(products, "axer").map((p) => p.id)).toContain(3);
  });

  it("does not match digits buried in another field", () => {
    // "12" should not surface the Acer via the "1920" in its name.
    expect(fuzzyFilterProducts(products, "12").map((p) => p.id)).not.toContain(3);
  });

  it("returns all products for a blank query", () => {
    expect(fuzzyFilterProducts(products, "   ")).toHaveLength(3);
  });
});
