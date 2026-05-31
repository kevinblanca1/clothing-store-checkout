import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantityStepper } from "@/components/common/QuantityStepper";

describe("QuantityStepper", () => {
  it("renders the current quantity", () => {
    render(<QuantityStepper quantity={3} onChange={() => {}} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("increments and decrements via the buttons", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper quantity={2} onChange={onChange} />);

    await user.click(screen.getByLabelText("Increase quantity"));
    expect(onChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByLabelText("Decrease quantity"));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("disables decrement at the minimum and does not fire onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper quantity={1} onChange={onChange} />);

    const decrement = screen.getByLabelText("Decrease quantity");
    expect(decrement).toBeDisabled();
    await user.click(decrement);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables increment at the maximum and does not fire onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityStepper quantity={99} onChange={onChange} />);

    const increment = screen.getByLabelText("Increase quantity");
    expect(increment).toBeDisabled();
    await user.click(increment);
    expect(onChange).not.toHaveBeenCalled();
  });
});
