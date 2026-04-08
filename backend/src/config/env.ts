type AppEnv = {
  databaseUrl: string;
  jwtSecret: string;
  port: number;
  host: string;
};

function requireNonEmpty(name: string, value: string | undefined) {
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getEnv(): AppEnv {
  return {
    databaseUrl: process.env.DATABASE_URL ?? "../data/tilld.db",
    jwtSecret: requireNonEmpty("JWT_SECRET", process.env.JWT_SECRET),
    port: Number(process.env.PORT ?? 3002),
    host: process.env.HOST ?? "0.0.0.0"
  };
}
