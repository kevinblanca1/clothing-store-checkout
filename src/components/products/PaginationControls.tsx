import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setPage } from "@/features/products/productsSlice";
import { selectPage, selectTotalPages } from "@/features/products/productsSelectors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaginationControls() {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const totalPages = useAppSelector(selectTotalPages);

  if (totalPages <= 1) return null;

  const goTo = (next: number) => dispatch(setPage(Math.min(Math.max(1, next), totalPages)));
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        <ChevronLeft />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="icon"
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
          className={cn("tabular-nums")}
          onClick={() => goTo(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
