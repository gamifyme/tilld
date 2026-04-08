# PLAN.md — Tilld Build Plan

Spec driven development plan. Work through phases in order. Do not skip ahead. Each phase should be fully working before moving to the next.

---

## Phase 0 — Project Scaffold

**Goal:** Monorepo structure running locally with nothing broken.

Tasks:
- [ ] Create `tilld/` monorepo with `backend/` and `frontend/` directories
- [ ] Initialise `backend/` as a Fastify + TypeScript project
- [ ] Initialise `frontend/` as a Next.js + TypeScript project (App Router)
- [ ] Install Drizzle ORM + `better-sqlite3` in backend
- [ ] Create `drizzle.config.ts`
- [ ] Create `/data/` directory, add to `.gitignore` content but keep the folder
- [ ] Create `.env.example` for both backend and frontend
- [ ] Verify backend starts on port 3002 with a `/health` route returning `{ ok: true }`
- [ ] Verify frontend starts on port 3000 and renders a blank page without errors
- [ ] Create root `docker-compose.yml` with backend + frontend services

**Done when:** Both services start, `/health` returns 200, no TypeScript errors.

---

## Phase 1 — Database Schema

**Goal:** All tables defined, migrations run, schema is the source of truth.

Tasks:
- [ ] Define `users` table in `schema.ts`
- [ ] Define `activities` table in `schema.ts`
- [ ] Define `commitments` table in `schema.ts`
- [ ] Define `entries` table in `schema.ts`
- [ ] Define `passive_wins` table in `schema.ts`
- [ ] Define `friendships` table in `schema.ts` (userId, friendId, status)
- [ ] Run `drizzle-kit generate` and `drizzle-kit migrate`
- [ ] Write a seed script that creates 2 test users with activities, commitments, and entries for a full week

**Schema reference:**

```ts
// users
id, email, passwordHash, displayName, createdAt

// activities
id, userId, name, type (habit|task), weight (1-5),
recurrenceRule (json|null), isPrivate, createdAt, archivedAt

// commitments
id, userId, activityId, date, createdAt

// entries
id, userId, commitmentId, activityId, date, completedAt

// passive_wins
id, userId, note, source, date, createdAt

// friendships
id, userId, friendId, status (pending|accepted), createdAt
```

**Done when:** Migrations run clean, seed script populates data, Drizzle Studio shows all tables correctly.

---

## Phase 2 — Auth

**Goal:** Register and login working end to end. JWT issued and validated.

Tasks:
- [ ] `POST /auth/register` — email, password, displayName → creates user, returns JWT
- [ ] `POST /auth/login` — email, password → returns JWT
- [ ] Fastify auth plugin — validates Bearer JWT on protected routes, attaches `userId` to request
- [ ] All non-auth routes protected by default
- [ ] Verify with curl or a REST client

**Done when:** Can register, login, and hit a protected route with the token. Invalid token returns 401.

---

## Phase 3 — Activities API

**Goal:** Full CRUD for activities.

Tasks:
- [ ] `GET /activities` — list all activities for the current user (exclude archived)
- [ ] `POST /activities` — create an activity
- [ ] `PATCH /activities/:id` — update name, weight, recurrence, isPrivate
- [ ] `DELETE /activities/:id` — soft delete (set archivedAt), never hard delete
- [ ] Validate weight is 1–5
- [ ] Validate type is habit or task
- [ ] Return 404 if activity doesn't belong to current user

**Done when:** All routes work, validation rejects bad input, archived activities don't appear in list.

---

## Phase 4 — Commitments API

**Goal:** Users can commit activities to specific days.

Tasks:
- [ ] `GET /commitments?date=YYYY-MM-DD` — list commitments for a day
- [ ] `GET /commitments?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` — list for a range
- [ ] `POST /commitments` — commit an activity to a date
- [ ] `DELETE /commitments/:id` — remove a commitment (only if no entry exists for it)
- [ ] Prevent duplicate commitments (same userId + activityId + date)
- [ ] Validate activity belongs to current user before committing

**Done when:** Can plan a day by committing activities. Duplicates are rejected. Range queries return correct data.

---

## Phase 5 — Entries API

**Goal:** Users can mark commitments as done.

Tasks:
- [ ] `POST /entries` — mark a commitment complete (requires commitmentId)
- [ ] `DELETE /entries/:id` — unmark a completion
- [ ] Validate commitment belongs to current user
- [ ] Prevent duplicate entries for the same commitment
- [ ] Return the updated commitment with entry status in response

**Done when:** Can complete and uncomplete a commitment. Duplicate completions are rejected.

---

## Phase 6 — Scoring API

**Goal:** Score calculation correct for any date range and any user.

Tasks:
- [ ] `GET /scores/daily?date=YYYY-MM-DD` — returns daily score for current user
- [ ] `GET /scores/weekly?startDate=YYYY-MM-DD` — returns weekly score (7 days from start)
- [ ] `GET /scores/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` — returns a score per day in range
- [ ] Score = `Σ completed weights / Σ committed weights × 100`
- [ ] If committed weight is 0 for a day, return `null` not `0`
- [ ] Scores are always computed at query time, never stored
- [ ] Write unit tests for the scoring function covering: perfect day, partial day, rest day (null), tasks on single days only

