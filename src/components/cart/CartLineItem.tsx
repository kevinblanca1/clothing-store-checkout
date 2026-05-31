import { Trash2 } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { removeItem, updateQuantity } from "@/features/cart/cartSlice";
import type { CartItem } from "@/types/cart";
import { formatCurrency } from "@/lib/money";
import { colorHex } from "@/lib/variants";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/common/ProductImage";
import { QuantityStepper } from "@/components/common/QuantityStepper";

interface CartLineItemProps {
  item: CartItem;
}

export function CartLineItem({ item }: CartLineItemProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex gap-3 py-4">
      <ProductImage
        src={item.image}
        alt={item.name}
        className="size-20 shrink-0 rounded-md border"
        imgClassName="p-1.5"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={`Remove ${item.name}`}
            onClick={() => dispatch(removeItem(item.lineKey))}
          >
            <Trash2 />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="size-3 rounded-full border"
            style={{ backgroundColor: colorHex(item.variant.color) }}
          />
          <span>{item.variant.color}</span>
          <span aria-hidden>·</span>
          <span>Size {item.variant.size}</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <QuantityStepper
            quantity={item.quantity}
            onChange={(quantity) =>
              dispatch(updateQuantity({ lineKey: item.lineKey, quantity }))
            }
          />
          <span className="text-sm font-semibold">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
