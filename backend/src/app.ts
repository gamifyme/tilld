import Fastify from "fastify";
import type { FastifyInstance } from "fastify";

import { getEnv } from "./config/env";
import { configureAuth } from "./plugins/auth";
import { authRoutes } from "./routes/auth";
import { healthRoutes } from "./routes/health";
import { meRoutes } from "./routes/me";

declare module "fastify" {
  interface FastifyInstance {
    getEnvs: () => ReturnType<typeof getEnv>;
  }
}

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: true
  });

  const envs = getEnv();
  app.decorate("getEnvs", () => envs);

  configureAuth(app);
  void app.register(healthRoutes);
  void app.register(authRoutes);
  void app.register(meRoutes);

  return app;
}
