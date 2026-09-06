import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema, type User } from "@lexi/shared";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { createSessionToken, SESSION_COOKIE_NAME, sessionCookieOptions } from "../lib/session.js";
import { requireAuth, type AuthVariables } from "../middleware/auth.js";

export const authRoutes = new Hono<{ Variables: AuthVariables }>();

function toUser(row: { id: string; email: string; createdAt: Date }): User {
  return { id: row.id, email: row.email, createdAt: row.createdAt.toISOString() };
}

authRoutes.post("/register", zValidator("json", registerSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    return c.json({ error: "Email is already registered" }, 409);
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(users).values({ email, passwordHash }).returning();
  if (!user) {
    return c.json({ error: "Failed to create user" }, 500);
  }

  const token = await createSessionToken(user.id);
  setCookie(c, SESSION_COOKIE_NAME, token, sessionCookieOptions);

  return c.json(toUser(user), 201);
});

authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const token = await createSessionToken(user.id);
  setCookie(c, SESSION_COOKIE_NAME, token, sessionCookieOptions);

  return c.json(toUser(user));
});

authRoutes.post("/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE_NAME, { path: "/" });
  return c.body(null, 204);
});

authRoutes.get("/me", requireAuth, async (c) => {
  const userId = c.get("userId");
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return c.json(toUser(user));
});

