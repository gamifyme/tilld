import Fastify from "fastify";

const server = Fastify({
  logger: true
});

const port = Number(process.env.PORT ?? 3002);
const host = process.env.HOST ?? "0.0.0.0";

server.get("/health", async () => {
  return { ok: true };
});

async function start() {
  try {
    await server.listen({ port, host });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

void start();
