import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VariantSelector } from "@/components/common/VariantSelector";
import type { Variant } from "@/lib/variants";

const variant: Variant = { size: "M", color: "Black" };

describe("VariantSelector", () => {
  it("marks the active size and color as pressed", () => {
    render(<VariantSelector value={variant} onChange={() => {}} />);

    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "L" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    // Color buttons are exposed via aria-label.
    expect(screen.getByLabelText("Black")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText("Navy")).toHaveAttribute("aria-pressed", "false");
  });

  it("emits the merged variant when a new size is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<VariantSelector value={variant} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "L" }));
    expect(onChange).toHaveBeenCalledWith({ size: "L", color: "Black" });
  });

  it("emits the merged variant when a new color is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<VariantSelector value={variant} onChange={onChange} />);

    await user.click(screen.getByLabelText("Navy"));
    expect(onChange).toHaveBeenCalledWith({ size: "M", color: "Navy" });
  });
});
