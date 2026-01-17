import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Example utility functions to test
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

async function fetchData(id: string): Promise<{ id: string; value: number }> {
  // Simulating an async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, value: Math.random() });
    }, 100);
  });
}

describe("Utility Functions", () => {
  describe("add", () => {
    it("should add two positive numbers", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("should handle negative numbers", () => {
      expect(add(-1, 5)).toBe(4);
      expect(add(-3, -2)).toBe(-5);
    });

    it("should handle zero", () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe("multiply", () => {
    it("should multiply two numbers", () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it("should return zero when multiplying by zero", () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe("formatCurrency", () => {
    it("should format USD by default", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
    });

    it("should format EUR when specified", () => {
      expect(formatCurrency(1234.56, "EUR")).toBe("€1,234.56");
    });

    it("should handle whole numbers", () => {
      expect(formatCurrency(100)).toBe("$100.00");
    });
  });

  describe("fetchData (async)", () => {
    it("should return data with the correct id", async () => {
      const result = await fetchData("test-123");
      expect(result.id).toBe("test-123");
      expect(typeof result.value).toBe("number");
    });
  });
});

describe("Mocking Examples", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should mock a function", () => {
    const mockFn = vi.fn((x: number) => x * 2);

    expect(mockFn(5)).toBe(10);
    expect(mockFn).toHaveBeenCalledWith(5);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should spy on console.log", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    console.log("test message");

    expect(consoleSpy).toHaveBeenCalledWith("test message");
    consoleSpy.mockRestore();
  });

  it("should work with fake timers", () => {
    const callback = vi.fn();

    setTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
