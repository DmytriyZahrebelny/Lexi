import { sign, verify } from "hono/jwt";

import { env } from "../env";

const JWT_ALG = "HS256";

export const SESSION_COOKIE_NAME = "lexi_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function createSessionToken(userId: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return sign({ sub: userId, exp }, env.JWT_SECRET, JWT_ALG);
}

export async function verifySessionToken(token: string): Promise<string> {
  const payload = await verify(token, env.JWT_SECRET, JWT_ALG);
  if (typeof payload.sub !== "string") {
    throw new Error("Invalid session token");
  }
  return payload.sub;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
