import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchProductById } from "@/features/products/productsSlice";
import {
  selectCurrentProduct,
  selectCurrentStatus,
} from "@/features/products/productsSelectors";
import { addItem } from "@/features/cart/cartSlice";
import { DEFAULT_VARIANT, type Variant } from "@/lib/variants";
import { formatCurrency } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/common/ProductImage";
import { VariantSelector } from "@/components/common/VariantSelector";
import { QuantityStepper } from "@/components/common/QuantityStepper";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCurrentProduct);
  const status = useAppSelector(selectCurrentStatus);

  const [variant, setVariant] = useState<Variant>(DEFAULT_VARIANT);
  const [quantity, setQuantity] = useState(1);

  const productId = Number(id);
  const [selectedId, setSelectedId] = useState(id);
  if (id !== selectedId) {
    setSelectedId(id);
    setVariant(DEFAULT_VARIANT);
    setQuantity(1);
  }

  useEffect(() => {
    if (!Number.isNaN(productId)) dispatch(fetchProductById(productId));
  }, [productId, dispatch]);

  if (
    Number.isNaN(productId) ||
    status === "failed" ||
    (status === "succeeded" && !product)
  ) {
    return <NotFoundPage />;
  }

  const handleAdd = () => {
    if (!product) return;
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        variant,
        quantity,
      }),
    );
    toast.success("Added to cart", {
      description: `${product.name} — ${variant.color}, ${variant.size} (×${quantity})`,
    });
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/">
          <ArrowLeft /> Back to shop
        </Link>
      </Button>

      {status === "loading" || status === "idle" || !product ? (
        <DetailSkeleton />
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="aspect-square w-full rounded-xl border"
            imgClassName="p-8"
          />

          <div className="space-y-5">
            <div className="space-y-2">
              <Badge variant="secondary" className="capitalize">
                {product.category}
              </Badge>
              <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
              <p className="text-2xl font-semibold">{formatCurrency(product.price)}</p>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <Separator />

            <VariantSelector value={variant} onChange={setVariant} />

            <div className="flex items-center gap-4">
              <QuantityStepper quantity={quantity} onChange={setQuantity} />
              <Button size="lg" className="flex-1" onClick={handleAdd}>
                <ShoppingCart /> Add to cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
