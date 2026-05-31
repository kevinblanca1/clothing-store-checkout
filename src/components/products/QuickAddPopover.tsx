import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { addItem } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";
import { DEFAULT_VARIANT, type Variant } from "@/lib/variants";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VariantSelector } from "@/components/common/VariantSelector";

interface QuickAddPopoverProps {
  product: Product;
}

export function QuickAddPopover({ product }: QuickAddPopoverProps) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<Variant>(DEFAULT_VARIANT);

  const handleAdd = () => {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        variant,
      }),
    );
    toast.success("Added to cart", {
      description: `${product.name} — ${variant.color}, ${variant.size}`,
    });
    setOpen(false);
    setVariant(DEFAULT_VARIANT);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full" size="sm">
          <Plus /> Add to cart
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
          <VariantSelector value={variant} onChange={setVariant} />
          <Button className="w-full" onClick={handleAdd}>
            Add to cart
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
