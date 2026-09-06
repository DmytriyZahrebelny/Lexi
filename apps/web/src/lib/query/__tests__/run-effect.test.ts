import { Effect } from "effect";
import { describe, expect, it } from "vitest";

import { runEffectPromise } from "../run-effect";

describe("runEffectPromise", () => {
  it("resolves with the success value", async () => {
    await expect(runEffectPromise(Effect.succeed(42))).resolves.toBe(42);
  });

  it("rejects with the raw failure value, not a FiberFailure wrapper", async () => {
    const error = new Error("boom");
    await expect(runEffectPromise(Effect.fail(error))).rejects.toBe(error);
  });
});
