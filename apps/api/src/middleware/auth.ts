import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { SESSION_COOKIE_NAME, verifySessionToken } from "../lib/session";

export type AuthVariables = {
  userId: string;
};

export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE_NAME);
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const userId = await verifySessionToken(token);
    c.set("userId", userId);
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
});
