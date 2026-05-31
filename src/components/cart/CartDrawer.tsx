import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import {
  selectCartItems,
  selectItemCount,
  selectSubtotal,
} from "@/features/cart/cartSelectors";
import { formatCurrency } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartLineItem } from "@/components/cart/CartLineItem";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const navigate = useNavigate();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectItemCount);
  const subtotal = useAppSelector(selectSubtotal);

  const goToCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Your Cart ({itemCount})</SheetTitle>
          <SheetDescription className="sr-only">
            Review the items in your cart, adjust quantities, and proceed to checkout.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <SheetClose asChild>
              <Button variant="outline">Continue shopping</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y overflow-y-auto px-4">
              {items.map((item) => (
                <CartLineItem key={item.lineKey} item={item} />
              ))}
            </div>

            <SheetFooter className="border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-base font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <Separator />
              <Button size="lg" onClick={goToCheckout}>
                Checkout
              </Button>
              <SheetClose asChild>
                <Button variant="ghost">Continue shopping</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
