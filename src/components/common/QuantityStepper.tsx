import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn("inline-flex items-center rounded-md border", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Decrease quantity"
        disabled={quantity <= min}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus />
      </Button>
      <span className="w-9 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Increase quantity"
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}
