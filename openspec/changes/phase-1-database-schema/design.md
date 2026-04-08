## Context

Phase 0 established a runnable Fastify backend and Drizzle configuration, but the database layer is still a stub. Phase 1 needs to turn that scaffold into a real SQLite schema and a repeatable local workflow for generating migrations, applying them, and seeding representative data for later API and UI phases.

The backend currently uses `better-sqlite3` and points Drizzle at `../data/tilld.db`. This phase should keep that single-file SQLite layout so the local dev environment and Docker volume continue to match.

## Goals / Non-Goals

**Goals:**
- Define all Phase 1 tables in Drizzle with the columns described in `PLAN.md`
- Add backend scripts for migration generation, migration application, and seeding
- Ensure migrations target the same SQLite file used in local and Docker development
- Seed enough relational data to support later auth, activity, commitment, entry, and friend features

**Non-Goals:**
- Implement auth routes or business logic
- Introduce a different database engine or ORM
- Optimize the seed data for production or large data volume
- Finalize production deployment concerns beyond keeping the current `/data` layout compatible

## Decisions

### Keep one schema source in `backend/src/db/schema.ts`
The current `drizzle.config.ts` points at `./src/schema.ts`, which was only a placeholder to unblock the scaffold. Phase 1 should move to a dedicated `src/db/` area and update the config to point at the real schema file so migrations, runtime DB access, and future repositories share one obvious home.

Alternative considered: keep the schema at `src/schema.ts`. Rejected because the backend will soon need a database client, migration runner, and seed utilities; a `src/db/` area scales better without spreading database code across the root `src/` folder.

### Use Drizzle SQL migrations committed to the repo
Generated SQL migrations should be stored in the backend and committed. That gives the project a stable schema history instead of relying on runtime table creation.

Alternative considered: create tables imperatively on startup. Rejected because it hides schema changes in application code and makes later deployments and rollbacks harder.

### Add explicit backend scripts for `db:generate`, `db:migrate`, and `db:seed`
Database lifecycle commands should live in `backend/package.json` so later phases and CI can invoke them consistently.

Alternative considered: rely on ad hoc CLI invocations. Rejected because it makes the migration and seed workflow less discoverable and harder to repeat correctly.

### Seed deterministic development data
The seed script should insert stable records for two users across a seven-day window, including activities, commitments, entries, and friendship records where applicable. Deterministic data makes score calculations and later API checks easier to verify.

Alternative considered: random fixture generation. Rejected because it makes later behavior checks harder to reason about and compare.

## Risks / Trade-offs

- Native SQLite access in Node and Docker can be sensitive to path differences -> Keep `DATABASE_URL` and migration scripts aligned on the same `data/tilld.db` file and verify both local and container flows in later apply steps
- The schema reference in `PLAN.md` is concise and leaves room for type choices such as timestamps and JSON storage -> Use straightforward SQLite-compatible column types and document any implied conventions in code where needed
- Seed data can drift from later API expectations -> Keep the seed script focused on canonical Phase 1 entities and avoid embedding business rules from future phases

## Migration Plan

1. Replace the placeholder schema file with the real Drizzle schema module
2. Add a database client and migration runner targeting `data/tilld.db`
3. Generate the initial migration and apply it to a fresh local SQLite file
4. Run the seed script against the migrated database
5. Verify the resulting tables and records using Drizzle tooling or SQLite inspection

Rollback is straightforward at this phase: remove the generated database file from `data/`, revert the migration artifacts, and rerun generation after fixing the schema.

## Open Questions

- Whether friendship seed data should include only accepted relationships or both pending and accepted examples
- Whether recurrence rules should be seeded with realistic JSON examples now or left nullable for most records until recurrence behavior is implemented