**Scoring function signature:**
```ts
function computeScore(
  commitments: Commitment[],
  entries: Entry[],
  activities: Activity[]
): number | null
```

**Done when:** Unit tests pass. API returns correct scores for seeded data. Verify manually against known expected values.

---

## Phase 7 — Passive Wins API

**Goal:** Users can log passive wins.

Tasks:
- [ ] `GET /passive-wins?date=YYYY-MM-DD` — list passive wins for a day
- [ ] `POST /passive-wins` — log a passive win (note, source, date)
- [ ] `DELETE /passive-wins/:id` — remove a passive win

**Done when:** Can log, list, and delete passive wins. They never appear in score calculations.

---

## Phase 8 — Friends API

**Goal:** Users can add friends and see their scores.

Tasks:
- [ ] `POST /friends/request` — send a friend request by email
- [ ] `POST /friends/accept/:id` — accept a friend request
- [ ] `GET /friends` — list accepted friends
- [ ] `GET /friends/:friendId/scores/daily?date=YYYY-MM-DD` — get a friend's daily score
- [ ] `GET /friends/:friendId/scores/weekly?startDate=YYYY-MM-DD` — get a friend's weekly score
- [ ] Friend scores only include non-private activities
- [ ] Cannot see scores of non-friends
- [ ] Return `null` for days a friend has marked private

**Done when:** Two test users can friend each other and see each other's bars correctly. Private activities excluded from friend view.

---

## Phase 9 — Frontend: Today View

**Goal:** The core daily screen. This is the heart of the app.

Layout:
- Daily score bar at the top (large, prominent)
- List of today's commitments with complete/uncomplete toggle
- Button to add a commitment for today (picks from existing activities)
- Passive wins section below
- Clean, minimal, mobile-first

Tasks:
- [ ] Build typed API client in `lib/api.ts`
- [ ] Today view fetches commitments, entries, and score for today
- [ ] Each commitment shows activity name, weight, and done/not done state
- [ ] Tapping a commitment marks it complete (optimistic update)
- [ ] Score bar updates in real time as commitments are toggled
- [ ] Empty state when no commitments planned for today
- [ ] Add commitment sheet — searchable list of user's activities

**Done when:** Can open the app, see today's plan, check things off, and watch the bar fill up.

---

## Phase 10 — Frontend: Activities Management

**Goal:** Users can define and manage their activities.

Tasks:
- [ ] Activities list screen — all habits and tasks
- [ ] Create activity form — name, type, weight (1–5 slider), recurrence
- [ ] Edit activity — same form pre-filled
- [ ] Archive activity — soft delete with confirmation
- [ ] Archived activities hidden from main list
- [ ] Weight explained with simple copy ("how much does this affect your score?")

**Done when:** Can create, edit, and archive activities. Weight and type are clear to the user.

---

## Phase 11 — Frontend: History View

**Goal:** See past performance as a calendar grid.

Tasks:
- [ ] Calendar grid — each day is a coloured cell (green/amber/red/grey for rest)
- [ ] Tap a day to see that day's commitments and completion state
- [ ] Weekly score summary above the grid
- [ ] Scroll back through past weeks/months

**Done when:** Can review any past week and see what was planned vs completed.

---

## Phase 12 — Frontend: Friends View

**Goal:** The social bar — see friends' daily bars.

Tasks:
- [ ] Friends list with each friend's bar for today
- [ ] Toggle between daily and weekly view
- [ ] Add friend by email
- [ ] Pending requests shown separately
- [ ] Privacy — friends with all-private activities show no bar
- [ ] Tapping a friend shows their history grid (public activities only)

**Done when:** Two users can see each other's bars. Private activities are hidden. No ranks or scores shown, just bars.

---

## Phase 13 — Docker + Caddy

**Goal:** Runs in production on a VPS alongside Pothos.

Tasks:
- [ ] Finalise `docker-compose.yml` — backend, frontend, volume mounts for `/data`
- [ ] Caddy config for `tilld.yourdomain.com` → frontend, `tilld.yourdomain.com/api` → backend
- [ ] Environment variables via `.env` file on server
- [ ] Health check on backend `/health`
- [ ] Verify SQLite file persists across container restarts
- [ ] Document deployment steps in `README.md`

**Done when:** App runs on VPS, accessible via domain, data persists across redeploys.

---

## Out of Scope (for now)

These are explicitly deferred. Do not build them until the core is solid:

- Push notifications / reminders
- Pothos integration (savings as passive win)
- Mobile app (PWA first, native later)
- Public profiles
- Challenges between friends
- CSV export
- AI suggestions

---

## Definition of Done (overall)

- [ ] All 13 phases complete
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] Scoring unit tests pass
- [ ] Runs in Docker on a VPS
- [ ] Two real users can use it simultaneously without data leaking between them
- [ ] CLAUDE.md accurately reflects what was built
