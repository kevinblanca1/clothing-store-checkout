import { z } from "zod";
import { PROMO_CODE } from "@/features/cart/cartSlice";

/**
 * Promo code is optional. An empty/whitespace value is allowed (treated as
 * "no code"); a non-empty value must match the supported code (SAVE10).
 */
const promoCodeSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => !value || value.toUpperCase() === PROMO_CODE,
    { message: `Invalid promo code. Try "${PROMO_CODE}".` },
  );

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  email: z.email("Enter a valid email address"),
  address: z.string().trim().min(3, "Please enter your street address"),
  city: z.string().trim().min(2, "Please enter your city"),
  postalCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9 -]{3,10}$/, "Enter a valid postal code"),
  promoCode: promoCodeSchema,
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
