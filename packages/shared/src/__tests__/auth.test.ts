import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "../auth";

describe("registerSchema", () => {
  it("accepts a valid email and an 8+ character password", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "correct-horse",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "correct-horse",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("has the same shape as registerSchema", () => {
    const input = { email: "user@example.com", password: "correct-horse" };
    expect(loginSchema.safeParse(input).success).toBe(true);
  });
});
