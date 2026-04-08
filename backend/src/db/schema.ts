import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: text("created_at").notNull()
  },
  (table) => ({
    emailUnique: uniqueIndex("users_email_unique").on(table.email)
  })
);

export const activities = sqliteTable(
  "activities",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    name: text("name").notNull(),
    type: text("type", { enum: ["habit", "task"] }).notNull(),
    weight: integer("weight").notNull(),
    recurrenceRule: text("recurrence_rule", { mode: "json" }).$type<Record<string, unknown> | null>(),
    isPrivate: integer("is_private", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull(),
    archivedAt: text("archived_at")
  },
  (table) => ({
    userIdx: index("activities_user_id_idx").on(table.userId),
    activeUserIdx: index("activities_user_archived_idx").on(table.userId, table.archivedAt)
  })
);

export const commitments = sqliteTable(
  "commitments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activities.id),
    date: text("date").notNull(),
    createdAt: text("created_at").notNull()
  },
  (table) => ({
    userDateIdx: index("commitments_user_date_idx").on(table.userId, table.date),
    activityDateUnique: uniqueIndex("commitments_user_activity_date_unique").on(
      table.userId,
      table.activityId,
      table.date
    )
  })
);

export const entries = sqliteTable(
  "entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    commitmentId: integer("commitment_id")
      .notNull()
      .references(() => commitments.id),
    activityId: integer("activity_id")
      .notNull()
      .references(() => activities.id),
    date: text("date").notNull(),
    completedAt: text("completed_at").notNull()
  },
  (table) => ({
    userDateIdx: index("entries_user_date_idx").on(table.userId, table.date),
    commitmentUnique: uniqueIndex("entries_commitment_unique").on(table.commitmentId)
  })
);

export const passiveWins = sqliteTable(
  "passive_wins",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    note: text("note").notNull(),
    source: text("source").notNull(),
    date: text("date").notNull(),
    createdAt: text("created_at").notNull()
  },
  (table) => ({
    userDateIdx: index("passive_wins_user_date_idx").on(table.userId, table.date)
  })
);

export const friendships = sqliteTable(
  "friendships",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    friendId: integer("friend_id")
      .notNull()
      .references(() => users.id),
    status: text("status", { enum: ["pending", "accepted"] }).notNull(),
    createdAt: text("created_at").notNull()
  },
  (table) => ({
    userIdx: index("friendships_user_id_idx").on(table.userId),
    friendIdx: index("friendships_friend_id_idx").on(table.friendId),
    pairUnique: uniqueIndex("friendships_user_friend_unique").on(table.userId, table.friendId)
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Activity = typeof activities.$inferSelect;
export type Commitment = typeof commitments.$inferSelect;
export type Entry = typeof entries.$inferSelect;
export type PassiveWin = typeof passiveWins.$inferSelect;
export type Friendship = typeof friendships.$inferSelect;
