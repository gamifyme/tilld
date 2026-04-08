# CLAUDE.md — Tilld

You are building **Tilld**, a personal growth operating system. This file is your source of truth. Read it fully before writing any code.

---

## What Tilld is

Tilld helps people define the building blocks of their life, commit to them daily, and track follow-through over time. The name comes from "tilling" — the work of preparing soil before growth — and "till" as in until, implying continued effort.

**Core philosophy:**
- Points measure *agency* — intention plus execution only
- Passive wins measure *reality* — observed events, journaled but unscored
- The score is always a percentage of what the user committed to, never an absolute number
- 100% always means the same thing: you did what you said you would

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) |
| Backend | Fastify |
| ORM | Drizzle |
| Database | SQLite (better-sqlite3) |
| Language | TypeScript throughout |
| Infrastructure | Docker Compose + Caddy |

This app lives alongside Pothos (expense tracker) on the same server. Each app has its own SQLite file and runs on its own port. Caddy sits in front and routes by subdomain.

```
caddy (443)
  └── tilld.yourdomain.com → localhost:3002

/data/
  ├── pothos.db
  └── tilld.db
```

Fastify owns all data logic. Next.js is the view layer only — no server actions that touch the database directly. All data flows through the Fastify API.

---

## Core Entities

### Activity
The template — something the user defines once.

```ts
type ActivityType = 'habit' | 'task'

type Activity = {
  id: string
  userId: string
  name: string
  type: ActivityType
  weight: 1 | 2 | 3 | 4 | 5   // how much this affects the daily score
  recurrence: RecurrenceRule | null  // null = one-off task
  isPrivate: boolean
  createdAt: string
  archivedAt: string | null
}
```

**Habits** recur. **Tasks** are one-off or span a date range. Both are the same entity with different recurrence behaviour.

### Commitment
An explicit intention — the user assigning an activity to a specific day.

```ts
type Commitment = {
  id: string
  userId: string
  activityId: string
  date: string   // ISO date, YYYY-MM-DD
  createdAt: string
}
```

This is the denominator. A commitment row existing for a day means the user intended to do it. Absence of a row means not committed — never counted against the score.

### Entry
The execution — the user marking a commitment done.

```ts
type Entry = {
  id: string
  userId: string
  commitmentId: string
  activityId: string
  date: string
  completedAt: string
}
```

An entry existing means done. No entry against a commitment means missed. This is the numerator.

### Passive Win
An observed event — logged but never scored.

```ts
type PassiveWin = {
  id: string
  userId: string
  note: string
  source: string | null   // e.g. 'pothos', 'manual'
  date: string
  createdAt: string
}
```

---

## The Scoring Formula

This is the single most important rule. Never deviate from it.

```
daily score = Σ completed weights / Σ committed weights × 100
weekly score = Σ completed weights this week / Σ committed weights this week × 100
```

Where:
- **Committed weight** = sum of `activity.weight` for every commitment on that day
- **Completed weight** = sum of `activity.weight` for every commitment that has a corresponding entry

**Rules:**
- If committed weight is 0 for a day, score is `null` — no bar shown, treated as a rest day
- Tasks only contribute weight on the day they are committed to — never inflated across the week
- No multipliers, no streak bonuses, no arbitrary constants
- Score is always 0–100, always a percentage, always comparable across users

---

## Social Layer

The social layer shows friends' bars. It is **not a leaderboard**. No ranks, no raw points, no comparison of who has more activities.

Each friend's bar shows their daily or weekly completion percentage. That's it.

**Privacy:**
- Activities can be marked `isPrivate` — they are excluded from the score shown to friends
- Users can toggle a day private — their bar disappears from friends' view for that day
- Default is public

---

## Three States of a Day (per activity)

This is critical for correct scoring:

| State | Meaning | In database |
|---|---|---|
| Not committed | User didn't plan this activity today | No commitment row |
| Committed, missed | User planned it but didn't do it | Commitment row, no entry row |
| Committed, completed | User planned it and did it | Commitment row + entry row |

Never store "not committed" explicitly. Absence is the signal.

---

## What We Are Not Building

- No qualitative ratings or mood tracking
- No goal type (goals are just measurable habits with a target — handle at the habit level)
- No events (use a calendar app)
- No RPG skin, avatars, or virtual rewards
- No streak multipliers or point inflation
- No competitive leaderboard ranking

---

## Folder Structure

```
tilld/
  backend/
    src/
      db/
        schema.ts       # Drizzle schema
        index.ts        # DB connection
      routes/
        activities.ts
        commitments.ts
        entries.ts
        passiveWins.ts
        users.ts
        scores.ts
      plugins/
        auth.ts
      index.ts          # Fastify entry point
    drizzle.config.ts
    package.json

  frontend/
    app/
      (auth)/
        login/
      (app)/
        today/          # main daily view
        history/        # past scores, calendar grid
        activities/     # manage activities
        friends/        # social bar view
        settings/
    components/
    lib/
      api.ts            # typed fetch client
    package.json
```

---

## API Design Principles

- RESTful, no GraphQL
- All responses typed end to end — define response types in a shared `types/` package or inline
- Auth via JWT — issued on login, sent as Bearer token, validated in Fastify plugin
- Scores are always computed at query time, never stored
- Dates are always ISO strings (YYYY-MM-DD), times are ISO 8601 UTC

---

## Environment Variables

```bash
# backend
DATABASE_URL=./data/tilld.db
JWT_SECRET=your_secret_here
PORT=3002

# frontend
NEXT_PUBLIC_API_URL=https://tilld.yourdomain.com/api
```

---

## Code Style

- TypeScript strict mode always
- No `any` — if you don't know the type, model it properly
- Drizzle schema is the single source of truth for data shape
- Keep route handlers thin — business logic in service functions
- No inline SQL — use Drizzle query builder throughout
- Prefer explicit over clever

---

## Auth

Single user initially (just you). Multi-user ready from day one so friends can join later.

- Register with email + password (bcrypt)
- Login returns a JWT
- JWT contains `userId`, validated on every protected route
- No OAuth for now — keep it simple
