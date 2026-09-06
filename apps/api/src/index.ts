import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "./env";
import { authRoutes } from "./routes/auth";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
  }),
);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/auth", authRoutes);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Lexi API listening on http://localhost:${info.port}`);
});
