import { eq } from "drizzle-orm";

import { createDb, createSqliteConnection } from "./client";
import {
  activities,
  commitments,
  entries,
  friendships,
  passiveWins,
  users
} from "./schema";

const seedWeek = [
  "2026-04-06",
  "2026-04-07",
  "2026-04-08",
  "2026-04-09",
  "2026-04-10",
  "2026-04-11",
  "2026-04-12"
] as const;

async function seed() {
  const sqlite = createSqliteConnection();
  const db = createDb(sqlite);

  try {
    await db.delete(entries);
    await db.delete(commitments);
    await db.delete(passiveWins);
    await db.delete(friendships);
    await db.delete(activities);
    await db.delete(users);

    await db.insert(users).values([
      {
        email: "alex@example.com",
        passwordHash: "hash-alex",
        displayName: "Alex",
        createdAt: "2026-04-01T08:00:00.000Z"
      },
      {
        email: "blair@example.com",
        passwordHash: "hash-blair",
        displayName: "Blair",
        createdAt: "2026-04-01T08:05:00.000Z"
      }
    ]);

    const seededUsers = await db.select().from(users);
    const alex = seededUsers.find((user) => user.email === "alex@example.com");
    const blair = seededUsers.find((user) => user.email === "blair@example.com");

    if (!alex || !blair) {
      throw new Error("Seed users were not created correctly.");
    }

    await db.insert(activities).values([
      {
        userId: alex.id,
        name: "Morning Run",
        type: "habit",
        weight: 4,
        recurrenceRule: { frequency: "daily" },
        isPrivate: false,
        createdAt: "2026-04-01T08:10:00.000Z",
        archivedAt: null
      },
      {
        userId: alex.id,
        name: "Inbox Zero",
        type: "task",
        weight: 2,
        recurrenceRule: null,
        isPrivate: false,
        createdAt: "2026-04-01T08:15:00.000Z",
        archivedAt: null
      },
      {
        userId: alex.id,
        name: "Journal",
        type: "habit",
        weight: 3,
        recurrenceRule: { frequency: "daily" },
        isPrivate: true,
        createdAt: "2026-04-01T08:20:00.000Z",
        archivedAt: null
      },
      {
        userId: blair.id,
        name: "Strength Session",
        type: "habit",
        weight: 5,
        recurrenceRule: { frequency: "daily" },
        isPrivate: false,
        createdAt: "2026-04-01T08:25:00.000Z",
        archivedAt: null
      },
      {
        userId: blair.id,
        name: "Prepare Demo",
        type: "task",
        weight: 4,
        recurrenceRule: null,
        isPrivate: false,
        createdAt: "2026-04-01T08:30:00.000Z",
        archivedAt: null
      },
      {
        userId: blair.id,
        name: "Meditation",
        type: "habit",
        weight: 2,
        recurrenceRule: { frequency: "daily" },
        isPrivate: true,
        createdAt: "2026-04-01T08:35:00.000Z",
        archivedAt: null
      }
    ]);

    const alexActivities = await db.select().from(activities).where(eq(activities.userId, alex.id));
    const blairActivities = await db.select().from(activities).where(eq(activities.userId, blair.id));

    const alexRun = alexActivities.find((activity) => activity.name === "Morning Run");
    const alexInbox = alexActivities.find((activity) => activity.name === "Inbox Zero");
    const alexJournal = alexActivities.find((activity) => activity.name === "Journal");
    const blairStrength = blairActivities.find((activity) => activity.name === "Strength Session");
    const blairDemo = blairActivities.find((activity) => activity.name === "Prepare Demo");
    const blairMeditation = blairActivities.find((activity) => activity.name === "Meditation");

    if (!alexRun || !alexInbox || !alexJournal || !blairStrength || !blairDemo || !blairMeditation) {
      throw new Error("Seed activities were not created correctly.");
    }

    const commitmentRows = seedWeek.flatMap((date, index) => {
      const createdAt = `${date}T06:00:00.000Z`;

      return [
        { userId: alex.id, activityId: alexRun.id, date, createdAt },
        { userId: alex.id, activityId: alexJournal.id, date, createdAt },
        ...(index < 5 ? [{ userId: alex.id, activityId: alexInbox.id, date, createdAt }] : []),
        { userId: blair.id, activityId: blairStrength.id, date, createdAt },
        { userId: blair.id, activityId: blairMeditation.id, date, createdAt },
        ...(index === 2 || index === 4 ? [{ userId: blair.id, activityId: blairDemo.id, date, createdAt }] : [])
      ];
    });

    await db.insert(commitments).values(commitmentRows);

    const allCommitments = await db.select().from(commitments);
    const entryRows = allCommitments
      .filter((commitment, index) => index % 4 !== 0)
      .map((commitment) => ({
        userId: commitment.userId,
        commitmentId: commitment.id,
        activityId: commitment.activityId,
        date: commitment.date,
        completedAt: `${commitment.date}T20:00:00.000Z`
      }));

    await db.insert(entries).values(entryRows);

    await db.insert(passiveWins).values([
      {
        userId: alex.id,
        note: "Helped a teammate debug a release issue",
        source: "work",
        date: "2026-04-07",
        createdAt: "2026-04-07T21:00:00.000Z"
      },
      {
        userId: blair.id,
        note: "Walked to all meetings instead of driving",
        source: "health",
        date: "2026-04-10",
        createdAt: "2026-04-10T21:00:00.000Z"
      }
    ]);

    await db.insert(friendships).values([
      {
        userId: alex.id,
        friendId: blair.id,
        status: "accepted",
        createdAt: "2026-04-02T09:00:00.000Z"
      },
      {
        userId: blair.id,
        friendId: alex.id,
        status: "accepted",
        createdAt: "2026-04-02T09:00:00.000Z"
      }
    ]);

    console.log("Seed complete");
  } finally {
    sqlite.close();
  }
}

void seed();
