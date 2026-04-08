import { buildApp } from "./app";

async function start() {
  const server = buildApp();
  const { port, host } = server.getEnvs();

  try {
    await server.listen({ port, host });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

void start();
