import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest, RouteOptions } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    userId: number | null;
  }

  interface FastifyContextConfig {
    public?: boolean;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { userId: number };
    user: { userId: number };
  }
}

function withAuthPreHandler(routeOptions: RouteOptions, authenticate: FastifyInstance["authenticate"]) {
  if (routeOptions.config?.public) {
    return;
  }

  if (!routeOptions.preHandler) {
    routeOptions.preHandler = [authenticate];
    return;
  }

  if (Array.isArray(routeOptions.preHandler)) {
    routeOptions.preHandler = [authenticate, ...routeOptions.preHandler];
    return;
  }

  routeOptions.preHandler = [authenticate, routeOptions.preHandler];
}

export function configureAuth(app: FastifyInstance) {
  void app.register(fastifyJwt, {
    secret: app.getEnvs().jwtSecret
  });

  app.decorateRequest("userId", null);
  app.decorate("authenticate", async function authenticate(request, reply) {
    try {
      await request.jwtVerify();
      request.userId = request.user.userId;
    } catch {
      reply.code(401).send({ error: "Unauthorized" });
    }
  });

  app.addHook("onRoute", (routeOptions) => {
    withAuthPreHandler(routeOptions, app.authenticate);
  });
}
