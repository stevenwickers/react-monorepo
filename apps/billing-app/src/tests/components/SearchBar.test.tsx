import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "@/components/SearchBar";

describe("SearchBar", () => {
  it("renders with placeholder text", () => {
    const mockOnChange = vi.fn();

    render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        placeholder="Search products..."
      />,
    );

    expect(
      screen.getByPlaceholderText("Search products..."),
    ).toBeInTheDocument();
  });

  it("displays the current value", () => {
    const mockOnChange = vi.fn();

    render(
      <SearchBar
        value="test query"
        onChange={mockOnChange}
        placeholder="Search..."
      />,
    );

    expect(screen.getByDisplayValue("test query")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(
      <SearchBar value="" onChange={mockOnChange} placeholder="Search..." />,
    );

    const input = screen.getByRole("textbox", { name: /search products/i });
    await user.type(input, "hello");

    // onChange is called for each character typed
    expect(mockOnChange).toHaveBeenCalledTimes(5);
    expect(mockOnChange).toHaveBeenLastCalledWith("o");
  });

  it("has accessible label", () => {
    const mockOnChange = vi.fn();

    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(
      screen.getByRole("textbox", { name: /search products/i }),
    ).toBeInTheDocument();
  });

  it("renders search icon", () => {
    const mockOnChange = vi.fn();

    render(<SearchBar value="" onChange={mockOnChange} />);

    // Check that the SVG search icon is present
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
