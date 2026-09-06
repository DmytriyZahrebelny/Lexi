import { userSchema, type LoginInput, type RegisterInput, type User } from "@lexi/shared";
import { Effect } from "effect";
import { apiRequest, decode, type ApiError } from "./http";

export function registerUser(input: RegisterInput): Effect.Effect<User, ApiError> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  }).pipe(Effect.flatMap((data) => decode(userSchema, data)));
}

export function loginUser(input: LoginInput): Effect.Effect<User, ApiError> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  }).pipe(Effect.flatMap((data) => decode(userSchema, data)));
}

export function logoutUser(): Effect.Effect<void, ApiError> {
  return apiRequest("/auth/logout", { method: "POST" }).pipe(Effect.asVoid);
}

export function fetchMe(): Effect.Effect<User, ApiError> {
  return apiRequest("/auth/me", { method: "GET" }).pipe(Effect.flatMap((data) => decode(userSchema, data)));
}
