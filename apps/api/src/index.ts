import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { env } from "./env.js";
import { authRoutes } from "./routes/auth.js";

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));
app.route("/auth", authRoutes);

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Lexi API listening on http://localhost:${info.port}`);
});
