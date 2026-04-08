import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";

import * as schema from "./schema";

function resolveDatabaseUrl() {
  const configured = process.env.DATABASE_URL;
  if (configured) {
    return path.isAbsolute(configured) ? configured : path.resolve(process.cwd(), configured);
  }

  return path.resolve(process.cwd(), "../data/tilld.db");
}

export function getDatabaseUrl() {
  return resolveDatabaseUrl();
}

export function createSqliteConnection() {
  return new Database(resolveDatabaseUrl());
}

export function createDb(connection = createSqliteConnection()) {
  return drizzle(connection, { schema });
}

export { schema };
