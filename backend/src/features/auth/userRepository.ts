import { eq } from "drizzle-orm";

import { createDb, createSqliteConnection } from "../../db/client";
import { users, type NewUser, type User } from "../../db/schema";

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const sqlite = createSqliteConnection();
  const db = createDb(sqlite);

  try {
    return db.select().from(users).where(eq(users.email, email)).get();
  } finally {
    sqlite.close();
  }
}

export async function findUserById(id: number): Promise<User | undefined> {
  const sqlite = createSqliteConnection();
  const db = createDb(sqlite);

  try {
    return db.select().from(users).where(eq(users.id, id)).get();
  } finally {
    sqlite.close();
  }
}

export async function createUser(input: NewUser): Promise<User> {
  const sqlite = createSqliteConnection();
  const db = createDb(sqlite);

  try {
    db.insert(users).values(input).run();

    const created = db.select().from(users).where(eq(users.email, input.email)).get();

    if (!created) {
      throw new Error("User insert succeeded but no user record was returned.");
    }

    return created;
  } finally {
    sqlite.close();
  }
}
