/**
 * fakestoreapi has no size/color data, so we synthesize a consistent set of
 * variant options applied to every product. Selection happens before a product
 * is added to the cart (quick-add popover on the listing, or the detail page).
 */

export const SIZES = ["XS", "S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

export interface ColorOption {
  name: string;
  hex: string;
}

export const COLORS: readonly ColorOption[] = [
  { name: "Black", hex: "#1f2937" },
  { name: "White", hex: "#f9fafb" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Gray", hex: "#6b7280" },
  { name: "Olive", hex: "#4d5d3a" },
] as const;

export type ColorName = (typeof COLORS)[number]["name"];

export interface Variant {
  size: Size;
  color: ColorName;
}

export const DEFAULT_VARIANT: Variant = {
  size: "M",
  color: COLORS[0].name,
};

export function colorHex(name: ColorName): string {
  return COLORS.find((c) => c.name === name)?.hex ?? "#000000";
}
