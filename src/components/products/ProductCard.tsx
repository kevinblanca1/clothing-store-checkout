import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductImage } from "@/components/common/ProductImage";
import { QuickAddPopover } from "@/components/products/QuickAddPopover";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden pt-0 transition-shadow hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="aspect-square w-full"
          imgClassName="p-6"
        />
      </Link>

      <CardContent className="flex flex-1 flex-col gap-2">
        <Badge variant="secondary" className="w-fit capitalize">
          {product.category}
        </Badge>
        <Link
          to={`/products/${product.id}`}
          className="line-clamp-2 text-sm font-medium hover:underline"
        >
          {product.name}
        </Link>
        <p className="mt-auto text-lg font-semibold">{formatCurrency(product.price)}</p>
      </CardContent>

      <CardFooter>
        <QuickAddPopover product={product} />
      </CardFooter>
    </Card>
  );
}
