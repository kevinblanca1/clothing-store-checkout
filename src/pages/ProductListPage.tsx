import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchProducts } from "@/features/products/productsSlice";
import {
  selectFilteredCount,
  selectPagedProducts,
  selectProductsError,
  selectProductsStatus,
} from "@/features/products/productsSelectors";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid, ProductGridSkeleton } from "@/components/products/ProductGrid";
import { PaginationControls } from "@/components/products/PaginationControls";

export function ProductListPage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const products = useAppSelector(selectPagedProducts);
  const totalCount = useAppSelector(selectFilteredCount);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Shop all</h1>
        <p className="text-sm text-muted-foreground">
          Browse our collection, search, and add your favorites to the cart.
        </p>
      </div>

      <ProductFilters />

      {status === "loading" || status === "idle" ? (
        <ProductGridSkeleton />
      ) : status === "failed" ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">{error ?? "Something went wrong."}</p>
          <Button onClick={() => dispatch(fetchProducts())}>Try again</Button>
        </div>
      ) : totalCount === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          No products match your search.
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          <PaginationControls />
        </>
      )}
    </div>
  );
}
