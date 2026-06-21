import type { Variant } from "@/lib/variants";

export interface CartItem {
  /** Unique line identifier = `${productId}-${size}-${color}`. */
  lineKey: string;
  productId: number;
  name: string;
  price: number;
  image: string;
  variant: Variant;
  quantity: number;
}

export interface User {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

/** Stable key for a product + variant combination. */
export function makeLineKey(productId: number, variant: Variant): string {
  return `${productId}-${variant.size}-${variant.color}`;
}
