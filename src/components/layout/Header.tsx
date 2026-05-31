import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Shirt } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { selectItemCount } from "@/features/cart/cartSelectors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useAppSelector(selectItemCount);
  const { pathname } = useLocation();

  // On the checkout page the Order summary already serves as the cart, so the
  // mini-cart trigger is redundant (and its "Checkout" CTA would be a no-op).
  const showCart = pathname !== "/checkout";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Shirt className="size-5" />
          <span className="text-lg">ShopMe</span>
        </Link>

        {showCart && (
          <Button
            variant="outline"
            className="relative"
            aria-label={`Open cart, ${itemCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <Badge className="absolute -right-2 -top-2 size-5 justify-center rounded-full p-0 tabular-nums">
                {itemCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {showCart && <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />}
    </header>
  );
}
