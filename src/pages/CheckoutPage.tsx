import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, ShoppingBag, Tag, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { applyPromo, clearCart, clearPromo, PROMO_CODE } from "@/features/cart/cartSlice";
import {
  selectCartItems,
  selectDiscount,
  selectIsPromoApplied,
  selectSubtotal,
  selectTotal,
} from "@/features/cart/cartSelectors";
import { checkoutSchema, type CheckoutFormValues } from "@/validation/checkoutSchema";
import { formatCurrency } from "@/lib/money";
import { colorHex } from "@/lib/variants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectSubtotal);
  const discount = useAppSelector(selectDiscount);
  const total = useAppSelector(selectTotal);
  const promoApplied = useAppSelector(selectIsPromoApplied);

  const [placedTotal, setPlacedTotal] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      promoCode: "",
    },
  });

  // location.key is "default" only when the user deep-linked straight to
  // /checkout (no in-app history to go back to), so fall back to home.
  const handleGoBack = () => {
    if (location.key === "default") navigate("/");
    else navigate(-1);
  };

  const handleRemovePromo = () => {
    dispatch(clearPromo());
    resetField("promoCode");
  };

  const handleApplyPromo = async () => {
    const valid = await trigger("promoCode");
    if (!valid) return;
    const code = (getValues("promoCode") ?? "").trim();
    if (code === "") {
      dispatch(clearPromo());
      toast.info("Promo code cleared");
      return;
    }
    dispatch(applyPromo(code));
    toast.success(`Promo "${code.toUpperCase()}" applied — 10% off!`);
  };

  const onSubmit = (values: CheckoutFormValues) => {
    const code = (values.promoCode ?? "").trim();
    if (code !== "") dispatch(applyPromo(code));
    else dispatch(clearPromo());

    setPlacedTotal(total);
    dispatch(clearCart());
    toast.success("Order placed! Thank you for shopping.");
  };

  if (placedTotal !== null) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <CheckCircle2 className="mx-auto size-14 text-green-600" />
        <h1 className="mt-4 text-2xl font-bold">Order confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We charged {formatCurrency(placedTotal)}. A confirmation is on its way.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add some items before checking out.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleGoBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Card>
            <CardHeader>
              <CardTitle>Contact & shipping</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message} className="sm:col-span-2">
                <Input {...register("fullName")} placeholder="Jane Doe" />
              </Field>
              <Field label="Email" error={errors.email?.message} className="sm:col-span-2">
                <Input type="email" {...register("email")} placeholder="jane@example.com" />
              </Field>
              <Field label="Address" error={errors.address?.message} className="sm:col-span-2">
                <Input {...register("address")} placeholder="123 Market St" />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <Input {...register("city")} placeholder="Springfield" />
              </Field>
              <Field label="Postal code" error={errors.postalCode?.message}>
                <Input {...register("postalCode")} placeholder="12345" />
              </Field>
            </CardContent>
          </Card>
        </form>

        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.lineKey} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-3 shrink-0 rounded-full border"
                      style={{ backgroundColor: colorHex(item.variant.color) }}
                    />
                    <span className="line-clamp-1">
                      {item.name}
                      <span className="text-muted-foreground">
                        {" "}
                        ({item.variant.size}) ×{item.quantity}
                      </span>
                    </span>
                  </div>
                  <span className="shrink-0 font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <Separator />

            <div className="space-y-1.5">
              <Label htmlFor="promoCode">Promo code (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="promoCode"
                  {...register("promoCode")}
                  placeholder={PROMO_CODE}
                  className="uppercase"
                  disabled={promoApplied}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={promoApplied}
                >
                  <Tag /> Apply
                </Button>
              </div>
              {errors.promoCode?.message && (
                <p className="text-xs text-destructive">{errors.promoCode.message}</p>
              )}
              {promoApplied && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle2 className="size-3" /> {PROMO_CODE} applied
                  <button
                    type="button"
                    aria-label="Remove promo code"
                    onClick={handleRemovePromo}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
            </div>

            <Separator />

            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <dt>Discount (10%)</dt>
                  <dd>−{formatCurrency(discount)}</dd>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
            </dl>

            <Button type="submit" form="checkout-form" size="lg" className="w-full" disabled={isSubmitting}>
              Place order · {formatCurrency(total)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ label, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
