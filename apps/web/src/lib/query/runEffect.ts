import { Effect } from "effect";

/**
 * Bridges an Effect into a Promise for TanStack Query's queryFn/mutationFn.
 * Unwraps a failed Effect into a rejected promise carrying the tagged error
 * itself (rather than Effect's FiberFailure wrapper), so query/mutation
 * `error` values stay easy to inspect (e.g. `error._tag`, `error.message`).
 */
export function runEffectPromise<A, E>(effect: Effect.Effect<A, E>): Promise<A> {
  return Effect.runPromise(Effect.either(effect)).then((result) => {
    if (result._tag === "Left") {
      throw result.left;
    }
    return result.right;
  });
}
