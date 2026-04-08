import type { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get(
    "/health",
    {
      config: { public: true }
    },
    async () => {
      return { ok: true };
    }
  );
}
