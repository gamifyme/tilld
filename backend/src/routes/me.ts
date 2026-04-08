import type { FastifyInstance } from "fastify";

export async function meRoutes(app: FastifyInstance) {
  app.get("/me", async (request) => {
    return { userId: request.userId };
  });
}
