import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { COLORS, SIZES, colorHex, type Variant } from "@/lib/variants";

interface VariantSelectorProps {
  value: Variant;
  onChange: (variant: Variant) => void;
  className?: string;
}

export function VariantSelector({ value, onChange, className }: VariantSelectorProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">Size</Label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const selected = value.size === size;
            return (
              <button
                key={size}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange({ ...value, size })}
                className={cn(
                  "min-w-9 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Color: <span className="text-foreground normal-case">{value.color}</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const selected = value.color === color.name;
            return (
              <button
                key={color.name}
                type="button"
                title={color.name}
                aria-label={color.name}
                aria-pressed={selected}
                onClick={() => onChange({ ...value, color: color.name })}
                className={cn(
                  "size-7 rounded-full border-2 transition-transform",
                  selected
                    ? "border-primary ring-2 ring-primary/30 scale-110"
                    : "border-input hover:scale-105",
                )}
                style={{ backgroundColor: colorHex(color.name) }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
