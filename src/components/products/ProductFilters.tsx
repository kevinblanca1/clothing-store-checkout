import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setSearch, setSort } from "@/features/products/productsSlice";
import {
  selectSearch,
  selectSortDir,
  selectSortKey,
} from "@/features/products/productsSelectors";
import type { SortKey } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "category", label: "Category" },
];

export function ProductFilters() {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const sortKey = useAppSelector(selectSortKey);
  const sortDir = useAppSelector(selectSortDir);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Search by name, price, or category…"
          className="pl-9"
          aria-label="Search products"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={sortKey}
          onValueChange={(value) => dispatch(setSort({ sortKey: value as SortKey, sortDir }))}
        >
          <SelectTrigger className="w-40" aria-label="Sort by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                Sort: {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          disabled={sortKey === "relevance"}
          aria-label={`Sort direction: ${sortDir === "asc" ? "ascending" : "descending"}`}
          onClick={() =>
            dispatch(setSort({ sortKey, sortDir: sortDir === "asc" ? "desc" : "asc" }))
          }
        >
          {sortDir === "asc" ? <ArrowDownAZ /> : <ArrowUpAZ />}
        </Button>
      </div>
    </div>
  );
}
