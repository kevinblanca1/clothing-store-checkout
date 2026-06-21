import type { Product } from "@/types/product";
import { PaginationControls } from "./PaginationControls";
import { ProductGrid } from "./ProductGrid";

export function ProductResult({ products }: { products: Product[] }) {
    return (
        <>
            <ProductGrid products={products} />
            <PaginationControls />
        </>
    );
}