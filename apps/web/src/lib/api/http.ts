import { Data, Effect } from "effect";
import type { ZodType } from "zod";

export class NetworkError extends Data.TaggedError("NetworkError")<{
  cause: unknown;
}> {
  readonly message = "Could not reach the server. Check your connection and try again.";
}

export class HttpError extends Data.TaggedError("HttpError")<{
  status: number;
  message: string;
}> {}

export type ApiError = NetworkError | HttpError;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function fetchResponse(path: string, init?: RequestInit): Effect.Effect<Response, NetworkError> {
  return Effect.tryPromise({
    try: () =>
      fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...init?.headers },
      }),
    catch: (cause) => new NetworkError({ cause }),
  });
}

function readBody(response: Response): Effect.Effect<unknown, HttpError> {
  return Effect.tryPromise({
    try: async () => {
      const text = await response.text();
      return text.length > 0 ? JSON.parse(text) : undefined;
    },
    catch: () => new HttpError({ status: response.status, message: "Received an invalid response body." }),
  }).pipe(
    Effect.flatMap((body) =>
      response.ok ? Effect.succeed(body) : Effect.fail(new HttpError({ status: response.status, message: extractErrorMessage(body, response.status) })),
    ),
  );
}

function extractErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object" && "error" in body && typeof body.error === "string") {
    return body.error;
  }
  return `Request failed with status ${status}.`;
}

export function decode<T>(schema: ZodType<T>, data: unknown): Effect.Effect<T, HttpError> {
  return Effect.try({
    try: () => schema.parse(data),
    catch: () => new HttpError({ status: 500, message: "The server returned an unexpected response." }),
  });
}

export function apiRequest(path: string, init?: RequestInit): Effect.Effect<unknown, ApiError> {
  return fetchResponse(path, init).pipe(Effect.flatMap(readBody));
}
