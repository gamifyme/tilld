import { migrate } from "drizzle-orm/better-sqlite3/migrator";

import { createDb, createSqliteConnection, getDatabaseUrl } from "./client";

const sqlite = createSqliteConnection();
const db = createDb(sqlite);

try {
  migrate(db, {
    migrationsFolder: "drizzle"
  });
  console.log(`Migrations applied to ${getDatabaseUrl()}`);
} finally {
  sqlite.close();
}
