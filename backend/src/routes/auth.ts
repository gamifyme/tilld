import type { FastifyInstance } from "fastify";

import { authenticateUser, registerUser } from "../features/auth/service";

type RegisterBody = {
  email?: string;
  password?: string;
  displayName?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterBody(body: RegisterBody) {
  if (!body.email || !isValidEmail(body.email)) {
    return "A valid email is required.";
  }

  if (!body.password || body.password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!body.displayName || !body.displayName.trim()) {
    return "Display name is required.";
  }

  return null;
}

function validateLoginBody(body: LoginBody) {
  if (!body.email || !isValidEmail(body.email)) {
    return "A valid email is required.";
  }

  if (!body.password) {
    return "Password is required.";
  }

  return null;
}

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: RegisterBody }>(
    "/auth/register",
    {
      config: { public: true }
    },
    async (request, reply) => {
      const validationError = validateRegisterBody(request.body ?? {});
      if (validationError) {
        return reply.code(400).send({ error: validationError });
      }

      const result = await registerUser({
        email: request.body.email!,
        password: request.body.password!,
        displayName: request.body.displayName!
      });

      if (!result.ok) {
        return reply.code(409).send({ error: "Email already registered." });
      }

      const token = await reply.jwtSign({ userId: result.user.id });
      return reply.code(201).send({
        token,
        user: {
          id: result.user.id,
          email: result.user.email,
          displayName: result.user.displayName
        }
      });
    }
  );

  app.post<{ Body: LoginBody }>(
    "/auth/login",
    {
      config: { public: true }
    },
    async (request, reply) => {
      const validationError = validateLoginBody(request.body ?? {});
      if (validationError) {
        return reply.code(400).send({ error: validationError });
      }

      const result = await authenticateUser({
        email: request.body.email!,
        password: request.body.password!
      });

      if (!result.ok) {
        return reply.code(401).send({ error: "Invalid email or password." });
      }

      const token = await reply.jwtSign({ userId: result.user.id });
      return reply.send({
        token,
        user: {
          id: result.user.id,
          email: result.user.email,
          displayName: result.user.displayName
        }
      });
    }
  );
}
