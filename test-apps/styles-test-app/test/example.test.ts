import { describe, it, expect } from "vitest";

describe("Example Test Suite", () => {
  it("should pass a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("should work with strings", () => {
    const greeting = "Hello, Vitest!";
    expect(greeting).toContain("Vitest");
    expect(greeting).toHaveLength(14);
  });

  it("should work with arrays", () => {
    const fruits = ["apple", "banana", "cherry"];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain("banana");
    expect(fruits[0]).toBe("apple");
  });

  it("should work with objects", () => {
    const user = {
      name: "John",
      age: 30,
      active: true,
    };
    expect(user).toHaveProperty("name");
    expect(user.name).toBe("John");
    expect(user).toMatchObject({ name: "John", active: true });
  });
});
